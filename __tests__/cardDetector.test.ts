import { detectCardNetwork } from '../src/services/cardDetector';

describe('detectCardNetwork', () => {
  it('detects TROY cards', () => {
    expect(detectCardNetwork('9792000000000000')).toBe('TROY');
    expect(detectCardNetwork('6500000000000000')).toBe('TROY');
    expect(detectCardNetwork('6800000000000000')).toBe('TROY');
  });

  it('detects VISA cards', () => {
    expect(detectCardNetwork('4000123456789010')).toBe('VISA');
    expect(detectCardNetwork('4111 2222 3333 4444')).toBe('VISA');
  });

  it('detects MASTERCARD cards', () => {
    expect(detectCardNetwork('5100123456789010')).toBe('MASTERCARD');
    expect(detectCardNetwork('5500123456789010')).toBe('MASTERCARD');
    expect(detectCardNetwork('2221000000000000')).toBe('MASTERCARD');
    expect(detectCardNetwork('2720999999999999')).toBe('MASTERCARD');
  });

  it('detects AMEX cards', () => {
    expect(detectCardNetwork('340012345678901')).toBe('AMEX');
    expect(detectCardNetwork('370012345678901')).toBe('AMEX');
  });

  it('returns empty string for unrecognized or empty inputs', () => {
    expect(detectCardNetwork('')).toBe('');
    expect(detectCardNetwork('1234567890123456')).toBe('');
  });
});
