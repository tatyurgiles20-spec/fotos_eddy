alter table public.sale_items
  add column if not exists discount_type text check (discount_type in ('amount', 'percentage')),
  add column if not exists discount_value numeric(10,2) not null default 0;

alter table public.sales
  add column if not exists discount_type text check (discount_type in ('amount', 'percentage')),
  add column if not exists discount_value numeric(10,2) not null default 0;


  CREATE OR REPLACE FUNCTION public.create_sale(
  p_customer_id uuid,
  p_items jsonb,
  p_payment_method text DEFAULT 'cash',
  p_payment_status text DEFAULT 'paid',
  p_notes text DEFAULT NULL,
  p_created_by uuid DEFAULT NULL,
  p_discount_type text DEFAULT NULL,
  p_discount_value numeric DEFAULT 0
)
RETURNS uuid AS $$
DECLARE
  v_sale_id uuid;
  v_subtotal numeric(10,2) := 0;      -- suma de líneas ANTES de descuento
  v_items_discount numeric(10,2) := 0; -- suma de descuentos por línea
  v_order_discount numeric(10,2) := 0;
  v_discount_total numeric(10,2) := 0;
  v_item jsonb;
  v_product record;
  v_raw_line numeric(10,2);
  v_line_discount numeric(10,2);
  v_line_net numeric(10,2);
  v_item_discount_type text;
  v_item_discount_value numeric(10,2);
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

    v_raw_line := (v_item->>'quantity')::integer
      * COALESCE((v_item->>'unit_price')::numeric, v_product.sale_price);

    v_item_discount_type := v_item->>'discount_type';
    v_item_discount_value := COALESCE((v_item->>'discount_value')::numeric, 0);

    v_line_discount := CASE
      WHEN v_item_discount_type = 'percentage' THEN v_raw_line * v_item_discount_value / 100
      WHEN v_item_discount_type = 'amount' THEN v_item_discount_value
      ELSE 0
    END;
    -- nunca dejamos que el descuento de línea deje el subtotal en negativo
    v_line_discount := LEAST(v_line_discount, v_raw_line);
    v_line_net := v_raw_line - v_line_discount;

    INSERT INTO public.sale_items (
      sale_id, product_id, product_name_snapshot, quantity, unit_price, unit_cost, subtotal,
      discount_type, discount_value
    )
    VALUES (
      v_sale_id,
      v_product.id,
      v_product.name,
      (v_item->>'quantity')::integer,
      COALESCE((v_item->>'unit_price')::numeric, v_product.sale_price),
      v_product.purchase_price,
      v_line_net,
      v_item_discount_type,
      v_item_discount_value
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

    v_subtotal := v_subtotal + v_raw_line;
    v_items_discount := v_items_discount + v_line_discount;
  END LOOP;

  -- Descuento a nivel de venta completa, aplicado sobre lo que queda
  -- después de los descuentos de línea
  v_order_discount := CASE
    WHEN p_discount_type = 'percentage' THEN (v_subtotal - v_items_discount) * COALESCE(p_discount_value, 0) / 100
    WHEN p_discount_type = 'amount' THEN COALESCE(p_discount_value, 0)
    ELSE 0
  END;
  v_order_discount := LEAST(v_order_discount, v_subtotal - v_items_discount);

  v_discount_total := v_items_discount + v_order_discount;

  UPDATE public.sales
  SET subtotal = v_subtotal,
      discount_total = v_discount_total,
      discount_type = p_discount_type,
      discount_value = COALESCE(p_discount_value, 0),
      total = v_subtotal - v_discount_total + tax_total
  WHERE id = v_sale_id;

  RETURN v_sale_id;
END;
$$ LANGUAGE plpgsql;