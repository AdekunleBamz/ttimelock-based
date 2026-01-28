// Utilities for token unit conversions without external dependencies

export function toBaseUnits(amount: string, decimals = 6): string {
  if (!amount) return '0';
  const [whole, fraction = ''] = amount.split('.');
  const normalizedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  const combined = `${whole}${normalizedFraction}`.replace(/^0+/, '') || '0';
  return combined;
}

export function fromBaseUnits(amount: string, decimals = 6): string {
  const sanitized = amount.replace(/^0+/, '') || '0';
  if (sanitized.length <= decimals) {
    const padded = sanitized.padStart(decimals, '0');
    const value = `0.${padded}`.replace(/\.0+$/, '.0');
    return value.replace(/\.0$/, '0');
  }
  const whole = sanitized.slice(0, sanitized.length - decimals);
  const fraction = sanitized.slice(sanitized.length - decimals).replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole;
}

export function trimDecimal(value: string, decimals = 6): string {
  if (!value.includes('.')) return value;
  const [whole, fraction] = value.split('.');
  return `${whole}.${fraction.slice(0, decimals)}`.replace(/\.$/, '');
}

export function addDecimals(amount: string, decimals = 6): string {
  return trimDecimal(amount, decimals);
}

export function compareAmounts(a: string, b: string): number {
  const aNorm = a.replace(/^0+/, '') || '0';
  const bNorm = b.replace(/^0+/, '') || '0';
  if (aNorm.length !== bNorm.length) {
    return aNorm.length > bNorm.length ? 1 : -1;
  }
  if (aNorm === bNorm) return 0;
  return aNorm > bNorm ? 1 : -1;
}
