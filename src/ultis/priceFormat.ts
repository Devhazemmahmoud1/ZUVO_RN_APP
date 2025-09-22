export function formatPrice(n: number) {
  // keep simple, matches screenshot style (no decimals usually)
  return new Intl.NumberFormat('en-AE').format(Math.round(n));
}

export function formatCount(n: number) {
  if (n >= 1000) return `${Math.round(n / 1000)}.5K`.replace('.5K', '5K'); // simple like (25.5K)
  return `${n}`;
}
