const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");

function createApp(savedData = {}) {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const logic = fs.readFileSync(path.join(ROOT, "logica.js"), "utf8");
  const app = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

  const cleanHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  const dom = new JSDOM(cleanHtml, {
    url: "http://localhost/",
    runScripts: "outside-only",
  });

  for (const [key, value] of Object.entries(savedData)) {
    dom.window.localStorage.setItem(key, JSON.stringify(value));
  }

  dom.window.eval(logic);
  dom.window.eval(app);

  return dom;
}

function submit(window, selector) {
  const form = window.document.querySelector(selector);
  assert.ok(form, `No se encontró ${selector}`);

  form.dispatchEvent(
    new window.Event("submit", {
      bubbles: true,
      cancelable: true,
    }),
  );
}

function loginAsAdmin(window) {
  const doc = window.document;

  doc.querySelector("#lRole").value = "admin";
  doc.querySelector("#lEmail").value = "admin@aromaylena.com";
  doc.querySelector("#lPass").value = "admin123";

  submit(window, "#formLogin");
}

function addMenuItemToCart(window, id = 1) {
  const button = window.document.querySelector(`#grid [data-add="${id}"]`);

  assert.ok(button, `No se encontró el producto ${id}`);
  button.click();
}

// PI-01: Administrador y menú del cliente
test("PI-01: Publicación de platillo en el menú", () => {
  const dom = createApp();
  const doc = dom.window.document;

  loginAsAdmin(dom.window);

  doc.querySelector("#adminName").value = "Mariscada de prueba";
  doc.querySelector("#adminCat").value = "Platos fuertes";
  doc.querySelector("#adminPrice").value = "18.50";
  doc.querySelector("#adminImg").value = "imagenes/menu/camarones.jpg";
  doc.querySelector("#adminDesc").value = "Mariscos frescos de prueba";
  doc.querySelector("#adminTag").value = "popular";

  submit(dom.window, "#formAddDish");

  assert.match(doc.querySelector("#grid").textContent, /Mariscada de prueba/);

  dom.window.close();
});

// PI-02: Inicio de sesión y panel administrativo
test("PI-02: Acceso al panel administrativo", () => {
  const dom = createApp();
  const doc = dom.window.document;

  loginAsAdmin(dom.window);

  assert.equal(doc.querySelector("#adminSection").style.display, "block");

  dom.window.close();
});

// PI-03: Menú y carrito
test("PI-03: Agregar producto al carrito", () => {
  const dom = createApp();
  const doc = dom.window.document;

  addMenuItemToCart(dom.window, 1);

  assert.equal(doc.querySelector("#count").textContent, "1");

  assert.match(
    doc.querySelector("#cartView").textContent,
    /Entrada de yuca frita/,
  );

  dom.window.close();
});

// PI-04: Carrito y cálculo de totales
test("PI-04: Cálculo de subtotal e IVA", () => {
  const dom = createApp();
  const doc = dom.window.document;

  addMenuItemToCart(dom.window, 1);

  const totals = doc.querySelector("#totalsBox").textContent;

  assert.match(totals, /Subtotal/);
  assert.match(totals, /\$3\.50/);
  assert.match(totals, /IVA/);
  assert.match(totals, /\$3\.96/);

  dom.window.close();
});
