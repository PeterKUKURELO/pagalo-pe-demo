import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  CreditCard,
  Download,
  FileCheck2,
  Info,
  Menu,
  Pencil,
  ReceiptText,
  Search,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { usePayment } from "./PaymentContext";
import { useEffect, useRef, useState, type ReactNode } from "react";

const formatPEN = (amount: number) => `S/ ${amount.toFixed(2)}`;

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand ${dark ? "brand-dark" : ""}`}
      aria-label="Págalo.pe — Banco de la Nación"
    >
      <img
        className="brand-logo"
        src="/imagenes/new/logo-pagalo.svg"
        width="500"
        height="100"
        alt="Págalo.pe - Banco de la Nación"
      />
    </Link>
  );
}

export function Header({ loggedIn = false }: { loggedIn?: boolean }) {
  return (
    <header className={`site-header ${loggedIn ? "logged" : ""}`}>
      <div className="header-inner">
        <Brand />
        {loggedIn ? (
          <nav className="account-nav" aria-label="Navegación de cuenta">
            <Link to="/">
              <Search size={24} /> Buscar
            </Link>
            <Link to="/tickets">
              <ReceiptText size={24} /> Mis Tickets
            </Link>
            <Link to="/carrito" aria-label="Carrito">
              <ShoppingCart size={27} />
            </Link>
            <span className="avatar">PG</span>
          </nav>
        ) : (
          <>
            <nav className="main-nav">
              <NavLink to="/">Inicio</NavLink>
              <a href="#preguntas">Preguntas Frecuentes</a>
              <a href="#reclamos">Libro de Reclamaciones</a>
            </nav>
            <div className="header-actions">
              <Link className="header-search" to="/#buscar" aria-label="Ir al buscador">
                <Search size={27} />
              </Link>
              <Link className="white-pill" to="/tickets">
                Ingresar
              </Link>
            </div>
            <button className="menu-button" aria-label="Abrir menú">
              <Menu />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Brand dark />
          <p>
            <strong>Banco de la Nación | Ministerio de Economía y Finanzas</strong>
          </p>
          <p>Mesa de ayuda: (01) 442-4470 · Línea gratuita: 0-800-10700</p>
        </div>
        <div className="footer-links">
          <strong>Págalo.pe</strong>
          <a href="#que-es">¿Qué es?</a>
          <a href="#agencias">Ubicar agencias</a>
        </div>
      </div>
    </footer>
  );
}

export function Steps({ active }: { active: number }) {
  const items = [
    { icon: Search, name: "Búsqueda" },
    { icon: Pencil, name: "Registro" },
    { icon: ShoppingCart, name: "Carrito" },
    { icon: CreditCard, name: "Pago" },
    { icon: ReceiptText, name: "Constancia" },
  ];
  return (
    <div className="steps" aria-label={`Etapa actual: ${items[active].name}`}>
      {items.map(({ icon: Icon, name }, index) => (
        <div className={`step ${index <= active ? "active" : ""}`} key={name} title={name}>
          <span>
            <Icon size={16} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function InstitutionalLayout({
  children,
  loggedIn = false,
  className = "",
}: {
  children: ReactNode;
  loggedIn?: boolean;
  className?: string;
}) {
  return (
    <div className={`app-shell ${className}`}>
      <Header loggedIn={loggedIn} />
      {children}
      <Footer />
    </div>
  );
}

export function InfoPanel({ tickets = false }: { tickets?: boolean }) {
  return (
    <aside className="info-wrap">
      <h3>
        <Info size={20} /> Información
      </h3>
      <div className="info-card">
        {tickets ? (
          <>
            <h4>¿Cómo descargo mi constancia?</h4>
            <p>Puedes descargar todas las constancias de pago, ingresando a la opción “Ver”.</p>
            <p>
              Si tu ticket aún está pendiente de pago, puedes continuar con el proceso haciendo clic
              sobre el botón “Pagar”.
            </p>
            <h4>¿Por qué mi ticket está pendiente y no puedo pagarlo?</h4>
            <p>Una operación pendiente de confirmación se bloquea para evitar cobros duplicados.</p>
          </>
        ) : (
          <>
            <h4>¿Algo más que deba saber?</h4>
            <p>
              Recuerda revisar bien los datos ingresados y aceptar los términos y condiciones antes
              de proceder con el pago.
            </p>
            <div className="notice">
              Todo pago realizado después de las 9:00 p. m. o en días feriados se hará efectivo al
              día siguiente.
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export function Modal({
  children,
  onClose,
  wide = false,
}: {
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        {children}
      </div>
    </div>
  );
}

export function TicketDetail({ onClose, onPay }: { onClose: () => void; onPay: () => void }) {
  const { ticket } = usePayment();
  if (!ticket) return null;
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-heading">
        <h2>Detalle de Ticket</h2>
        <p>
          <strong>N° {ticket.number}</strong> <span className="status">Pendiente de pago</span>
        </p>
      </div>
      <div className="detail-table">
        <div className="detail-head">
          <span>Entidad</span>
          <span>Descripción</span>
          <span>Documento</span>
          <span>Importe</span>
        </div>
        {ticket.items.map((item) => (
          <div className="detail-row" key={item.id}>
            <span>
              <b className="entity-pill">{item.entityCode}</b>
            </span>
            <span>
              <strong>
                Tasa {item.code} - {item.description.toUpperCase()}
              </strong>
              <small>
                Entidad: {item.entity}
                {item.quantity > 1 ? ` · Cantidad: ${item.quantity}` : ""}
              </small>
            </span>
            <span>{ticket.document}</span>
            <span>{formatPEN(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="detail-total">
          Total a pagar <strong>{formatPEN(ticket.amount)}</strong>
        </div>
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Regresar
        </button>
        <button className="button primary" onClick={onPay}>
          Pagar ahora
        </button>
      </div>
    </Modal>
  );
}

export function PaymentSelector({
  onClose,
  onDetails,
}: {
  onClose: () => void;
  onDetails: () => void;
}) {
  const { ticket, startCheckout } = usePayment();
  if (!ticket) return null;
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-heading">
        <h2>Pago de Ticket</h2>
        <p>
          <strong>N° {ticket.number}</strong> <span className="status">Pendiente de pago</span>
        </p>
      </div>
      <div className="pay-total">
        Total a pagar <strong>{formatPEN(ticket.amount)}</strong>
      </div>
      <div className="payment-columns">
        <section>
          <h3>Pagar ahora con medios digitales</h3>
          <button className="method-card card-method" onClick={() => startCheckout("tarjeta")}>
            <span className="method-icon">
              <CreditCard />
            </span>
            <span className="card-method-content">
              <strong>Tarjeta de crédito o débito</strong>
              <small>Una sola experiencia para todas tus tarjetas</small>
              <span className="brand-row">
                <img
                  className="payment-brand visa-brand"
                  src="/imagenes/assets/visa.png"
                  alt="Visa"
                />
                <img
                  className="payment-brand mastercard-brand"
                  src="/imagenes/assets/mstc.png"
                  alt="Mastercard"
                />
                <img
                  className="payment-brand amex-brand"
                  src="/imagenes/assets/amex.png"
                  alt="American Express"
                />
                <img
                  className="payment-brand diners-brand"
                  src="/imagenes/assets/dinners.png"
                  alt="Diners Club"
                />
              </span>
            </span>
            <ArrowRight size={20} />
          </button>
          <button className="method-card yape-method" onClick={() => startCheckout("yape")}>
            <img
              className="yape-logo"
              src="/imagenes/assets/yape.png"
              alt="Yape"
              width="52"
              height="52"
            />
            <span>
              <strong>Paga con Yape</strong>
              <small>Ingresa directamente a la experiencia Yape</small>
            </span>
            <ArrowRight size={20} />
          </button>
          <button className="method-card payme-method" onClick={() => startCheckout("payme")}>
            <span className="payme-logo-wrap">
              <img
                className="payme-logo"
                src="/imagenes/assets/Pay-Me_logo.png"
                alt="Pay-me by Alignet"
              />
            </span>
            <span>
              <span className="recommended-label">RECOMENDADO</span>
              <strong>Paga con Pay-me</strong>
              <small>Todos tus medios de pago en una sola experiencia</small>
              <span className="payme-methods">
                <i>Todos los medios</i>
              </span>
            </span>
            <ArrowRight size={20} />
          </button>
        </section>
        <section>
          <h3>Pago presencial (descargar ticket)</h3>
          <button className="method-card multired">
            <span className="multired-logo">
              Agente <strong>MultiRed</strong>
            </span>
            <span>
              <strong>Banco de la Nación</strong>
              <small>Descarga el ticket para pagar en un agente</small>
            </span>
            <Download size={20} />
          </button>
        </section>
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Regresar
        </button>
        <button className="button dark" onClick={onDetails}>
          Ver detalles
        </button>
      </div>
    </Modal>
  );
}

export function PaymeCheckout() {
  const { attempt, cancelCheckout, checkoutOpen, completePaymePayment, demo, ticket } =
    usePayment();
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<FlexPaymentInstance | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!checkoutOpen || !ticket) return;

    let cancelled = false;
    const controller = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setStatus("loading");
    setErrorMessage("");

    const startPayment = async () => {
      try {
        if (!window.FlexPaymentForms) {
          throw new Error("La librería de Pay-me no está disponible.");
        }

        const sessionResponse = await fetch("/api/payme-session", {
          method: "POST",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const sessionText = await sessionResponse.text();
        let session: Record<string, unknown> = {};
        try {
          session = sessionText ? (JSON.parse(sessionText) as Record<string, unknown>) : {};
        } catch {
          session = {};
        }

        if (!sessionResponse.ok || !session.nonce || !session.merchant_code) {
          throw new Error(
            typeof session.error === "string"
              ? session.error
              : "No se pudo preparar el formulario seguro de Pay-me.",
          );
        }
        if (cancelled || !containerRef.current) return;

        const merchantOperationNumber = String(Date.now()).slice(-12);
        const purchaseName = ticket.items
          .map((item) => item.description)
          .join(", ")
          .slice(0, 120);
        const amountInCents = String(Math.round(ticket.amount * 100));

        containerRef.current.replaceChildren();
        instanceRef.current = new window.FlexPaymentForms({
          nonce: session.nonce,
          payload: {
            action: "authorize",
            channel: "ecommerce",
            merchant_code: session.merchant_code,
            merchant_operation_number: merchantOperationNumber,
            payment_method: {},
            payment_details: {
              amount: amountInCents,
              currency: "604",
              billing: {
                first_name: "Gabriel",
                last_name: "Kukurelo",
                email: "gabrielkukurelo@gmail.com",
                phone: { country_code: "+51", subscriber: "999999999" },
                location: {
                  line_1: "Lima",
                  line_2: "",
                  city: "Lima",
                  state: "Lima",
                  country: "PE",
                },
              },
              additional_fields: {
                purchase_name: purchaseName || `Ticket ${ticket.number}`,
                device_origin: /mobile|android|iphone|ipad/i.test(navigator.userAgent)
                  ? "celular"
                  : "laptop",
              },
            },
          },
          settings: {
            display_result_screen: true,
            show_close_button: true,
            show_border: true,
            show_operation_number: true,
          },
          display_settings: {
            methods:
              demo.method === "payme"
                ? ["CARD", "YAPE", "QR"]
                : [demo.method === "yape" ? "YAPE" : demo.method === "qr" ? "QR" : "CARD"],
          },
          i18n: { mode: "multi", default_language: "es", languages: ["es", "en"] },
        });

        instanceRef.current.init(
          containerRef.current,
          (response) => {
            if (!cancelled) completePaymePayment(response);
          },
          () => undefined,
          (error) => {
            if (cancelled) return;
            const message =
              error && typeof error === "object" && "message" in error
                ? String((error as { message?: unknown }).message ?? "")
                : String(error ?? "");

            if (message.trim().toLocaleLowerCase("es") === "cerro el carrito") {
              cancelCheckout();
              return;
            }

            setStatus("error");
            setErrorMessage(message || "Pay-me no pudo procesar la operación.");
          },
        );
        setStatus("ready");
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "No se pudo abrir la pasarela de pago.",
        );
      }
    };

    void startPayment();
    return () => {
      cancelled = true;
      controller.abort();
      document.body.style.overflow = previousOverflow;
      instanceRef.current?.terminate?.();
      instanceRef.current = null;
    };
  }, [attempt, checkoutOpen, demo.method, retryKey, ticket]);

  if (!checkoutOpen) return null;
  return (
    <div className="payme-overlay" role="dialog" aria-modal="true" aria-label="Pago con Pay-me">
      <div className="payme-shell">
        {status !== "ready" && (
          <button
            className="payme-close"
            type="button"
            onClick={cancelCheckout}
            aria-label="Cerrar"
          >
            <X />
          </button>
        )}
        {status !== "ready" && (
          <div className={`payme-status-card ${status === "error" ? "error" : ""}`}>
            {status === "loading" ? (
              <>
                <span className="payme-spinner" />
                <h2>Preparando pago seguro</h2>
                <p>Conectando con Pay-me…</p>
              </>
            ) : (
              <>
                <CircleHelp />
                <h2>No pudimos abrir Pay-me</h2>
                <p>{errorMessage}</p>
                <button
                  className="button primary"
                  onClick={() => setRetryKey((value) => value + 1)}
                >
                  Reintentar
                </button>
              </>
            )}
          </div>
        )}
        <div
          id="payme-flex-container"
          ref={containerRef}
          className={status === "ready" ? "ready" : ""}
        />
      </div>
    </div>
  );
}

export function DemoPanel() {
  const {
    demoOpen,
    setDemoOpen,
    demo,
    setDemo,
    attempt,
    checkoutOpen,
    transaction,
    simulateResult,
    ticket,
  } = usePayment();
  const navigate = useNavigate();
  const update = (key: keyof typeof demo, value: string) => setDemo({ ...demo, [key]: value });
  return (
    <>
      <button className="demo-trigger" onClick={() => setDemoOpen(!demoOpen)}>
        <ShieldCheck size={17} /> Modo Demo
      </button>
      {demoOpen && (
        <aside className="demo-panel">
          <div className="demo-title">
            <div>
              <small>Consola técnica</small>
              <h2>Gateway ALIGNET</h2>
            </div>
            <button onClick={() => setDemoOpen(false)} aria-label="Cerrar panel">
              <X />
            </button>
          </div>
          <p className="demo-lead">
            Configura el enrutamiento sin alterar la experiencia del ciudadano.
          </p>
          <div className="demo-grid">
            <label>
              Medio de pago
              <select value={demo.method} onChange={(e) => update("method", e.target.value)}>
                <option value="tarjeta">Tarjeta</option>
                <option value="yape">Yape</option>
                <option value="qr">QR</option>
                <option value="payme">Pay-me (todos los medios)</option>
              </select>
            </label>
            <label>
              Marca
              <select
                value={demo.brand}
                disabled={demo.method === "yape" || demo.method === "qr"}
                onChange={(e) => update("brand", e.target.value)}
              >
                <option>Visa</option>
                <option>Mastercard</option>
                <option>American Express</option>
                <option>Diners Club</option>
              </select>
            </label>
            <label>
              Adquirente / procesador
              <select value={demo.acquirer} onChange={(e) => update("acquirer", e.target.value)}>
                <option>ALIGNET</option>
                <option>Niubiz</option>
                <option>Izipay</option>
                <option>Procesador de Yape</option>
              </select>
            </label>
            <label>
              Regla de enrutamiento
              <select value={demo.rule} onChange={(e) => update("rule", e.target.value)}>
                <option>Adquirencia directa ALIGNET</option>
                <option>Continuidad por adquirente externo</option>
                <option>Balanceo por configuración</option>
                <option>Enrutamiento exclusivo Yape</option>
                <option>Pago QR interoperable</option>
                <option>Orquestación Pay-me multimedio</option>
              </select>
            </label>
            <label>
              Resultado
              <select value={demo.result} onChange={(e) => update("result", e.target.value)}>
                <option value="aprobado">Pago aprobado</option>
                <option value="rechazado">Pago rechazado</option>
                <option value="error">Error de procesamiento</option>
                <option value="pendiente">Pendiente de confirmación</option>
                <option value="cancelado">Cancelado por el usuario</option>
              </select>
            </label>
            <label>
              Número de intento
              <input value={attempt || 1} disabled />
            </label>
          </div>
          <div className="flow-line">
            {[
              "Págalo.pe",
              "Pay-me Flex",
              "ALIGNET Gateway",
              "Orquestador",
              demo.acquirer,
              "Resultado",
              "Banco de la Nación",
            ].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                {index < 6 && <ArrowRight size={12} />}
              </span>
            ))}
          </div>
          {checkoutOpen ? (
            <button className="button primary full" onClick={simulateResult}>
              Emitir resultado simulado
            </button>
          ) : (
            <div className="demo-hint">
              <Info size={16} /> Inicia un checkout para emitir el resultado configurado.
            </div>
          )}
          <div className="trace">
            <h3>Trazabilidad técnica</h3>
            <dl>
              <div>
                <dt>Ticket</dt>
                <dd>{ticket?.number || "Sin ticket"}</dd>
              </div>
              <div>
                <dt>Operación</dt>
                <dd>{transaction?.operationId || "Se generará al procesar"}</dd>
              </div>
              <div>
                <dt>Medio</dt>
                <dd>{transaction?.method || demo.method}</dd>
              </div>
              <div>
                <dt>Marca</dt>
                <dd>{transaction?.brand || demo.brand}</dd>
              </div>
              <div>
                <dt>Adquirente</dt>
                <dd>{transaction?.acquirer || demo.acquirer}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{transaction?.result || "Configurado"}</dd>
              </div>
              <div>
                <dt>Confirmación</dt>
                <dd>{transaction?.merchantConfirmation || "Pendiente de operación"}</dd>
              </div>
            </dl>
          </div>
          <button
            className="comparison-link"
            onClick={() => {
              navigate("/comparativa");
              setDemoOpen(false);
            }}
          >
            Ver comparativa comercial <ArrowRight size={16} />
          </button>
        </aside>
      )}
    </>
  );
}

export function RecoveryModal({
  onChangeMethod,
  onDetail,
}: {
  onChangeMethod: () => void;
  onDetail: () => void;
}) {
  const { transaction, ticket, startCheckout, setRecoveryOpen } = usePayment();
  const pending = transaction?.result === "pendiente";
  return (
    <Modal onClose={() => setRecoveryOpen(false)}>
      <div className="recovery">
        <span className={`result-icon ${pending ? "pending" : ""}`}>
          {pending ? <CircleHelp /> : <X />}
        </span>
        <h2>
          {pending
            ? "Pago pendiente de confirmación"
            : transaction?.result === "cancelado"
              ? "Pago cancelado"
              : "No pudimos completar tu pago"}
        </h2>
        <p>
          {pending
            ? "Estamos validando la operación anterior. Para evitar duplicidades, no podrás iniciar otro cobro hasta obtener un estado definitivo."
            : "Tu ticket y los datos del trámite se mantienen. Puedes volver a intentarlo sin generar un nuevo ticket."}
        </p>
        <div className="recovery-data">
          <span>
            Ticket <strong>{ticket?.number}</strong>
          </span>
          <span>
            Intento <strong>{transaction?.attempt}</strong>
          </span>
        </div>
        {!pending && (
          <div className="recovery-actions">
            <button onClick={() => startCheckout("tarjeta")}>
              Reintentar con la misma tarjeta
            </button>
            <button onClick={() => startCheckout("tarjeta")}>Utilizar otra tarjeta</button>
            <button onClick={onChangeMethod}>Cambiar medio de pago</button>
          </div>
        )}
        <button className="text-button" onClick={onDetail}>
          Regresar al detalle del ticket
        </button>
      </div>
    </Modal>
  );
}

export function Root() {
  return (
    <>
      <Outlet />
      <PaymeCheckout />
    </>
  );
}

export {
  Check,
  ChevronDown,
  Copy,
  FileCheck2,
  ReceiptText,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
};
