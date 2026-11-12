export type CardNetwork = 'VISA' | 'MASTERCARD' | 'TROY' | 'AMEX' | '';

export function detectCardNetwork(cardNumber: string): CardNetwork {
  const clean = cardNumber.replace(/\D/g, '');
  if (!clean) return '';

  // TROY: Turkey national payment scheme, starts with 9792 or 65 (or 68, 69)
  if (clean.startsWith('9792') || clean.startsWith('65') || clean.startsWith('68') || clean.startsWith('69')) {
    return 'TROY';
  }

  // AMEX: starts with 34 or 37
  if (/^3[47]/.test(clean)) {
    return 'AMEX';
  }

  // VISA: starts with 4
  if (/^4/.test(clean)) {
    return 'VISA';
  }

  // MASTERCARD: 51-55 or 2221-2720
  if (/^5[1-5]/.test(clean)) {
    return 'MASTERCARD';
  }

  if (clean.length >= 4) {
    const prefix4 = parseInt(clean.substring(0, 4), 10);
    if (prefix4 >= 2221 && prefix4 <= 2720) {
      return 'MASTERCARD';
    }
  }

  return '';
}
