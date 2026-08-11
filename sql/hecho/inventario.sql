-- =========================================================
-- MÓDULO DE PRODUCTOS Y SERVICIOS — SCRIPT COMPLETO
-- Requiere que ya existan: public.admins, public.images
-- =========================================================

-- =========================================
-- 1. CATEGORÍAS DE PRODUCTOS/SERVICIOS
-- =========================================
CREATE TABLE public.product_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer,
  created_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone
);

-- =========================================
-- 2. PRODUCTOS / SERVICIOS
-- =========================================
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.product_categories(id),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  meta_description text,
  type text NOT NULL DEFAULT 'product' CHECK (type IN ('product', 'service')),
  sku text,
  purchase_price numeric(10,2),
  sale_price numeric(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone,
  deleted_at timestamp with time zone
);

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_published ON public.products(is_published) WHERE deleted_at IS NULL;

-- =========================================
-- 3. IMÁGENES DE PRODUCTOS (reutiliza tabla images)
-- =========================================
CREATE TABLE public.product_images (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_id uuid NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  sort_order integer,
  PRIMARY KEY (product_id, image_id)
);

-- =========================================
-- 4. MOVIMIENTOS DE INVENTARIO (entradas/salidas)
-- =========================================
CREATE TABLE public.inventory_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type text NOT NULL CHECK (movement_type IN ('in', 'out')),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_cost numeric(10,2),
  reason text,
  created_by uuid REFERENCES public.admins(id),
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_inventory_movements_product ON public.inventory_movements(product_id);

-- =========================================
-- 5. CATEGORÍAS DESTACADAS (carrusel de la landing)
-- =========================================
CREATE TABLE public.category_highlights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.product_categories(id),
  target_type text NOT NULL CHECK (target_type IN ('product', 'service')),
  description text,
  image_id uuid REFERENCES public.images(id),
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_category_highlights_visible ON public.category_highlights(is_visible);

-- =========================================
-- 6. VISTA: ranking de ventas (productos y servicios más vendidos)
-- =========================================
CREATE OR REPLACE VIEW public.product_sales_ranking AS
SELECT
  p.id AS product_id,
  p.type,
  p.is_published,
  p.deleted_at,
  COALESCE(SUM(m.quantity), 0) AS total_sold
FROM public.products p
LEFT JOIN public.inventory_movements m
  ON m.product_id = p.id AND m.movement_type = 'out'
GROUP BY p.id, p.type, p.is_published, p.deleted_at;

-- =========================================
-- 7. TRIGGER: mantener products.stock sincronizado
-- =========================================
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS trigger AS $$
BEGIN
  IF NEW.movement_type = 'in' THEN
    UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
  ELSE
    UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock
AFTER INSERT ON public.inventory_movements
FOR EACH ROW EXECUTE FUNCTION public.update_product_stock();

-- =========================================
-- 8. TRIGGER: updated_at automático en products
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================
-- 9. RLS (Row Level Security)
-- =========================================
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_highlights ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "public_read_categories" ON public.product_categories
  FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "public_read_published_products" ON public.products
  FOR SELECT USING (is_published = true AND deleted_at IS NULL);

CREATE POLICY "public_read_product_images" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id
      AND p.is_published = true AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "public_read_visible_highlights" ON public.category_highlights
  FOR SELECT USING (is_visible = true);

-- inventory_movements NO tiene policy pública: es información interna de costos/stock

-- Acceso total para admins (ajusta si ya usas una función is_admin() propia)
CREATE POLICY "admin_full_access_categories" ON public.product_categories
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));

CREATE POLICY "admin_full_access_products" ON public.products
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));

CREATE POLICY "admin_full_access_product_images" ON public.product_images
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));

CREATE POLICY "admin_full_access_inventory" ON public.inventory_movements
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));

CREATE POLICY "admin_full_access_highlights" ON public.category_highlights
  FOR ALL USING (auth.uid() IN (SELECT id FROM public.admins))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admins));