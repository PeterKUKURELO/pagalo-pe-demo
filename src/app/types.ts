export type PaymentMethod = "tarjeta" | "yape" | "qr" | "payme";
export type CardBrand = "Visa" | "Mastercard" | "American Express" | "Diners Club";
export type Acquirer = "ALIGNET" | "Niubiz" | "Izipay" | "Procesador de Yape";
export type TransactionResult = "aprobado" | "rechazado" | "error" | "pendiente" | "cancelado";

export interface Service {
  id: string;
  entity: string;
  entityCode: string;
  code: string;
  description: string;
  price: number;
}

export interface CartItem extends Service {
  quantity: number;
}

export interface Ticket {
  number: string;
  createdAt: string;
  status: "Pendiente" | "Pendiente de confirmación" | "Pagado";
  document: string;
  amount: number;
  items: CartItem[];
}

export interface DemoConfig {
  method: PaymentMethod;
  brand: CardBrand;
  acquirer: Acquirer;
  rule: string;
  result: TransactionResult;
}

export interface Transaction {
  operationId: string;
  ticket: string;
  method: PaymentMethod;
  brand: CardBrand;
  acquirer: Acquirer;
  rule: string;
  attempt: number;
  result: TransactionResult;
  merchantConfirmation: string;
  date: string;
}
