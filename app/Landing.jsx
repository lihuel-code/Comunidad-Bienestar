"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   CONFIGURACIÓN  —  editá solo esta parte
   ----------------------------------------------------------------------------
   Al enviar el formulario se abre WhatsApp con los datos ya escritos.
   No hay backend.
============================================================================ */

// Número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
// Argentina (celular) lleva el 9 después del 54:  54 9 11 5323 0047
// ⚠️ Si al tocar un botón se abre WhatsApp pero NO aparece el texto escrito,
//    probá sin el 9: "541153230047".
const WHATSAPP_NUMBER = "5491153230047";

const WA_MESSAGES = {
  hola: "¡Hola Comunidad Bienestar! Quiero info para bajar de peso 💜",
  plan: (plan) => `¡Hola Comunidad Bienestar! Quiero info sobre el plan: ${plan}`,
};

// (OPCIONAL) Recibir también los formularios por email. Creá uno gratis en
// https://formspree.io y pegá tu endpoint. Vacío = solo abre WhatsApp.
const FORMSPREE_ENDPOINT = ""; // ej: "https://formspree.io/f/xxxxxxx"

// (OPCIONAL) Conversión de Google Ads. Completá tu etiqueta cuando la tengas.
const GADS_CONVERSION = { send_to: "" }; // ej: "AW-123456789/AbC-D_efg"

/* ============================================================================
   Utilidades
============================================================================ */

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

function trackConversion() {
  // Descomentá cuando tengas gtag configurado y tu etiqueta arriba.
  // if (typeof window !== "undefined" && window.gtag && GADS_CONVERSION.send_to) {
  //   window.gtag("event", "conversion", { send_to: GADS_CONVERSION.send_to });
  // }
}

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.337A11.815 11.815 0 0 0 12.045 0C5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.581 0 11.94-5.359 11.943-11.893a11.821 11.821 0 0 0-3.473-8.453";

function WaIcon({ className = "ic-wa" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={WA_PATH} />
    </svg>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const countDigits = (v) => (v.match(/\d/g) || []).length;

/* ============================================================================
   Componente
============================================================================ */

export default function Landing() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const formCardRef = useRef(null);
  const nombreRef = useRef(null);
  const telRef = useRef(null);
  const emailRef = useRef(null);
  const msgRef = useRef(null);
  const hpRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const waHola = waLink(WA_MESSAGES.hola);
  const waPlan = (p) => waLink(WA_MESSAGES.plan(p));

  // Sombra del header al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Barra sticky móvil: aparece al pasar el hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => setShowBar(!entry.isIntersecting),
        { rootMargin: "-40% 0px 0px 0px" }
      );
      io.observe(hero);
      return () => io.disconnect();
    }
    const onScroll = () => setShowBar(window.scrollY > hero.offsetHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveals sutiles al hacer scroll (respeta reduce-motion y no oculta lo visible)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll(".pain, .feature, .plan, .step, .testi")
    );
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const sibs = Array.from(el.parentElement.children).filter((n) =>
            n.classList.contains("reveal")
          );
          const i = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (inView) {
        el.classList.add("is-visible");
      } else {
        el.classList.add("reveal");
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  const clearErr = (name) =>
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));

  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      nombreRef.current?.focus({ preventScroll: true });
    }, 520);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Honeypot anti-spam
    if (hpRef.current && hpRef.current.value.trim() !== "") return;

    const nombre = nombreRef.current.value.trim();
    const telefono = telRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const mensaje = msgRef.current ? msgRef.current.value.trim() : "";

    const next = {};
    if (!nombre) next.nombre = "Contanos tu nombre.";
    if (!telefono) next.telefono = "Necesitamos un teléfono para escribirte.";
    else if (countDigits(telefono) < 8)
      next.telefono = "Revisá el número, parece incompleto.";
    if (!email) next.email = "Dejanos tu email.";
    else if (!EMAIL_RE.test(email)) next.email = "Ese email no parece válido.";

    if (Object.keys(next).length) {
      setErrors(next);
      const order = ["nombre", "telefono", "email"];
      const firstKey = order.find((k) => next[k]);
      const map = { nombre: nombreRef, telefono: telRef, email: emailRef };
      map[firstKey]?.current?.focus();
      return;
    }

    setErrors({});

    const lines = [
      "¡Hola Comunidad Bienestar! Quiero empezar a bajar de peso.",
      "",
      `• Nombre: ${nombre}`,
      `• Teléfono: ${telefono}`,
      `• Email: ${email}`,
    ];
    if (mensaje) lines.push(`• Mi situación: ${mensaje}`);
    const waText = lines.join("\n");

    if (FORMSPREE_ENDPOINT) {
      try {
        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, telefono, email, mensaje }),
        }).catch(() => {});
      } catch (_) {}
    }

    trackConversion();

    setSubmitted(true);
    window.open(waLink(waText), "_blank", "noopener");
    formRef.current?.reset();
  };

  return (
    <div ref={rootRef}>
      {/* ===================== HEADER ===================== */}
      <header className={"site-header" + (scrolled ? " scrolled" : "")}>
        <div className="container header-inner">
          <a href="#top" className="brand" aria-label="Comunidad Bienestar — inicio">
            <img
              src="/assets/logo-color.png"
              alt="Comunidad Bienestar"
              className="brand-logo"
              width="240"
              height="50"
            />
          </a>
          <a
            className="btn btn-wa header-wa"
            href={waHola}
            target="_blank"
            rel="noopener"
            aria-label="Escribinos por WhatsApp"
          >
            <WaIcon />
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* ===================== HERO + FORM ===================== */}
        <section className="hero" ref={heroRef}>
          <svg
            className="hero-ribbon"
            viewBox="0 0 1200 520"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#878787" stopOpacity="0.55" />
                <stop offset="0.55" stopColor="#9B22BD" />
                <stop offset="1" stopColor="#A7DF65" />
              </linearGradient>
            </defs>
            <path
              d="M-40,300 C160,150 300,150 420,300 C540,450 700,450 820,300 C940,150 1100,150 1260,300"
              fill="none"
              stroke="url(#ribbonGrad)"
              strokeWidth="46"
              strokeLinecap="round"
            />
          </svg>

          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="kicker">
                <span className="kicker-leaf" aria-hidden="true" />
                Acompañamiento profesional + comunidad
              </span>
              <p className="script-accent">Esta vez, en serio</p>
              <h1 className="hero-title">¿Querés bajar de peso?</h1>
              <p className="hero-lead">
                Probaste mil dietas y, después del envión del principio, el hambre y
                los antojos te ganan. Te rendís… y recuperás todo lo que habías bajado.
              </p>
              <p className="hero-bridge">
                Hay otra forma: con un <strong>plan realista</strong>, profesionales que
                te siguen de cerca y un grupo que te banca. Y no, no tenés que pasar hambre.
              </p>

              <div className="chips">
                <span className="chip">Acompañamiento profesional</span>
                <span className="chip">Comunidad que te sostiene</span>
                <span className="chip">Sin dietas imposibles</span>
              </div>

              <div className="hero-cta">
                <a
                  href="#reservar"
                  className="btn btn-primary btn-lg js-scroll"
                  onClick={scrollToForm}
                >
                  Reservá tu lugar
                </a>
                <a
                  className="btn btn-wa btn-lg"
                  href={waHola}
                  target="_blank"
                  rel="noopener"
                  aria-label="Escribinos por WhatsApp"
                >
                  <WaIcon />
                  <span>Escribinos por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* FORMULARIO SUPERIOR */}
            <div className="form-card" id="reservar" ref={formCardRef}>
              <div className="form-head">
                <span className="form-kicker">
                  <span className="kicker-leaf" aria-hidden="true" />
                  Cupos limitados por grupo
                </span>
                <h2 className="form-title">Reservá tu lugar en el próximo grupo</h2>
                <p className="form-sub">
                  Dejanos tus datos y te escribimos por WhatsApp para contarte cómo empezar.
                </p>
              </div>

              <form ref={formRef} className="lead-form" noValidate onSubmit={handleSubmit}>
                <div className={"field" + (errors.nombre ? " invalid" : "")}>
                  <label htmlFor="nombre">Nombre y apellido</label>
                  <input
                    ref={nombreRef}
                    type="text"
                    id="nombre"
                    name="nombre"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    required
                    onInput={() => clearErr("nombre")}
                  />
                  <small className="err">{errors.nombre}</small>
                </div>

                <div className={"field" + (errors.telefono ? " invalid" : "")}>
                  <label htmlFor="telefono">Teléfono / WhatsApp</label>
                  <input
                    ref={telRef}
                    type="tel"
                    id="telefono"
                    name="telefono"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Ej: 11 5555 5555"
                    required
                    onInput={() => clearErr("telefono")}
                  />
                  <small className="err">{errors.telefono}</small>
                </div>

                <div className={"field" + (errors.email ? " invalid" : "")}>
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tucorreo@email.com"
                    required
                    onInput={() => clearErr("email")}
                  />
                  <small className="err">{errors.email}</small>
                </div>

                <div className="field">
                  <label htmlFor="mensaje">
                    Contanos un poco tu situación <span className="opt">(opcional)</span>
                  </label>
                  <textarea
                    ref={msgRef}
                    id="mensaje"
                    name="mensaje"
                    rows="2"
                    placeholder="Qué te gustaría lograr…"
                  />
                </div>

                {/* Anti-spam (no tocar) */}
                <input
                  ref={hpRef}
                  type="text"
                  name="website"
                  className="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  Quiero empezar
                </button>
                <p className="form-note">
                  Te contactamos a la brevedad. Usamos tus datos solo para responderte.
                </p>

                {submitted && (
                  <div className="form-success" role="status">
                    <strong>¡Listo! 🎉</strong> Te llevamos a WhatsApp para terminar. Si no
                    se abre solo, escribinos al{" "}
                    <a href={waHola} target="_blank" rel="noopener">
                      +54 11 5323 0047
                    </a>
                    .
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* ===================== EMPATÍA ===================== */}
        <section className="section section-soft">
          <div className="container narrow center">
            <span className="kicker kicker-center">¿Te suena?</span>
            <h2 className="section-title">La misma historia, una y otra vez</h2>
          </div>
          <div className="container pains">
            <div className="pain">
              <span className="pain-ic" aria-hidden="true">↻</span>
              <p>Arrancás con todo el lunes… y para el finde ya abandonaste.</p>
            </div>
            <div className="pain">
              <span className="pain-ic" aria-hidden="true">↻</span>
              <p>Bajás unos kilos, pero apenas soltás la dieta, vuelven todos.</p>
            </div>
            <div className="pain">
              <span className="pain-ic" aria-hidden="true">↻</span>
              <p>Lo intentás en soledad, te frustrás y sentís que es tu culpa.</p>
            </div>
          </div>
          <div className="container narrow center">
            <p className="reframe">
              El problema no sos vos. Es hacerlo <em>en soledad</em> y a fuerza de dietas
              extremas que nadie puede sostener.{" "}
              <span className="reframe-strong">Te ayudamos a romper ese círculo.</span>
            </p>
          </div>
        </section>

        {/* ===================== CÓMO ACOMPAÑAMOS ===================== */}
        <section className="section">
          <div className="container narrow center">
            <span className="kicker kicker-center">
              <span className="kicker-leaf" aria-hidden="true" />
              Nuestro método
            </span>
            <h2 className="section-title">Así te acompañamos</h2>
            <p className="section-sub">
              Pensado para que el cambio sea posible… y se mantenga en el tiempo.
            </p>
          </div>
          <div className="container features">
            <article className="feature">
              <span className="feat-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 21s8-4.5 8-11a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 6.5 8 11 8 11z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3>Acompañamiento profesional</h3>
              <p>Un equipo que te sigue de cerca y ajusta tu plan según cómo vas avanzando.</p>
            </article>
            <article className="feature">
              <span className="feat-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 6.5a3 3 0 0 1 0 5.6M17.5 20c0-2.2-1-4-2.6-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h3>Una comunidad que te sostiene</h3>
              <p>Un grupo que vive lo mismo que vos y te motiva justo cuando aflojan las ganas.</p>
            </article>
            <article className="feature">
              <span className="feat-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <h3>Plan realista y a tu medida</h3>
              <p>Comés rico y variado. Nada de dietas imposibles ni de pasar hambre para lograrlo.</p>
            </article>
            <article className="feature">
              <span className="feat-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5.5 12c0-2 1.4-3.4 3-3.4 1.4 0 2.3 1 3.5 2.4 1.2 1.4 2.1 2.4 3.5 2.4 1.6 0 3-1.4 3-3.4s-1.4-3.4-3-3.4c-1.4 0-2.3 1-3.5 2.4-1.2 1.4-2.1 2.4-3.5 2.4-1.6 0-3-1.4-3-3.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(0 2.4)"
                  />
                </svg>
              </span>
              <h3>Resultados que se mantienen</h3>
              <p>Aprendés hábitos para sostener el cambio y no volver a empezar de cero nunca más.</p>
            </article>
          </div>
        </section>

        {/* ===================== PLANES ===================== */}
        <section className="section section-soft">
          <div className="container narrow center">
            <span className="kicker kicker-center">Planes</span>
            <h2 className="section-title">Elegí tu camino</h2>
            <p className="section-sub">
              Si no sabés cuál te conviene, escribinos y te ayudamos a decidir.
            </p>
          </div>
          <div className="container plans">
            <article className="plan">
              <h3 className="plan-name">Vale Bienestar</h3>
              <p className="plan-desc">
                El primer paso ideal para conocernos y empezar a cuidarte, sin grandes compromisos.
              </p>
              <a className="plan-link" href={waPlan("Vale Bienestar")} target="_blank" rel="noopener">
                Consultar <span aria-hidden="true">→</span>
              </a>
            </article>
            <article className="plan plan-featured">
              <span className="plan-badge">El más elegido</span>
              <h3 className="plan-name">Descenso de Peso</h3>
              <p className="plan-desc">
                Nuestro programa principal para bajar de peso de forma saludable y acompañada.
              </p>
              <a className="plan-link" href={waPlan("Descenso de Peso")} target="_blank" rel="noopener">
                Consultar <span aria-hidden="true">→</span>
              </a>
            </article>
            <article className="plan">
              <h3 className="plan-name">Plan 1 × 1</h3>
              <p className="plan-desc">
                Atención personalizada, 100% enfocada en vos, tu ritmo y tus objetivos.
              </p>
              <a className="plan-link" href={waPlan("Plan 1x1")} target="_blank" rel="noopener">
                Consultar <span aria-hidden="true">→</span>
              </a>
            </article>
            <article className="plan">
              <h3 className="plan-name">Mantenimiento</h3>
              <p className="plan-desc">
                Ya llegaste a tu meta. Te ayudamos a sostener el resultado en el tiempo.
              </p>
              <a className="plan-link" href={waPlan("Mantenimiento")} target="_blank" rel="noopener">
                Consultar <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
        </section>

        {/* ===================== PASOS ===================== */}
        <section className="section">
          <div className="container narrow center">
            <span className="kicker kicker-center">
              <span className="kicker-leaf" aria-hidden="true" />
              Simple
            </span>
            <h2 className="section-title">Empezar es así de fácil</h2>
          </div>
          <div className="container steps">
            <div className="step">
              <span className="step-num">01</span>
              <h3>Dejanos tus datos</h3>
              <p>Completás el formulario de arriba o nos escribís directo por WhatsApp.</p>
            </div>
            <div className="step-line" aria-hidden="true" />
            <div className="step">
              <span className="step-num">02</span>
              <h3>Armamos tu plan</h3>
              <p>Charlamos tu situación y definimos juntas/os el camino ideal para vos.</p>
            </div>
            <div className="step-line" aria-hidden="true" />
            <div className="step">
              <span className="step-num">03</span>
              <h3>Arrancás acompañada/o</h3>
              <p>Sumás a tu grupo y empezás con seguimiento profesional desde el día uno.</p>
            </div>
          </div>
        </section>

        {/* ===================== TESTIMONIOS =====================
            NOTA: reemplazá estos textos por testimonios reales de tus clientes. */}
        <section className="section section-soft">
          <div className="container narrow center">
            <span className="kicker kicker-center">Comunidad</span>
            <h2 className="section-title">Lo que se vive adentro</h2>
          </div>
          <div className="container testis">
            <figure className="testi">
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>
                Por primera vez no lo viví como un sacrificio. El grupo te empuja los días que
                no tenés ganas.
              </blockquote>
              <figcaption>María — comunidad de descenso</figcaption>
            </figure>
            <figure className="testi">
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>
                Bajé de a poco, sin pasar hambre, y lo más importante: esta vez lo pude sostener.
              </blockquote>
              <figcaption>Carolina — plan a medida</figcaption>
            </figure>
            <figure className="testi">
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>
                El acompañamiento hace toda la diferencia. Saber que no estás sola te cambia la cabeza.
              </blockquote>
              <figcaption>Lucía — grupo de mantenimiento</figcaption>
            </figure>
          </div>
        </section>

        {/* ===================== CTA FINAL ===================== */}
        <section className="cta-band">
          <svg
            className="cta-ribbon"
            viewBox="0 0 1200 240"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M0,140 C200,40 380,40 600,140 C820,240 1000,240 1200,140"
              fill="none"
              stroke="rgba(255,255,255,.18)"
              strokeWidth="40"
              strokeLinecap="round"
            />
          </svg>
          <div className="container center cta-inner">
            <p className="script-accent script-light">Tu lugar te espera</p>
            <h2 className="cta-title">Sumate al próximo grupo</h2>
            <p className="cta-sub">
              Los cupos son limitados para poder acompañarte de verdad. Reservá el tuyo hoy.
            </p>
            <div className="cta-actions">
              <a
                href="#reservar"
                className="btn btn-light btn-lg js-scroll"
                onClick={scrollToForm}
              >
                Reservá tu lugar
              </a>
              <a
                className="btn btn-wa btn-lg"
                href={waHola}
                target="_blank"
                rel="noopener"
                aria-label="Escribinos por WhatsApp"
              >
                <WaIcon />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img
              src="/assets/logo-white.png"
              alt="Comunidad Bienestar"
              className="footer-logo"
              width="240"
              height="54"
            />
            <p>
              Bajá de peso con método, acompañamiento profesional y una comunidad que te sostiene.
            </p>
            <div className="socials">
              <a
                href="https://www.instagram.com/bienestarcomunidadok/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/bienestarcomunidadok/"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M14 8.5h2.2V5.6c-.4-.05-1.3-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H7.8v3h2.2V21h3.2v-7.3h2.2l.4-3h-2.6V9.6c0-.8.2-1.1 1.1-1.1"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href={waHola} target="_blank" rel="noopener">
                  WhatsApp: +54 11 5323 0047
                </a>
              </li>
              <li>
                <a href="mailto:comunidadbienestarcobranzas@gmail.com">
                  comunidadbienestarcobranzas@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Planes</h4>
            <ul>
              <li><a href={waPlan("Vale Bienestar")} target="_blank" rel="noopener">Vale Bienestar</a></li>
              <li><a href={waPlan("Descenso de Peso")} target="_blank" rel="noopener">Descenso de Peso</a></li>
              <li><a href={waPlan("Plan 1x1")} target="_blank" rel="noopener">Plan 1 × 1</a></li>
              <li><a href={waPlan("Mantenimiento")} target="_blank" rel="noopener">Mantenimiento</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© {new Date().getFullYear()} Comunidad Bienestar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* ===================== WHATSAPP FLOTANTE ===================== */}
      <a
        className="wa-float"
        href={waHola}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
      >
        <span className="wa-tooltip">¿Te ayudamos? Escribinos</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={WA_PATH} />
        </svg>
      </a>

      {/* ===================== BARRA STICKY MÓVIL ===================== */}
      <div className={"mobile-bar" + (showBar ? " show" : "")} aria-hidden={!showBar}>
        <a href="#reservar" className="btn btn-primary btn-block js-scroll" onClick={scrollToForm}>
          Reservá tu lugar
        </a>
      </div>
    </div>
  );
}
