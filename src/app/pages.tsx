import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  Clock3,
  Download,
  Eye,
  FileText,
  History,
  Landmark,
  Scale,
  WalletCards,
  XCircle,
} from "lucide-react";
import {
  Check,
  ChevronDown,
  Copy,
  FileCheck2,
  Header,
  InfoPanel,
  InstitutionalLayout,
  Modal,
  PaymentSelector,
  ReceiptText,
  RecoveryModal,
  Search,
  ShoppingCart,
  Steps,
  TicketDetail,
  Trash2,
  UserRound,
} from "./components";
import { usePayment } from "./PaymentContext";
import type { Service, Ticket, Transaction } from "./types";

const services = {
  judicialNotification: {
    id: "judicial-notification",
    entity: "PODER JUDICIAL",
    entityCode: "PJ",
    code: "09970",
    description: "Derecho de notificación judicial",
    price: 4.6,
  },
  dniRenewal: {
    id: "dni-renewal",
    entity: "RENIEC",
    entityCode: "RENIEC",
    code: "02121",
    description: "Renovación de DNI mayores de 17 años",
    price: 30,
  },
  certifiedCopies: {
    id: "certified-copies",
    entity: "RENIEC",
    entityCode: "RENIEC",
    code: "02141",
    description: "Copias Certificadas de Actas Vía Internet",
    price: 10.3,
  },
  policeRecord: {
    id: "police-record",
    entity: "POLICÍA NACIONAL DEL PERÚ",
    entityCode: "PNP",
    code: "08116",
    description: "Antecedentes Policiales",
    price: 5.4,
  },
} satisfies Record<string, Service>;

const formatPEN = (amount: number) => `S/ ${amount.toFixed(2)}`;
const paymentMethodName = (method: Transaction["method"]) => {
  if (method === "yape") return "Yape";
  if (method === "qr") return "Pago con QR";
  if (method === "payme") return "Pay-me · Todos los medios";
  return "Tarjeta de crédito o débito";
};

const previousTickets = [
  {
    number: "260013317956",
    createdAt: "20/11/2026",
    status: "Pagado",
    document: "72889333",
    amount: 30,
    items: [{ ...services.dniRenewal, quantity: 1 }],
  },
  {
    number: "260013316842",
    createdAt: "14/11/2026",
    status: "Pagado",
    document: "72889333",
    amount: 4.6,
    items: [{ ...services.judicialNotification, quantity: 1 }],
  },
] satisfies Ticket[];

const previousTransactions = [
  {
    operationId: "OP-2026-91482631",
    ticket: "260013317956",
    method: "tarjeta",
    brand: "Visa",
    acquirer: "ALIGNET",
    rule: "Adquirencia directa ALIGNET",
    attempt: 1,
    result: "rechazado",
    merchantConfirmation: "Operación denegada por el emisor",
    date: "20/11/2026, 10:42:18 a. m.",
  },
  {
    operationId: "OP-2026-91482904",
    ticket: "260013317956",
    method: "tarjeta",
    brand: "Visa",
    acquirer: "ALIGNET",
    rule: "Adquirencia directa ALIGNET",
    attempt: 2,
    result: "aprobado",
    merchantConfirmation: "Autorización confirmada por Pay-me",
    date: "20/11/2026, 10:45:02 a. m.",
  },
  {
    operationId: "OP-2026-90274318",
    ticket: "260013316842",
    method: "yape",
    brand: "Visa",
    acquirer: "Procesador de Yape",
    rule: "Enrutamiento exclusivo Yape",
    attempt: 1,
    result: "aprobado",
    merchantConfirmation: "Confirmación validada por backend",
    date: "14/11/2026, 4:16:37 p. m.",
  },
] satisfies Transaction[];

const heroSlides = [
  {
    src: "/imagenes/Mujere%20con%20tarjeta.png",
    alt: "Mujer mostrando tarjetas mientras usa una laptop",
  },
  {
    src: "/imagenes/reloj%20chica.png",
    alt: "Mujer mostrando un reloj para destacar la disponibilidad del servicio",
  },
];

export function Home() {
  const [query, setQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const { addToCart } = usePayment();
  const navigate = useNavigate();
  const showResult = query.toLowerCase().includes("antecedentes");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const addService = (service: Service) => {
    addToCart(service);
    navigate("/carrito");
  };

  return (
    <div className="home-page">
      <Header />
      <main>
        <section className="hero">
          <div className="hero-content">
            <p>Hagámoslo fácil.</p>
            <h1>¿Qué pagamos hoy?</h1>
            <div className="home-search" id="buscar">
              <Search />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar trámite o entidad"
                aria-label="Buscar trámite o entidad"
              />
              {showResult && (
                <button className="search-result" onClick={() => navigate("/registro")}>
                  <span className="pnp-badge">PNP</span>
                  <span>
                    <strong>Antecedentes policiales</strong>
                    <small>Policía Nacional del Perú · Código 08116</small>
                  </span>
                  <ArrowRight />
                </button>
              )}
            </div>
            <div className="quick-links">
              <span>Lo más pagado del día:</span>
              <button>RENIEC</button>
              <button>PJ</button>
              <button>SUNAT</button>
            </div>
          </div>
          <div className="hero-visual" aria-label="Promociones de Págalo.pe">
            <div className="hero-slides">
              {heroSlides.map((slide, index) => {
                const isActive = index === activeSlide;
                return (
                  <img
                    key={slide.src}
                    className={`hero-slide ${isActive ? "active" : ""}`}
                    src={slide.src}
                    alt={isActive ? slide.alt : ""}
                    aria-hidden={!isActive}
                  />
                );
              })}
            </div>
            <div className="hero-carousel-controls" aria-label="Seleccionar imagen">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  className={index === activeSlide ? "active" : ""}
                  type="button"
                  aria-label={`Mostrar imagen ${index + 1}`}
                  aria-pressed={index === activeSlide}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="frequent">
          <p className="eyebrow">SERVICIOS PARA TI</p>
          <h2>¿Tienes prisa? ¡Lo sabemos!</h2>
          <p>
            A continuación te listamos las tasas y servicios más buscados en{" "}
            <strong>Págalo.pe</strong>
          </p>
          <div className="service-grid">
            <article>
              <Scale />
              <div>
                <h3>Derecho de notificación judicial</h3>
                <small>PODER JUDICIAL</small>
                <button
                  className="service-pay-link"
                  type="button"
                  onClick={() => addService(services.judicialNotification)}
                >
                  Págalo aquí
                </button>
              </div>
            </article>
            <article>
              <UserRound />
              <div>
                <h3>Renovación de DNI mayores de 17 años</h3>
                <small>RENIEC</small>
                <button
                  className="service-pay-link"
                  type="button"
                  onClick={() => addService(services.dniRenewal)}
                >
                  Págalo aquí
                </button>
              </div>
            </article>
            <article>
              <FileText />
              <div>
                <h3>Copias Certificadas de Actas Vía Internet</h3>
                <small>RENIEC</small>
                <button
                  className="service-pay-link"
                  type="button"
                  onClick={() => addService(services.certifiedCopies)}
                >
                  Págalo aquí
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export function Register() {
  const { addToCart, document, setDocument } = usePayment();
  const navigate = useNavigate();
  return (
    <InstitutionalLayout className="red-page">
      <main className="institutional-main">
        <div className="page-title">
          <Steps active={1} />
          <h1>Registro de Tasa</h1>
          <h2>POLICÍA NACIONAL DEL PERÚ</h2>
          <p>08116 - ANTECEDENTES POLICIALES</p>
        </div>
        <section className="form-card">
          <label>
            Concepto
            <div className="select-like">
              Certificado de Antecedentes Policiales - Virtual <ChevronDown />
            </div>
          </label>
          <label>
            Costo
            <input value="S/ 5.40" disabled />
          </label>
          <label>
            Tipo de documento
            <div className="select-like">
              DNI <ChevronDown />
            </div>
          </label>
          <label>
            Número de documento
            <input
              value={document}
              onChange={(event) => setDocument(event.target.value.replace(/\D/g, "").slice(0, 8))}
            />
          </label>
          <div className="form-row">
            <label>
              Cantidad
              <input value="1" disabled />
            </label>
            <label>
              Importe total
              <input value="S/ 5.40" disabled />
            </label>
          </div>
          <div className="form-actions">
            <button className="button secondary" onClick={() => navigate("/")}>
              Cancelar
            </button>
            <button
              className="button primary"
              onClick={() => {
                addToCart(services.policeRecord);
                navigate("/carrito");
              }}
              disabled={document.length !== 8}
            >
              <ShoppingCart size={18} /> Agregar al carrito
            </button>
          </div>
        </section>
      </main>
    </InstitutionalLayout>
  );
}

export function Cart() {
  const { cartItems, cartTotal, createTicket, document, duplicateCartItem, removeFromCart } =
    usePayment();
  const [accepted, setAccepted] = useState(false);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const signIn = () => {
    if (!cartItems.length) return;
    createTicket();
    navigate("/tickets");
  };
  return (
    <InstitutionalLayout className="red-page">
      <main className="institutional-main">
        <div className="page-title">
          <Steps active={2} />
          <h1>Carrito de compras</h1>
          <p>
            {itemCount} {itemCount === 1 ? "ARTÍCULO SELECCIONADO" : "ARTÍCULOS SELECCIONADOS"}
          </p>
        </div>
        <div className="two-columns">
          <section className="cart-card">
            <div className="cart-table">
              <div className="cart-head">
                <span>#</span>
                <span>Entidad</span>
                <span>Tasa - Descripción</span>
                <span>Costo</span>
                <span>Documento</span>
                <span>Opciones</span>
              </div>
              {cartItems.length ? (
                cartItems.map((item, index) => (
                  <div className="cart-row" key={item.id}>
                    <span>{index + 1}</span>
                    <span>
                      <b className="entity-pill">{item.entityCode}</b>
                    </span>
                    <span>
                      {item.code} - {item.description}
                      {item.quantity > 1 && <small>Cantidad: {item.quantity}</small>}
                    </span>
                    <span>{formatPEN(item.price * item.quantity)}</span>
                    <span>DNI-{document}</span>
                    <span className="option-icons">
                      <Link
                        to={item.id === "police-record" ? "/registro" : "/"}
                        aria-label={`Editar ${item.description}`}
                      >
                        <FileCheck2 />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Eliminar ${item.description}`}
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 />
                      </button>
                      <button
                        type="button"
                        aria-label={`Duplicar ${item.description}`}
                        onClick={() => duplicateCartItem(item.id)}
                      >
                        <Copy />
                      </button>
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-cart">
                  <ShoppingCart />
                  <p>Tu carrito está vacío.</p>
                  <Link to="/">Elegir un servicio</Link>
                </div>
              )}
            </div>
            <label className="terms">
              <input
                type="checkbox"
                checked={accepted}
                disabled={!cartItems.length}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              <span>
                <Check size={14} />
              </span>
              Aceptar los <a href="#terminos">Términos y Condiciones</a>
            </label>
            <div className="cart-total">
              Total a pagar: <strong>{formatPEN(cartTotal)}</strong>
            </div>
            <div className="cart-actions">
              <Link className="button secondary" to="/">
                Agregar otro pago
              </Link>
              <button
                className="button primary"
                disabled={!accepted || !cartItems.length}
                onClick={() => setLogin(true)}
              >
                Pagar
              </button>
            </div>
          </section>
          <InfoPanel />
        </div>
      </main>
      {login && (
        <Modal onClose={() => setLogin(false)}>
          <div className="login-modal">
            <span className="login-icon">
              <UserRound />
            </span>
            <h2>Ingresa a Págalo.pe</h2>
            <p>
              Para esta demostración no necesitas ingresar credenciales. Continuaremos con una
              cuenta ficticia segura.
            </p>
            <div className="demo-user">
              <span>GK</span>
              <div>
                <strong>gabrielkukurelo@gmail.com</strong>
                <small>D.N.I. : 72889333</small>
              </div>
              <CircleCheck />
            </div>
            <button className="button primary full" onClick={signIn}>
              Continuar a Mis Tickets
            </button>
            <small className="safe-note">
              No se solicitarán ni almacenarán datos personales reales.
            </small>
          </div>
        </Modal>
      )}
    </InstitutionalLayout>
  );
}

export function Tickets() {
  const { checkoutOpen, ticket, recoveryOpen, setRecoveryOpen, transaction, transactions } =
    usePayment();
  const [detail, setDetail] = useState(false);
  const [payment, setPayment] = useState(false);
  const [historicalTicket, setHistoricalTicket] = useState<Ticket | null>(null);
  const [expandedAttempts, setExpandedAttempts] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const previousTransactionResult = useRef(transaction?.result);
  const requestedStatus = searchParams.get("estado");
  const activeStatus =
    requestedStatus === "pendientes" || requestedStatus === "pagados" ? requestedStatus : "todos";
  const allTickets = ticket
    ? [ticket, ...previousTickets.filter((item) => item.number !== ticket.number)]
    : previousTickets;
  const pendingTickets = allTickets.filter((item) => item.status !== "Pagado");
  const paidTickets = allTickets.filter((item) => item.status === "Pagado");
  const allTransactions = [...transactions, ...previousTransactions];

  const setStatusFilter = (status: "todos" | "pendientes" | "pagados") => {
    if (status === "todos") setSearchParams({});
    else setSearchParams({ estado: status });
  };

  const renderTicket = (item: Ticket) => {
    const isCurrent = item.number === ticket?.number;
    const isPaid = item.status === "Pagado";
    const serviceCount = item.items.reduce((total, service) => total + service.quantity, 0);
    const paymentAttempts = allTransactions
      .filter((paymentAttempt) => paymentAttempt.ticket === item.number)
      .sort((first, second) => second.attempt - first.attempt);
    const deniedAttempts = paymentAttempts.filter(
      (paymentAttempt) => paymentAttempt.result === "rechazado",
    ).length;
    const attemptsAreExpanded = expandedAttempts === item.number;

    return (
      <div className="ticket-record" key={item.number}>
        <article className={`ticket-item ${attemptsAreExpanded ? "expanded" : ""}`}>
          <div className={`ticket-item-icon ${isPaid ? "paid" : "pending"}`}>
            {isPaid ? <CheckCircle2 /> : <Clock3 />}
          </div>
          <div className="ticket-item-main">
            <div className="ticket-item-title">
              <div>
                <span className="ticket-kicker">Número de pedido / ticket</span>
                <strong>{item.number}</strong>
              </div>
              <span className={`ticket-status ${isPaid ? "paid" : "pending"}`}>
                {isPaid ? <CheckCircle2 /> : <Clock3 />}
                {item.status === "Pendiente" ? "Pendiente de pago" : item.status}
              </span>
            </div>
            <p className="ticket-description">
              {item.items[0]?.entity} · {item.items[0]?.description}
              {item.items.length > 1 ? ` y ${item.items.length - 1} servicio más` : ""}
            </p>
            <div className="ticket-meta">
              <span>
                <CalendarDays /> Registrado el {item.createdAt}
              </span>
              <span>
                <FileText /> {serviceCount} {serviceCount === 1 ? "servicio" : "servicios"}
              </span>
              <span>DNI {item.document}</span>
              {paymentAttempts.length > 0 && (
                <button
                  className="attempts-toggle"
                  type="button"
                  aria-expanded={attemptsAreExpanded}
                  onClick={() => setExpandedAttempts(attemptsAreExpanded ? null : item.number)}
                >
                  <History /> {paymentAttempts.length}{" "}
                  {paymentAttempts.length === 1 ? "intento" : "intentos"}
                  {deniedAttempts > 0 && (
                    <b>
                      {deniedAttempts} denegado{deniedAttempts > 1 ? "s" : ""}
                    </b>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="ticket-item-side">
            <small>{isPaid ? "Importe pagado" : "Total por pagar"}</small>
            <strong>{formatPEN(item.amount)}</strong>
            {isPaid ? (
              <button
                className="ticket-action secondary-action"
                type="button"
                onClick={() => {
                  if (isCurrent && transaction) navigate("/confirmacion");
                  else setHistoricalTicket(item);
                }}
              >
                <Eye /> Ver constancia
              </button>
            ) : (
              <button
                className="ticket-action primary-action"
                type="button"
                disabled={item.status === "Pendiente de confirmación"}
                onClick={() => setDetail(true)}
              >
                <WalletCards />
                {item.status === "Pendiente de confirmación" ? "En validación" : "Pagar ahora"}
              </button>
            )}
          </div>
        </article>
        {attemptsAreExpanded && (
          <div className="payment-attempts">
            <div className="payment-attempts-heading">
              <div>
                <History />
                <div>
                  <strong>Historial de intentos</strong>
                  <small>Todos pertenecen al pedido {item.number}</small>
                </div>
              </div>
              <span>{paymentAttempts.length} en total</span>
            </div>
            <div className="payment-attempts-list">
              {paymentAttempts.map((paymentAttempt) => {
                const isApproved = paymentAttempt.result === "aprobado";
                const isDenied = paymentAttempt.result === "rechazado";
                return (
                  <div
                    className="payment-attempt"
                    key={`${paymentAttempt.operationId}-${paymentAttempt.attempt}`}
                  >
                    <span
                      className={`attempt-result-icon ${isApproved ? "approved" : isDenied ? "denied" : "waiting"}`}
                    >
                      {isApproved ? <CheckCircle2 /> : isDenied ? <XCircle /> : <Clock3 />}
                    </span>
                    <div className="attempt-main">
                      <div>
                        <strong>Intento {paymentAttempt.attempt}</strong>
                        <span
                          className={`attempt-result ${isApproved ? "approved" : isDenied ? "denied" : "waiting"}`}
                        >
                          {isApproved ? "Aprobado" : isDenied ? "Denegado" : "Pendiente"}
                        </span>
                      </div>
                      <p>{paymentAttempt.merchantConfirmation}</p>
                      <small>
                        {paymentAttempt.date} ·{" "}
                        {paymentAttempt.method === "payme"
                          ? `Pay-me · ${paymentAttempt.brand} · ${paymentAttempt.acquirer}`
                          : paymentAttempt.method === "yape"
                            ? "Yape"
                            : paymentAttempt.method === "qr"
                              ? "Pago con QR · ALIGNET"
                              : `${paymentAttempt.brand} · ${paymentAttempt.acquirer}`}
                      </small>
                    </div>
                    <div className="attempt-operation">
                      <small>N° de operación</small>
                      <strong>{paymentAttempt.operationId}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (transaction?.result === "aprobado" && previousTransactionResult.current !== "aprobado") {
      navigate("/confirmacion");
    }
    previousTransactionResult.current = transaction?.result;
  }, [transaction, navigate]);
  return (
    <InstitutionalLayout loggedIn className="red-page tickets-page">
      <main className="institutional-main">
        <div className="page-title">
          <h1>Mis Tickets</h1>
          <p>REVISA TUS PAGOS, CONTINÚA LOS PENDIENTES Y DESCARGA TUS CONSTANCIAS</p>
        </div>
        <div className="tickets-overview" aria-label="Resumen de tickets">
          <button
            className={`ticket-summary pending ${activeStatus === "pendientes" ? "active" : ""}`}
            type="button"
            onClick={() => setStatusFilter("pendientes")}
          >
            <span>
              <Clock3 />
            </span>
            <div>
              <strong>{pendingTickets.length}</strong>
              <small>Pendientes de pago</small>
            </div>
            <ArrowRight />
          </button>
          <button
            className={`ticket-summary paid ${activeStatus === "pagados" ? "active" : ""}`}
            type="button"
            onClick={() => setStatusFilter("pagados")}
          >
            <span>
              <CheckCircle2 />
            </span>
            <div>
              <strong>{paidTickets.length}</strong>
              <small>Pagados</small>
            </div>
            <ArrowRight />
          </button>
        </div>
        <section className="tickets-card">
          <div className="ticket-filters" aria-label="Filtrar tickets por estado">
            <button
              className={activeStatus === "todos" ? "active" : ""}
              onClick={() => setStatusFilter("todos")}
            >
              Todos <span>{allTickets.length}</span>
            </button>
            <button
              className={activeStatus === "pendientes" ? "active" : ""}
              onClick={() => setStatusFilter("pendientes")}
            >
              Pendientes <span>{pendingTickets.length}</span>
            </button>
            <button
              className={activeStatus === "pagados" ? "active" : ""}
              onClick={() => setStatusFilter("pagados")}
            >
              Pagados <span>{paidTickets.length}</span>
            </button>
          </div>
          {(activeStatus === "todos" || activeStatus === "pendientes") && (
            <div className="ticket-group">
              <div className="ticket-group-heading">
                <div>
                  <Clock3 />
                  <h2>Pendientes de pago</h2>
                </div>
                <span>{pendingTickets.length}</span>
              </div>
              {pendingTickets.length ? (
                pendingTickets.map(renderTicket)
              ) : (
                <div className="ticket-empty-state">
                  <CheckCircle2 />
                  <div>
                    <strong>Todo está al día</strong>
                    <p>No tienes tickets pendientes de pago.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {(activeStatus === "todos" || activeStatus === "pagados") && (
            <div className="ticket-group" id="pagados">
              <div className="ticket-group-heading paid-heading">
                <div>
                  <CheckCircle2 />
                  <h2>Pagados</h2>
                </div>
                <span>{paidTickets.length}</span>
              </div>
              {paidTickets.length ? (
                paidTickets.map(renderTicket)
              ) : (
                <div className="ticket-empty-state">
                  <ReceiptText />
                  <div>
                    <strong>Aún no hay pagos realizados</strong>
                    <p>Cuando completes un pago, podrás descargar aquí tu constancia.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        <div className="tickets-help-note">
          <InfoPanel tickets />
        </div>
      </main>
      {detail && (
        <TicketDetail
          onClose={() => setDetail(false)}
          onPay={() => {
            setDetail(false);
            setPayment(true);
          }}
        />
      )}
      {payment && !checkoutOpen && (
        <PaymentSelector
          onClose={() => setPayment(false)}
          onDetails={() => {
            setPayment(false);
            setDetail(true);
          }}
        />
      )}
      {recoveryOpen && (
        <RecoveryModal
          onChangeMethod={() => {
            setRecoveryOpen(false);
            setPayment(true);
          }}
          onDetail={() => {
            setRecoveryOpen(false);
            setDetail(true);
          }}
        />
      )}
      {historicalTicket && (
        <Modal onClose={() => setHistoricalTicket(null)}>
          <div className="historical-receipt">
            <span className="historical-receipt-icon">
              <CheckCircle2 />
            </span>
            <p className="eyebrow">PAGO REALIZADO</p>
            <h2>Constancia de pago</h2>
            <p>Ticket N° {historicalTicket.number}</p>
            <div>
              <span>Fecha de registro</span>
              <strong>{historicalTicket.createdAt}</strong>
              <span>Servicio</span>
              <strong>{historicalTicket.items[0]?.description}</strong>
              <span>Documento</span>
              <strong>DNI {historicalTicket.document}</strong>
              <span>Importe pagado</span>
              <strong>{formatPEN(historicalTicket.amount)}</strong>
            </div>
            <button className="button primary full" type="button" onClick={() => window.print()}>
              <Download /> Descargar constancia
            </button>
          </div>
        </Modal>
      )}
    </InstitutionalLayout>
  );
}

export function Confirmation() {
  const { ticket, transaction } = usePayment();
  const navigate = useNavigate();
  if (!ticket || !transaction)
    return (
      <div className="center-page">
        <Link to="/tickets">Volver a Mis Tickets</Link>
      </div>
    );
  return (
    <InstitutionalLayout loggedIn className="red-page confirmation-page">
      <main className="institutional-main">
        <div className="confirmation-topbar">
          <button type="button" onClick={() => navigate("/tickets")}>
            <ArrowLeft /> Volver a Mis Tickets
          </button>
          <Steps active={4} />
        </div>
        <section className="confirmation-card">
          <span className="confirmation-icon">
            <CheckCircle2 />
          </span>
          <p className="eyebrow">PAGO CONFIRMADO</p>
          <h1>Tu pago se realizó correctamente</h1>
          <p className="confirmation-lead">
            La operación fue confirmada por el comercio. Tu constancia ya está disponible.
          </p>
          <div className="receipt-data">
            <div>
              <span>Número de ticket</span>
              <strong>{ticket.number}</strong>
            </div>
            <div>
              <span>Número de operación</span>
              <strong>{transaction.operationId}</strong>
            </div>
            <div>
              <span>Fecha y hora</span>
              <strong>{transaction.date}</strong>
            </div>
            <div>
              <span>Medio de pago</span>
              <strong>{paymentMethodName(transaction.method)}</strong>
            </div>
            <div className="receipt-total">
              <span>Importe pagado</span>
              <strong>{formatPEN(ticket.amount)}</strong>
            </div>
          </div>
          <div className="confirmation-actions">
            <button className="button secondary" onClick={() => window.print()}>
              <FileText size={18} /> Descargar constancia
            </button>
            <button className="button primary" onClick={() => navigate("/tickets?estado=pagados")}>
              Ver mis tickets pagados
            </button>
          </div>
        </section>
      </main>
    </InstitutionalLayout>
  );
}

const current = [
  "Selección independiente por marca de tarjeta",
  "Visa mediante Niubiz y Mastercard mediante Izipay",
  "Experiencias diferenciadas según el procesador",
  "Yape con opciones adicionales de selección",
  "Limitaciones de reintento en el flujo identificado",
];
const proposed = [
  "Una única integración con Pay-me Flex",
  "Una sola experiencia de pago con tarjeta",
  "Adquirencia directa ALIGNET para Visa y Mastercard",
  "Orquestación de adquirentes externos",
  "Yape como método de pago independiente",
  "Reintentos controlados y trazabilidad centralizada",
  "Independencia entre experiencia y procesamiento",
];

export function Comparison() {
  return (
    <div className="comparison-page">
      <Header loggedIn />
      <main>
        <Link className="back-link" to="/tickets">
          ← Volver a Mis Tickets
        </Link>
        <p className="eyebrow">MODO DEMO · VISIÓN COMERCIAL</p>
        <h1>
          Una sola integración. Múltiples adquirentes.
          <br />
          Una única experiencia de pago.
        </h1>
        <p className="comparison-lead">
          El ciudadano mantiene una experiencia simple y consistente mientras ALIGNET centraliza las
          decisiones de procesamiento.
        </p>
        <div className="comparison-grid">
          <section className="architecture current">
            <span className="architecture-tag">ARQUITECTURA ACTUAL</span>
            <h2>Integraciones fragmentadas</h2>
            <div className="architecture-flow">
              <span>Visa</span>
              <ArrowRight />
              <span>Niubiz</span>
              <span>Mastercard</span>
              <ArrowRight />
              <span>Izipay</span>
            </div>
            <ul>
              {current.map((item) => (
                <li key={item}>
                  <span>×</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="architecture proposed">
            <span className="architecture-tag">PROPUESTA ALIGNET</span>
            <h2>Orquestación centralizada</h2>
            <div className="architecture-hub">
              <span>Págalo.pe</span>
              <ArrowRight />
              <b>
                Pay-me Flex
                <br />
                <small>ALIGNET Gateway</small>
              </b>
              <ArrowRight />
              <div>
                <i>ALIGNET</i>
                <i>Niubiz</i>
                <i>Izipay</i>
                <i>Yape</i>
              </div>
            </div>
            <ul>
              {proposed.map((item) => (
                <li key={item}>
                  <CheckCircle2 />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="commercial-note">
          <Landmark />
          <div>
            <strong>La experiencia no cambia cuando cambia el adquirente.</strong>
            <p>
              El Banco de la Nación conserva sus relaciones actuales e incorpora adquirencia directa
              ALIGNET desde una sola capa de integración.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="center-page">
      <Building2 />
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}
