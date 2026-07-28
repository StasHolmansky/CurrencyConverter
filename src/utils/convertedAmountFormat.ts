/** Matches crypto codes merged in CurrencyService */
const CRYPTO_CURRENCY_CODES = new Set(['BTC', 'ETH', 'USDT']);

function trimTrailingZeros(formatted: string): string {
  if (!formatted.includes('.')) {
    return formatted;
  }
  const trimmed = formatted.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  return trimmed || '0';
}

/**
 * Formats amounts produced by conversion (not manual user input).
 * Fiat stays at 2 decimals; crypto uses more digits when the value is small.
 */
export function formatConvertedAmount(amount: number, currencyCode: string): string {
  if (!Number.isFinite(amount)) {
    return '0';
  }

  const abs = Math.abs(amount);
  if (abs === 0) {
    return '0';
  }

  if (!CRYPTO_CURRENCY_CODES.has(currencyCode)) {
    return amount.toFixed(2);
  }

  if (currencyCode === 'USDT' && abs >= 1) {
    return amount.toFixed(2);
  }

  let fractionDigits: number;
  if (abs >= 1000) {
    fractionDigits = 2;
  } else if (abs >= 1) {
    fractionDigits = 4;
  } else {
    const fromMagnitude = -Math.floor(Math.log10(abs)) + 4;
    fractionDigits = Math.min(8, Math.max(4, fromMagnitude));
  }

  return trimTrailingZeros(amount.toFixed(fractionDigits));
}
