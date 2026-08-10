-- =========================================================
-- MÓDULO DE VENTAS Y CLIENTES
-- Requiere que ya exista el módulo de productos/inventario
-- =========================================================

-- =========================================
-- 1. CLIENTES
-- =========================================
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  identification_type text CHECK (identification_type IN ('cedula', 'ruc', 'pasaporte')),
  identification text,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone
);

CREATE UNIQUE INDEX idx_customers_identification
  ON public.customers(identification) WHERE identification IS NOT NULL;

-- =========================================
-- 2. VENTAS (cabecera)
-- =========================================
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_number bigint GENERATED ALWAYS AS IDENTITY,
  customer_id uuid REFERENCES public.customers(id), -- null = "Consumidor Final"
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount_total numeric(10,2) NOT NULL DEFAULT 0,
  tax_total numeric(10,2) NOT NULL DEFAULT 0, -- reservado para IVA cuando facturen
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'transfer', 'card', 'credit')),
  payment_status text NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending')),
  notes text,
  created_by uuid REFERENCES public.admins(id),
  created_at timestamp with time zone DEFAULT now(),
  cancelled_at timestamp with time zone
);

CREATE INDEX idx_sales_customer ON public.sales(customer_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);

-- =========================================
-- 3. LÍNEAS DE VENTA
-- =========================================
CREATE TABLE public.sale_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  product_name_snapshot text NOT NULL, -- nombre del producto en ese momento (sobrevive si se borra/renombra)
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,   -- precio de venta congelado en ese momento
  unit_cost numeric(10,2),             -- costo congelado en ese momento (margen histórico real)
  subtotal numeric(10,2) NOT NULL
);

CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON public.sale_items(product_id);

-- =========================================
-- 4. Trazabilidad hacia inventory_movements
-- =========================================
ALTER TABLE public.inventory_movements
  ADD COLUMN IF NOT EXISTS sale_id uuid REFERENCES public.sales(id) ON DELETE SET NULL;

CREATE INDEX idx_inventory_movements_sale ON public.inventory_movements(sale_id);

-- =========================================
-- 5. FUNCIÓN: crear una venta completa de forma atómica
-- p_items: [{"product_id": "...", "quantity": 2, "unit_price": 12.5}, ...]
-- unit_price es opcional por línea: si no lo mandas, usa el sale_price actual del producto
-- =========================================
CREATE OR REPLACE FUNCTION public.create_sale(
  p_customer_id uuid,
  p_items jsonb,
  p_payment_method text DEFAULT 'cash',
  p_payment_status text DEFAULT 'paid',
  p_notes text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_sale_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_item jsonb;
  v_product record;
  v_line_subtotal numeric(10,2);
BEGIN
  INSERT INTO public.sales (customer_id, payment_method, payment_status, notes, created_by, status)
  VALUES (p_customer_id, p_payment_method, p_payment_status, p_notes, p_created_by, 'completed')
  RETURNING id INTO v_sale_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT id, name, sale_price, purchase_price, stock INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Producto % no encontrado', v_item->>'product_id';
    END IF;

    v_line_subtotal := (v_item->>'quantity')::integer
      * COALESCE((v_item->>'unit_price')::numeric, v_product.sale_price);

    INSERT INTO public.sale_items (sale_id, product_id, product_name_snapshot, quantity, unit_price, unit_cost, subtotal)
    VALUES (
      v_sale_id,
      v_product.id,
      v_product.name,
      (v_item->>'quantity')::integer,
      COALESCE((v_item->>'unit_price')::numeric, v_product.sale_price),
      v_product.purchase_price,
      v_line_subtotal
    );

    -- Esto dispara trg_update_stock automáticamente y descuenta el stock del producto
    INSERT INTO public.inventory_movements (product_id, movement_type, quantity, unit_cost, reason, created_by, sale_id)
    VALUES (
      v_product.id,
      'out',
      (v_item->>'quantity')::integer,
      v_product.purchase_price,
      'Venta',
      p_created_by,
      v_sale_id
    );

    v_subtotal := v_subtotal + v_line_subtotal;
  END LOOP;

  UPDATE public.sales
  SET subtotal = v_subtotal, total = v_subtotal - discount_total + tax_total
  WHERE id = v_sale_id;

  RETURN v_sale_id;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- 6. FUNCIÓN: cancelar una venta (revierte el stock solo, vía el trigger existente)
-- =========================================
CREATE OR REPLACE FUNCTION public.cancel_sale(p_sale_id uuid)
RETURNS void AS $$
BEGIN
  -- Al borrar los movimientos ligados a esta venta, trg_update_stock
  -- ya revierte el stock automáticamente (no hay que hacerlo a mano)
  DELETE FROM public.inventory_movements WHERE sale_id = p_sale_id;

  UPDATE public.sales
  SET status = 'cancelled', cancelled_at = now()
  WHERE id = p_sale_id;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- 7. RLS (mismo criterio que el resto del admin)
-- =========================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_customers" ON public.customers
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));

CREATE POLICY "admin_full_access_sales" ON public.sales
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));

CREATE POLICY "admin_full_access_sale_items" ON public.sale_items
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));
