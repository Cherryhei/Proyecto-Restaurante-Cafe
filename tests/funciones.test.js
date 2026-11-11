const test = require('node:test');
const assert = require('node:assert/strict');
const { okPhone, okMail, calcularTotales } = require('../logica.js');

// Función utilizada en Aroma & Leña


// Primera prueba unitaria
test('PU-01: Validación de teléfono', () => {
  const resultado = okPhone('71234567');

  assert.equal(resultado, true);
});



 // Función de validación de correo


// PU-02: Validación de correo electrónico
test('PU-02: Validar correo electrónico', () => {
  const correoValido = okMail('cliente@gmail.com');
  const correoInvalido = okMail('clientegmail.com');

  assert.equal(correoValido, true);
  assert.equal(correoInvalido, false);
});



 // PU-03: Cálculo del subtotal del carrito

test('PU-03: Calcular subtotal del carrito', () => {

  // Dos productos del menú de Aroma & Leña
  const menu = [
    { id: 1, p: 3.50 },
    { id: 2, p: 3.75 }
  ];

  // Pedido simulado
  const carrito = [
    { id: 1, q: 2 },
    { id: 2, q: 1 }
  ];

  // Ejecutar la función real del proyecto
  const resultado = calcularTotales(
    carrito,
    menu,
    null,
    'retiro',
    'cart'
  );

  // Comprobar que el subtotal sea correcto
  assert.equal(resultado.sub, 10.75);
});




 // PU-04: Aplicación de descuentos

test('PU-04: Calcular descuentos con cupones', () => {

  // Producto de ejemplo con precio de $20
  const menu = [{ id: 1, p: 20 }];
  const carrito = [{ id: 1, q: 1 }];

  // Probar cupón BRASA10 (10 %)
  const resultado10 = calcularTotales(
    carrito, menu, 'BRASA10', 'retiro', 'cart'
  );

  // Probar cupón BIENVENIDO (15 %)
  const resultado15 = calcularTotales(
    carrito, menu, 'BIENVENIDO', 'retiro', 'cart'
  );

  // Comprobar descuentos
  assert.equal(resultado10.disc, 2);
  assert.equal(resultado15.disc, 3);
});





 // PU-05: Cálculo del IVA y envío

test('PU-05: Calcular IVA y costo de envío', () => {

  // Producto de $20 y cantidad 1
  const menu = [{ id: 1, p: 20 }];
  const carrito = [{ id: 1, q: 1 }];

  // Pedido para retirar en el local
  const retiro = calcularTotales(
    carrito, menu, null, 'retiro', 'checkout'
  );

  // Pedido con entrega a domicilio
  const domicilio = calcularTotales(
    carrito, menu, null, 'domicilio', 'checkout'
  );

  // Comprobar IVA del 13 %
  assert.ok(Math.abs(retiro.tax - 2.60) < 0.000001);

  // Comprobar costo de envío
  assert.equal(retiro.ship, 0);
  assert.equal(domicilio.ship, 2);

  // Comprobar totales
  assert.ok(Math.abs(retiro.total - 22.60) < 0.000001);
  assert.ok(Math.abs(domicilio.total - 24.60) < 0.000001);
});

//Luego de crear el archivo de logica.js

