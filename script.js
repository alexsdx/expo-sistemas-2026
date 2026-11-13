/* ============================================================
   EXPO SISTEMAS 2026 - comportamiento del sitio
   ============================================================ */

/* ------------------------------------------------------------
   DATOS EDITABLES
   ------------------------------------------------------------ */

// Enlace del formulario de Google Forms (el "enlace para alumnos" que
// imprime el script de Apps Script). Mientras esté vacío, los botones de
// registro muestran "Registro disponible muy pronto".
const REGISTRO_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdpUBA62ErwF06Nsgp2m_47qRba0EClNnXsHc40HGKb5FvH8w/viewform";

// Contacto para dudas. Ejemplo: "Escríbenos a correo@ejemplo.mx" o
// "Instagram: @capitulo". Si queda vacío se usa el texto de index.html.
const CONTACTO = "";

// Fechas (hora del centro de México, UTC-6).
const CIERRE_REGISTRO = new Date("2026-11-28T00:00:00-06:00"); // fin del 27 de noviembre
const INICIO_EVENTO = new Date("2026-12-07T09:00:00-06:00");
const FIN_EVENTO = new Date("2026-12-07T13:00:00-06:00");

/* ------------------------------------------------------------ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Navegación ---------- */
const nav = $("#nav");
const toggle = $("#navToggle");
const links = $("#navLinks");

const pintarNav = () => nav.classList.toggle("is-solid", window.scrollY > 24);
pintarNav();
window.addEventListener("scroll", pintarNav, { passive: true });

const cerrarMenu = () => {
  links.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menú");
};
toggle.addEventListener("click", () => {
  const abierto = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(abierto));
  toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  if (abierto) nav.classList.add("is-solid");
});
$$("a", links).forEach((a) => a.addEventListener("click", cerrarMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

/* ---------- Registro ---------- */
function pintarRegistro() {
  const ahora = new Date();
  const cerrado = ahora >= CIERRE_REGISTRO;
  const hayEnlace = REGISTRO_URL.trim() !== "";
  const principal = $("[data-principal]");
  const titulo = $("#registroTitulo");
  const detalle = $("#registroDetalle");
  const nota = $("#registroNota");

  $$("[data-registro]").forEach((boton) => {
    const texto = $("[data-registro-texto]", boton);
    const esPrincipal = boton === principal;

    if (cerrado) {
      if (esPrincipal) {
        boton.classList.add("is-off");
        boton.removeAttribute("href");
        boton.setAttribute("aria-disabled", "true");
      }
      texto.textContent = "Registro cerrado";
    } else if (hayEnlace && esPrincipal) {
      boton.href = REGISTRO_URL;
      boton.target = "_blank";
      boton.rel = "noopener";
    } else if (!hayEnlace) {
      if (esPrincipal) {
        boton.classList.add("is-off");
        boton.removeAttribute("href");
        boton.setAttribute("aria-disabled", "true");
        texto.textContent = "Registro disponible muy pronto";
      }
    }
  });

  if (cerrado) {
    titulo.textContent = "El registro ya cerró";
    detalle.innerHTML = "El registro de proyectos cerró el <strong>viernes 27 de noviembre de 2026</strong>. ¡Te esperamos el lunes 7 de diciembre para conocer los proyectos!";
    nota.textContent = "La lista de stands y turnos se publica en este sitio.";
  } else if (!hayEnlace) {
    nota.textContent = "Estamos preparando el formulario. Vuelve pronto a esta página.";
  }
}
pintarRegistro();

/* ---------- Contacto ---------- */
if (CONTACTO.trim() !== "") {
  $("#contactoTexto").textContent = CONTACTO;
}

/* ---------- Cuenta regresiva ---------- */
const cuenta = $("#cuenta");
const cuentaTitulo = $("#cuentaTitulo");
const dos = (n) => String(n).padStart(2, "0");

function pintarCuenta() {
  const ahora = new Date();
  const falta = INICIO_EVENTO - ahora;

  if (falta <= 0) {
    $(".cuenta__nums", cuenta).hidden = true;
    cuentaTitulo.textContent = ahora < FIN_EVENTO
      ? "¡La expo está ocurriendo ahora!"
      : "Gracias por ser parte de la Expo Sistemas 2026";
    return false;
  }
  const seg = Math.floor(falta / 1000);
  $("#cDias").textContent = Math.floor(seg / 86400);
  $("#cHoras").textContent = dos(Math.floor((seg % 86400) / 3600));
  $("#cMin").textContent = dos(Math.floor((seg % 3600) / 60));
  $("#cSeg").textContent = dos(seg % 60);
  return true;
}
if (pintarCuenta()) {
  const reloj = setInterval(() => { if (!pintarCuenta()) clearInterval(reloj); }, 1000);
}

/* ---------- Fechas ya pasadas ---------- */
$$(".linea li[data-fecha]").forEach((li) => {
  if (new Date() >= new Date(li.dataset.fecha)) li.classList.add("is-past");
});

/* ---------- Aparición al hacer scroll ---------- */
const revelables = $$(".reveal");
if ("IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      const hermanos = $$(".reveal", e.target.parentElement).filter((x) => x.parentElement === e.target.parentElement);
      const i = Math.max(0, hermanos.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
      e.target.classList.add("is-in");
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revelables.forEach((el) => obs.observe(el));
} else {
  revelables.forEach((el) => el.classList.add("is-in"));
}
