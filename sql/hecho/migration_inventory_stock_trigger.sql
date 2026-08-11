-- =========================================================
-- MIGRACIÓN: soporte para editar/eliminar movimientos de inventario
-- manteniendo products.stock siempre consistente
-- =========================================================

-- 1. Columna updated_at para poder auditar ediciones
ALTER TABLE public.inventory_movements
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone;

CREATE TRIGGER trg_inventory_movements_updated_at
BEFORE UPDATE ON public.inventory_movements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at(); -- reutiliza la función que ya tienes

-- 2. Reemplazamos la función del trigger para cubrir INSERT, UPDATE y DELETE
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.movement_type = 'in' THEN
      UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
    ELSE
      UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    -- revertimos el efecto que tuvo el movimiento eliminado
    IF OLD.movement_type = 'in' THEN
      UPDATE public.products SET stock = stock - OLD.quantity WHERE id = OLD.product_id;
    ELSE
      UPDATE public.products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
    END IF;
    RETURN OLD;

  ELSIF TG_OP = 'UPDATE' THEN
    -- revertimos el movimiento viejo (por si cambió cantidad, tipo o producto)...
    IF OLD.movement_type = 'in' THEN
      UPDATE public.products SET stock = stock - OLD.quantity WHERE id = OLD.product_id;
    ELSE
      UPDATE public.products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
    END IF;
    -- ...y aplicamos el movimiento nuevo
    IF NEW.movement_type = 'in' THEN
      UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
    ELSE
      UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Recreamos el trigger para que dispare en los tres casos
DROP TRIGGER IF EXISTS trg_update_stock ON public.inventory_movements;

CREATE TRIGGER trg_update_stock
AFTER INSERT OR UPDATE OR DELETE ON public.inventory_movements
FOR EACH ROW EXECUTE FUNCTION public.update_product_stock();
