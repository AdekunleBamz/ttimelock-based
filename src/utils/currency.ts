// Currency formatting utilities

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COMPACT_USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const CRYPTO_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export function formatUSD(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0.00';
  return USD_FORMATTER.format(num);
}

export function formatUSDCompact(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';
  return COMPACT_USD_FORMATTER.format(num);
}

export function formatCrypto(amount: number | string, symbol = ''): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `0 ${symbol}`.trim();
  return `${CRYPTO_FORMATTER.format(num)} ${symbol}`.trim();
}

export function formatETH(amount: number | string): string {
  return formatCrypto(amount, 'ETH');
}

export function formatUSDC(amount: number | string): string {
  return formatCrypto(amount, 'USDC');
}

export function parseTokenAmount(amount: string, decimals = 6): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

export function formatTokenAmount(amount: bigint, decimals = 6): string {
  const str = amount.toString().padStart(decimals + 1, '0');
  const whole = str.slice(0, -decimals) || '0';
  const fraction = str.slice(-decimals);
  return `${whole}.${fraction}`;
}
