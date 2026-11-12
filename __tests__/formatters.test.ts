import {
  formatCardNumber,
  maskCardNumber,
  formatExpiry,
  cleanDigits,
  formatIBAN,
  getMaskedAccessibilityLabel,
} from '../src/services/formatters';

describe('formatters', () => {
  it('formats card number into 4-digit groups', () => {
    expect(formatCardNumber('1234567812345678')).toBe('1234 5678 1234 5678');
    expect(formatCardNumber('123456781234')).toBe('1234 5678 1234');
    expect(formatCardNumber('1234 5678 1234 5678')).toBe('1234 5678 1234 5678');
  });

  it('masks card number showing bullets and last 4 digits', () => {
    expect(maskCardNumber('1234567812345678')).toBe('•••• •••• •••• 5678');
    expect(maskCardNumber('123456781234')).toBe('•••• •••• 1234');
  });

  it('formats expiry MM/YY', () => {
    expect(formatExpiry('12')).toBe('12');
    expect(formatExpiry('1228')).toBe('12/28');
    expect(formatExpiry('12/28')).toBe('12/28');
  });

  it('cleans non-digits', () => {
    expect(cleanDigits(' 4532-0151 1283 ')).toBe('453201511283');
  });

  it('formats Turkish IBAN', () => {
    expect(formatIBAN('tr120006100511123223000001')).toBe('TR12 0006 1005 1112 3223 0000 01');
  });

  it('provides screen reader accessibility label for masked number', () => {
    expect(getMaskedAccessibilityLabel('4532015112835678')).toBe('Kart numarası son dört hane 5678');
  });
});
