/**
 * Formats a card number string into 4-digit spaced chunks
 * e.g. "1234567812345678" -> "1234 5678 1234 5678"
 */
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Returns masked card number for list display
 * Shows bullets and last 4 digits: "•••• •••• •••• 1234"
 */
export function maskCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) {
    return digits;
  }
  const lastFour = digits.slice(-4);
  const maskedLength = digits.length - 4;
  
  // Create bullets for the hidden digits, grouped in 4s
  const bullets = '•'.repeat(maskedLength);
  const fullMasked = bullets + lastFour;
  return fullMasked.replace(/(.{4})(?=.)/g, '$1 ').trim();
}

/**
 * Formats MM/YY expiry string
 */
export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/**
 * Cleans string to digits only
 */
export function cleanDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

/**
 * Formats Turkish IBAN with standard grouping
 * e.g. "TR120006100511123223000001" -> "TR12 0006 1005 1112 3223 0000 01"
 */
export function formatIBAN(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 26);
  return cleaned.replace(/(.{4})(?=.)/g, '$1 ').trim();
}

/**
 * Returns accessibility label for masked card number
 */
export function getMaskedAccessibilityLabel(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `Kart numarası son dört hane ${digits.slice(-4)}`;
  }
  return 'Kart numarası';
}
