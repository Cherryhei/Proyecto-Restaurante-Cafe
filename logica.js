
const okPhone = s => /^[\d\s+-]{8,15}$/.test(s);
const okMail = s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);


function calcularTotales(cart, menu, coupon, mode, step) {
  const TAX = 0.13;
  const DELIVERY = 2;
  const COUPONS = {
    BRASA10: 0.10,
    BIENVENIDO: 0.15
  };

  // Calcular subtotal
  const sub = cart.reduce((s, i) =>
    s + menu.find(m => m.id === i.id).p * i.q, 0
  );

  // Aplicar descuento
  const disc = coupon ? sub * COUPONS[coupon] : 0;

  // Calcular IVA
  const tax = (sub - disc) * TAX;

  // Calcular envío
  const ship = (
    mode === 'domicilio' &&
    sub > 0 &&
    step === 'checkout'
  ) ? DELIVERY : 0;

  return {
    sub,
    disc,
    tax,
    ship,
    total: sub - disc + tax + ship
  };
}


// Compartir funciones con Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { okPhone, okMail, calcularTotales };
}
