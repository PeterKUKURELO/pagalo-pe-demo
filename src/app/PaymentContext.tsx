import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  CardBrand,
  CartItem,
  DemoConfig,
  PaymentMethod,
  Service,
  Ticket,
  Transaction,
} from "./types";

interface PaymentContextValue {
  document: string;
  setDocument: (value: string) => void;
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (service: Service) => void;
  removeFromCart: (id: string) => void;
  duplicateCartItem: (id: string) => void;
  ticket: Ticket | null;
  createTicket: () => void;
  checkoutOpen: boolean;
  startCheckout: (method: PaymentMethod) => void;
  cancelCheckout: () => void;
  completePaymePayment: (response: unknown) => void;
  demoOpen: boolean;
  setDemoOpen: (value: boolean) => void;
  demo: DemoConfig;
  setDemo: (config: DemoConfig) => void;
  transaction: Transaction | null;
  transactions: Transaction[];
  simulateResult: () => void;
  attempt: number;
  recoveryOpen: boolean;
  setRecoveryOpen: (value: boolean) => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

const initialDemo: DemoConfig = {
  method: "tarjeta",
  brand: "Visa",
  acquirer: "ALIGNET",
  rule: "Adquirencia directa ALIGNET",
  result: "aprobado",
};

interface PaymeResponse {
  success?: unknown;
  merchant_operation_number?: unknown;
  transaction?: {
    state?: unknown;
    transaction_id?: unknown;
    payment_method?: {
      method_details?: {
        brand?: unknown;
      };
    };
  };
}

const paymeCardBrand = (value: unknown): CardBrand => {
  const brand = String(value ?? "").toLowerCase();
  if (brand.includes("master") || brand === "mscd") return "Mastercard";
  if (brand.includes("amex") || brand.includes("american")) return "American Express";
  if (brand.includes("diner")) return "Diners Club";
  return "Visa";
};

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [document, setDocument] = useState("72889333");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demo, setDemo] = useState(initialDemo);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const addToCart = (service: Service) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === service.id);
      if (!existing) return [...current, { ...service, quantity: 1 }];
      return current.map((item) =>
        item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const duplicateCartItem = (id: string) => {
    setCartItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    );
  };

  const createTicket = () => {
    if (!cartItems.length) return;
    setAttempt(0);
    setTransaction(null);
    setTicket({
      number: "260013318417",
      createdAt: new Intl.DateTimeFormat("es-PE").format(new Date()),
      status: "Pendiente",
      document,
      amount: cartTotal,
      items: cartItems,
    });
    setCartItems([]);
  };

  const startCheckout = (method: PaymentMethod) => {
    if (ticket?.status === "Pendiente de confirmación") return;
    setAttempt((value) => value + 1);
    setDemo((value) => ({
      ...value,
      method,
      ...(method === "yape"
        ? { acquirer: "Procesador de Yape", rule: "Enrutamiento exclusivo Yape" }
        : method === "qr"
          ? { acquirer: "ALIGNET", rule: "Pago QR interoperable" }
          : method === "payme"
            ? { acquirer: "ALIGNET", rule: "Orquestación Pay-me multimedio" }
            : { acquirer: "ALIGNET", rule: "Adquirencia directa ALIGNET" }),
    }));
    setRecoveryOpen(false);
    setDemoOpen(false);
    setCheckoutOpen(true);
  };

  const cancelCheckout = () => {
    setCheckoutOpen(false);
  };

  const completePaymePayment = (response: unknown) => {
    if (!ticket) return;

    const result =
      response && typeof response === "object"
        ? (response as PaymeResponse)
        : ({} as PaymeResponse);
    const approved =
      String(result.success).toLowerCase() === "true" ||
      String(result.transaction?.state).toUpperCase() === "AUTORIZADO";
    const now = new Date();
    const operationId = String(
      result.transaction?.transaction_id ??
        result.merchant_operation_number ??
        `OP-${now.getFullYear()}-${String(now.getTime()).slice(-8)}`,
    );

    const nextTransaction: Transaction = {
      operationId,
      ticket: ticket.number,
      method: demo.method,
      brand: paymeCardBrand(result.transaction?.payment_method?.method_details?.brand),
      acquirer: demo.method === "yape" ? "Procesador de Yape" : "ALIGNET",
      rule:
        demo.method === "yape"
          ? "Enrutamiento exclusivo Yape"
          : demo.method === "qr"
            ? "Pago QR interoperable"
            : demo.method === "payme"
              ? "Orquestación Pay-me multimedio"
              : "Adquirencia directa ALIGNET",
      attempt,
      result: approved ? "aprobado" : "rechazado",
      merchantConfirmation: approved
        ? "Autorización confirmada por Pay-me"
        : "Operación no autorizada por Pay-me",
      date: now.toLocaleString("es-PE"),
    };
    setTransaction(nextTransaction);
    setTransactions((current) => [...current, nextTransaction]);
    setCheckoutOpen(false);
    setDemoOpen(false);
    setTicket((current) =>
      current ? { ...current, status: approved ? "Pagado" : "Pendiente" } : current,
    );
    setRecoveryOpen(!approved);
  };

  const simulateResult = () => {
    if (!ticket || !checkoutOpen) return;
    const now = new Date();
    const nextTransaction: Transaction = {
      operationId: `OP-${now.getFullYear()}-${String(now.getTime()).slice(-8)}`,
      ticket: ticket.number,
      method: demo.method,
      brand: demo.method === "yape" ? "Visa" : demo.brand,
      acquirer: demo.acquirer,
      rule: demo.rule,
      attempt,
      result: demo.result,
      merchantConfirmation:
        demo.result === "aprobado"
          ? "Confirmación validada por backend"
          : demo.result === "pendiente"
            ? "En espera de confirmación"
            : "Sin confirmación de cobro",
      date: now.toLocaleString("es-PE"),
    };
    setTransaction(nextTransaction);
    setTransactions((current) => [...current, nextTransaction]);
    setCheckoutOpen(false);
    setDemoOpen(false);
    setTicket((current) =>
      current
        ? {
            ...current,
            status:
              demo.result === "aprobado"
                ? "Pagado"
                : demo.result === "pendiente"
                  ? "Pendiente de confirmación"
                  : "Pendiente",
          }
        : current,
    );
    if (demo.result !== "aprobado") setRecoveryOpen(true);
  };

  const value = useMemo(
    () => ({
      document,
      setDocument,
      cartItems,
      cartTotal,
      addToCart,
      removeFromCart,
      duplicateCartItem,
      ticket,
      createTicket,
      checkoutOpen,
      startCheckout,
      cancelCheckout,
      completePaymePayment,
      demoOpen,
      setDemoOpen,
      demo,
      setDemo,
      transaction,
      transactions,
      simulateResult,
      attempt,
      recoveryOpen,
      setRecoveryOpen,
    }),
    [
      document,
      cartItems,
      cartTotal,
      ticket,
      checkoutOpen,
      demoOpen,
      demo,
      transaction,
      transactions,
      attempt,
      recoveryOpen,
    ],
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment debe utilizarse dentro de PaymentProvider");
  return context;
}
