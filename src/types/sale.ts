export type PaymentMethod = "cash" | "transfer" | "card" | "credit";
export type PaymentStatus = "paid" | "pending";
export type SaleStatus = "completed" | "cancelled";
export type DiscountType = "amount" | "percentage";

export type Sale = {
  id: string;
  sale_number: number;
  customer_id: string | null;
  customer_name: string | null;
  status: SaleStatus;
  subtotal: number;
  discount_total: number;
  discount_type: DiscountType | null;
  discount_value: number;
  tax_total: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  cancelled_at: string | null;
  item_count: number;
};

export type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  quantity: number;
  unit_price: number;
  unit_cost: number | null;
  subtotal: number;
  discount_type: DiscountType | null;
  discount_value: number;
};

export type SaleCustomerInfo = {
  name: string;
  identification: string | null;
  email: string | null;
  phone: string | null;
};

export type SaleDetail = Omit<Sale, "customer_name" | "item_count"> & {
  customer: SaleCustomerInfo | null;
  items: SaleItem[];
};