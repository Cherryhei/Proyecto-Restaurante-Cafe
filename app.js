/* BASE DE DATOS Y CONSTANTES */
const MENU = [
  {
    id: 1,
    n: "Entrada de yuca frita",
    c: "Entradas",
    p: 3.5,
    d: "Yuca dorada con chicharrón y curtido.",
    t: ["popular"],
    img: "imagenes/menu/yuca-frita.jpg",
  },
  {
    id: 2,
    n: "Pupusas revueltas (3)",
    c: "Entradas",
    p: 3.75,
    d: "Queso, frijol y chicharrón con salsa y curtido.",
    t: ["popular"],
    img: "imagenes/menu/pupusas.jpg",
  },
  {
    id: 3,
    n: "Ensalada de la casa",
    c: "Entradas",
    p: 4.25,
    d: "Hojas verdes, aguacate, tomate y vinagreta de limón.",
    t: ["vegetariano"],
    img: "imagenes/menu/ensalada.jpg",
  },
  {
    id: 4,
    n: "Costillas a la brasa",
    c: "Platos fuertes",
    p: 12.9,
    d: "Media tabla glaseada, con papas y ensalada.",
    t: ["popular"],
    img: "imagenes/menu/costillas.jpg",
  },
  {
    id: 5,
    n: "Pollo dorado",
    c: "Platos fuertes",
    p: 9.5,
    d: "Cuarto de pollo en leña, arroz y frijoles.",
    t: [],
    img: "imagenes/menu/pollo-dorado.jpg",
  },
  {
    id: 6,
    n: "Churrasco con chimichurri",
    c: "Platos fuertes",
    p: 14.5,
    d: "300 g de res, guarnición a elegir.",
    t: [],
    img: "imagenes/menu/churrasco.jpg",
  },
  {
    id: 7,
    n: "Chile relleno al horno",
    c: "Platos fuertes",
    p: 8.25,
    d: "Relleno de queso y verduras, salsa de tomate.",
    t: ["vegetariano", "picante"],
    img: "imagenes/menu/chile-relleno.jpg",
  },
  {
    id: 8,
    n: "Camarones al ajillo",
    c: "Platos fuertes",
    p: 13.75,
    d: "Con ajo, mantequilla y un toque de chile.",
    t: ["picante"],
    img: "imagenes/menu/camarones.jpg",
  },
  {
    id: 9,
    n: "Limonada con hierbabuena",
    c: "Bebidas",
    p: 2.25,
    d: "Hecha al momento, con poca azúcar.",
    t: ["vegetariano"],
    img: "imagenes/menu/limonada.jpg",
  },
  {
    id: 10,
    n: "Horchata",
    c: "Bebidas",
    p: 2.0,
    d: "Semilla de morro con canela.",
    t: ["vegetariano"],
    img: "imagenes/menu/horchata.jpg",
  },
  {
    id: 11,
    n: "Café de altura",
    c: "Bebidas",
    p: 1.75,
    d: "Tostado local, servido caliente.",
    t: ["vegetariano"],
    img: "imagenes/menu/cafe.jpg",
  },
  {
    id: 12,
    n: "Quesadilla salvadoreña",
    c: "Postres",
    p: 3.25,
    d: "Una rebanada tibia con café.",
    t: ["vegetariano", "popular"],
    img: "imagenes/menu/quesadilla.jpg",
  },
  {
    id: 13,
    n: "Plátanos en gloria",
    c: "Postres",
    p: 3.0,
    d: "Plátano maduro con crema y canela.",
    t: ["vegetariano"],
    img: "imagenes/menu/platanos.jpg",
  },
  {
    id: 14,
    n: "Combo Familiar",
    c: "Combos",
    p: 29.9,
    d: "Pollo, costillas, 4 guarniciones y 4 bebidas.",
    t: ["popular"],
    img: "imagenes/menu/combo-familiar.jpg",
  },
];

const TAX = 0.13;
const DELIVERY = 2;
const COUPONS = { BRASA10: 0.1, BIENVENIDO: 0.15 };

/* UTILIDADES */
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toFixed(2);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const store = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  },
};

let cart = store.get("bd_cart", []);
let coupon = store.get("bd_coupon", null);
let cat = "Todos";
let step = "cart";

const save = () => {
  store.set("bd_cart", cart);
  store.set("bd_coupon", coupon);
};

function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.style.display = "block";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (e.style.display = "none"), 2200);
}

/* RENDERIZADO DE MENÚ Y FILTROS */
function renderChips() {
  const cats = ["Todos", ...new Set(MENU.map((m) => m.c))];
  $("#chips").innerHTML = cats
    .map(
      (c) =>
        `<button class="chip" aria-pressed="${c === cat}" data-c="${c}">${c}</button>`,
    )
    .join("");
}

function renderMenu() {
  const q = $("#q").value.trim().toLowerCase();
  const list = MENU.filter(
    (m) =>
      (cat === "Todos" || m.c === cat) && (m.n + m.d).toLowerCase().includes(q),
  );

  $("#grid").innerHTML = list.length
    ? list
        .map(
          (m) => `
    <article class="dish">
      <img src="${m.img}" alt="${esc(m.n)}" class="dish-img">
      <div class="body">
        <h3>${esc(m.n)}</h3>
        <p>${esc(m.d)}</p>
        <div class="tags">${m.t.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="row">
          <span class="price">${money(m.p)}</span>
          <button class="btn small" data-add="${m.id}">Agregar</button>
        </div>
      </div>
    </article>
  `,
        )
        .join("")
    : '<p class="empty">No encontramos platillos con esa búsqueda. Prueba con otra palabra o elige otra categoría.</p>';
}

$("#chips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-c]");
  if (b) {
    cat = b.dataset.c;
    renderChips();
    renderMenu();
  }
});

$("#q").addEventListener("input", renderMenu);

$("#grid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-add]");
  if (!b) return;
  const id = +b.dataset.add,
    it = cart.find((i) => i.id === id);
  it ? it.q++ : cart.push({ id, q: 1, note: "" });
  save();
  renderCart();
  toast("Agregado al carrito");
});

/* LÓGICA Y RENDERIZADO DEL CARRITO */

function calc() {
  const mode = ($("#fMode") || {}).value || "retiro";

  return calcularTotales(cart, MENU, coupon, mode, step);
}

function renderCart() {
  $("#count").textContent = cart.reduce((s, i) => s + i.q, 0);
  const v = $("#cartView"),
    tb = $("#totalsBox");
  if (step === "done") return;
  if (step === "checkout") {
    renderCheckout();
    return;
  }

  $("#dTitle").textContent = "Tu pedido";
  if (!cart.length) {
    v.innerHTML =
      '<p class="empty">Tu carrito está vacío. Agrega platillos desde el menú.</p>';
    tb.innerHTML = "";
    return;
  }

  v.innerHTML =
    cart
      .map((i) => {
        const m = MENU.find((x) => x.id === i.id);
        return `
      <div class="item">
        <div><strong>${m.n}</strong><br><span style="color:var(--muted)">${money(m.p)} c/u</span></div>
        <div class="qty">
          <button data-dec="${i.id}" aria-label="Quitar uno">−</button>
          <span>${i.q}</span>
          <button data-inc="${i.id}" aria-label="Agregar uno">+</button>
        </div>
        <input data-note="${i.id}" value="${esc(i.note)}" placeholder="Nota (ej. sin cebolla)" aria-label="Nota para ${m.n}">
      </div>`;
      })
      .join("") +
    `<div class="coupon">
    <input id="cpn" placeholder="Código de cupón" value="${coupon || ""}">
    <button class="btn small" id="applyCpn">Aplicar</button>
  </div>
  <p class="msg" id="cpnMsg">${coupon ? "Cupón " + coupon + " aplicado." : "Prueba con BRASA10."}</p>`;

  const t = calc();
  tb.innerHTML = `
    <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? `<div><span>Descuento</span><span>−${money(t.disc)}</span></div>` : ""}
    <div><span>IVA (13 %)</span><span>${money(t.tax)}</span></div>
    <div class="total"><span>Total</span><span>${money(t.total)}</span></div>
    <button class="btn" id="toCheckout" style="width:100%;margin-top:10px">Continuar con el pedido</button>`;
}

$("#cartView").addEventListener("click", (e) => {
  const g = (a) => e.target.closest(`[${a}]`);
  const inc = g("data-inc"),
    dec = g("data-dec");
  if (inc) {
    cart.find((i) => i.id == inc.dataset.inc).q++;
  } else if (dec) {
    const it = cart.find((i) => i.id == dec.dataset.dec);
    it.q--;
    if (it.q < 1) cart = cart.filter((i) => i !== it);
  } else if (e.target.id === "applyCpn") {
    const c = $("#cpn").value.trim().toUpperCase();
    if (!c) {
      coupon = null;
    } else if (COUPONS[c]) {
      coupon = c;
    } else {
      $("#cpnMsg").textContent = "Ese cupón no existe. Revisa el código.";
      $("#cpnMsg").className = "msg err";
      return;
    }
  } else return;
  save();
  renderCart();
});

$("#cartView").addEventListener("input", (e) => {
  const n = e.target.dataset.note;
  if (n) {
    cart.find((i) => i.id == n).note = e.target.value;
    save();
  }
});

$("#totalsBox").addEventListener("click", (e) => {
  if (e.target.id === "toCheckout") {
    step = "checkout";
    renderCart();
  }
});

/* CHECKOUT Y VALIDACIONES */
function renderCheckout() {
  const p = store.get("bd_profile", {}),
    v = $("#cartView"),
    keep = $("#fMode") ? $("#fMode").value : "retiro";
  $("#dTitle").textContent = "Finalizar pedido";
  if (!$("#fName")) {
    v.innerHTML = `
      <form id="checkout" novalidate>
        <div class="f"><label for="fName">Nombre</label><input id="fName" value="${esc(p.name || "")}"><span class="err-t" data-for="fName"></span></div>
        <div class="f"><label for="fPhone">Teléfono</label><input id="fPhone" inputmode="tel" value="${esc(p.phone || "")}"><span class="err-t" data-for="fPhone"></span></div>
        <div class="f"><label for="fEmail">Correo</label><input id="fEmail" type="email" value="${esc(p.email || "")}"><span class="err-t" data-for="fEmail"></span></div>
        <div class="f"><label for="fMode">¿Cómo lo quieres?</label>
          <select id="fMode">
            <option value="retiro">Retiro en el local</option>
            <option value="domicilio">Entrega a domicilio (+${money(DELIVERY)})</option>
          </select>
        </div>
        <div class="f" id="addrBox" hidden><label for="fAddr">Dirección de entrega</label><textarea id="fAddr" rows="2">${esc(p.addr || "")}</textarea><span class="err-t" data-for="fAddr"></span></div>
        <div class="f"><label for="fPay">Método de Pago </label><select id="fPay"><option>Efectivo</option></select></div>
        <label class="f check"><input type="checkbox" id="fSave" ${p.consent ? "checked" : ""}><span>Guardar mis datos para próximos pedidos</span></label>
      </form>`;
    $("#fMode").value = keep;
  }
  $("#addrBox").hidden = $("#fMode").value !== "domicilio";
  const t = calc();
  $("#totalsBox").innerHTML = `
    <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? `<div><span>Descuento</span><span>−${money(t.disc)}</span></div>` : ""}
    <div><span>IVA (13 %)</span><span>${money(t.tax)}</span></div>
    ${t.ship ? `<div><span>Envío</span><span>${money(t.ship)}</span></div>` : ""}
    <div class="total"><span>Total</span><span>${money(t.total)}</span></div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn ghost" id="back" style="color:var(--ink)">Volver</button>
      <button class="btn" id="confirm" style="flex:1">Confirmar pedido</button>
    </div>`;
}

$("#cartView").addEventListener("change", (e) => {
  if (e.target.id === "fMode") renderCheckout();
});

function setErr(id, t) {
  const e = document.querySelector(`[data-for="${id}"]`);
  if (e) e.textContent = t || "";
}

$("#totalsBox").addEventListener("click", (e) => {
  if (e.target.id === "back") {
    step = "cart";
    renderCart();
    return;
  }
  if (e.target.id !== "confirm") return;

  const d = {
    name: $("#fName").value.trim(),
    phone: $("#fPhone").value.trim(),
    email: $("#fEmail").value.trim(),
    mode: $("#fMode").value,
    addr: $("#fAddr").value.trim(),
    pay: $("#fPay").value,
  };

  let bad = false;
  const chk = (id, cond, m) => {
    setErr(id, cond ? "" : m);
    if (!cond) bad = true;
  };
  chk("fName", d.name.length >= 3, "Escribe tu nombre completo.");
  chk("fPhone", okPhone(d.phone), "Escribe un teléfono válido, solo números.");
  chk(
    "fEmail",
    okMail(d.email),
    "Escribe un correo válido, como nombre@correo.com.",
  );
  chk(
    "fAddr",
    d.mode !== "domicilio" || d.addr.length >= 8,
    "Escribe la dirección para la entrega.",
  );

  if (bad) return;

  const t = calc(),
    id = "BD-" + String(Date.now()).slice(-6);
  const order = {
    id,
    date: new Date().toLocaleString("es-SV"),
    items: cart.map((i) => ({
      n: MENU.find((m) => m.id === i.id).n,
      q: i.q,
      note: i.note,
    })),
    total: t.total,
    mode: d.mode,
    pay: d.pay,
    status: "Recibido",
  };

  const hist = store.get("bd_orders", []);
  hist.unshift(order);
  store.set("bd_orders", hist.slice(0, 20));

  if ($("#fSave").checked)
    store.set("bd_profile", {
      name: d.name,
      phone: d.phone,
      email: d.email,
      addr: d.addr,
      consent: true,
    });

  cart = [];
  coupon = null;
  save();
  step = "done";
  $("#dTitle").textContent = "¡Pedido recibido!";
  $("#cartView").innerHTML = `
    <p style="font-size:1.1rem">Gracias, <strong>${esc(d.name)}</strong>. Tu pedido <strong>${id}</strong> por <strong>${money(t.total)}</strong> está en preparación.</p>
    <p style="color:var(--muted)">${d.mode === "domicilio" ? "Lo llevaremos a tu dirección en unos 40 minutos." : "Estará listo para retirar en unos 25 minutos."} Pago: ${d.pay} (simulado).</p>`;
  $("#totalsBox").innerHTML =
    '<button class="btn" id="finish" style="width:100%">Seguir viendo el menú</button>';
  $("#count").textContent = "0";
  renderOrders();
  loadProfile();
});

$("#totalsBox").addEventListener("click", (e) => {
  if (e.target.id === "finish") {
    closeCart();
  }
});

/* MANEJO DEL DRAWER */
function openCart() {
  if (step === "done") step = "cart";
  $("#drawer").classList.add("open");
  $("#overlay").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  renderCart();
}

function closeCart() {
  $("#drawer").classList.remove("open");
  $("#overlay").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  if (step === "done" || step === "checkout") {
    step = "cart";
  }
}

$("#openCart").onclick = openCart;
$("#closeCart").onclick = closeCart;
$("#overlay").onclick = closeCart;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

/* GESTIÓN DE PERFIL */
function loadProfile() {
  const p = store.get("bd_profile", null);
  if (!p) return;
  $("#pName").value = p.name || "";
  $("#pPhone").value = p.phone || "";
  $("#pEmail").value = p.email || "";
  $("#pAddr").value = p.addr || "";
  $("#pConsent").checked = !!p.consent;
}

$("#profile").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = {
    name: $("#pName").value.trim(),
    phone: $("#pPhone").value.trim(),
    email: $("#pEmail").value.trim(),
    addr: $("#pAddr").value.trim(),
    consent: $("#pConsent").checked,
  };

  let bad = false;
  const chk = (id, c, m) => {
    setErr(id, c ? "" : m);
    if (!c) bad = true;
  };
  chk("pName", d.name.length >= 3, "Escribe tu nombre completo.");
  chk("pPhone", okPhone(d.phone), "Escribe un teléfono válido, solo números.");
  chk("pEmail", okMail(d.email), "Escribe un correo válido.");
  chk("pConsent", d.consent, "Debes aceptar para guardar tus datos.");

  const m = $("#pMsg");
  if (bad) {
    m.textContent = "";
    return;
  }
  store.set("bd_profile", d);
  m.textContent = "Datos guardados en este dispositivo.";
  m.className = "msg ok";
});

$("#wipe").onclick = () => {
  store.del("bd_profile");
  store.del("bd_orders");
  $("#profile").reset();
  renderOrders();
  $("#pMsg").textContent = "Tus datos y tu historial se borraron.";
  $("#pMsg").className = "msg ok";
};

function renderOrders() {
  const h = store.get("bd_orders", []);
  $("#orders").innerHTML = h.length
    ? h
        .map(
          (o) => `
    <div class="order">
      <strong>${esc(o.id)}</strong> · ${esc(o.date)} · ${esc(o.status)}<br>
      ${o.items.map((i) => esc(i.q + "× " + i.n)).join(", ")}<br>
      <span class="price">${money(o.total)}</span> 
      <span style="color:var(--muted)">${o.mode === "domicilio" ? "a domicilio" : "retiro en local"}</span>
    </div>`,
        )
        .join("")
    : '<p class="empty">Aún no has hecho pedidos. Cuando pidas, aparecerán aquí.</p>';
}

/* LÓGICA DE MODAL DE LOGIN / REGISTRO / ADMIN */
let currentUser = store.get("bd_user", null);

const authModal = $("#authModal");
const openAuthBtn = $("#openAuth");
const closeAuthBtn = $("#closeAuth");
const tabLogin = $("#tabLogin");
const tabRegister = $("#tabRegister");
const formLogin = $("#formLogin");
const formRegister = $("#formRegister");
const adminSection = $("#adminSection");

// Abrir y cerrar Modal
openAuthBtn.onclick = () => {
  if (currentUser) {
    // Si ya está logueado, al tocar el botón se cierra sesión
    currentUser = null;
    store.del("bd_user");
    updateUserUI();
    toast("Sesión cerrada");
  } else {
    authModal.classList.add("open");
    authModal.setAttribute("aria-hidden", "false");
  }
};

closeAuthBtn.onclick = () => {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
};

// Cambiar entre pestañas Login y Registro
tabLogin.onclick = () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  formLogin.style.display = "block";
  formRegister.style.display = "none";
};

tabRegister.onclick = () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  formRegister.style.display = "block";
  formLogin.style.display = "none";
};

// Simular Login
formLogin.onsubmit = (e) => {
  e.preventDefault();
  const role = $("#lRole").value;
  const email = $("#lEmail").value.trim();

  currentUser = { email, role };
  store.set("bd_user", currentUser);

  authModal.classList.remove("open");
  updateUserUI();
  toast(`Bienvenido (${role === "admin" ? "Administrador" : "Cliente"})`);
};

// Simular Registro
formRegister.onsubmit = (e) => {
  e.preventDefault();
  const name = $("#rName").value.trim();
  const role = $("#rRole").value;
  const email = $("#rEmail").value.trim();

  currentUser = { name, email, role };
  store.set("bd_user", currentUser);

  authModal.classList.remove("open");
  updateUserUI();
  toast("Cuenta creada exitosamente");
};

// Actualizar la interfaz según el rol
function updateUserUI() {
  if (currentUser) {
    openAuthBtn.textContent = `Salir (${currentUser.role})`;
    if (currentUser.role === "admin") {
      adminSection.style.display = "block";
    } else {
      adminSection.style.display = "none";
    }
  } else {
    openAuthBtn.textContent = "Ingresar";
    adminSection.style.display = "none";
  }
}

// Lógica para que el Administrador agregue productos dinámicamente al menú
$("#formAddDish").onsubmit = (e) => {
  e.preventDefault();

  const newDish = {
    id: Date.now(),
    n: $("#adminName").value.trim(),
    c: $("#adminCat").value,
    p: parseFloat($("#adminPrice").value),
    d: $("#adminDesc").value.trim(),
    t: $("#adminTag").value ? [$("#adminTag").value] : [],
    img: $("#adminImg").value.trim() || "imagenes/horchata.jpg",
  };

  MENU.unshift(newDish);
  renderChips();
  renderMenu();
  $("#formAddDish").reset();
  toast("¡Nuevo platillo agregado al menú!");
};

// Inicializar estado de usuario al cargar
updateUserUI();

/* INICIALIZACIÓN */
renderChips();
renderMenu();
renderCart();
renderOrders();
loadProfile();
