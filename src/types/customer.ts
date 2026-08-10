export type IdentificationType = "cedula" | "ruc" | "pasaporte";

export type Customer = {
  id: string;
  name: string;
  identification_type: IdentificationType | null;
  identification: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};