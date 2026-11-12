import { validateLuhn } from '../src/services/luhn';

describe('validateLuhn', () => {
  it('validates correct card numbers', () => {
    // Standard test card numbers (Luhn valid)
    expect(validateLuhn('4532015112830366')).toBe(true);
    expect(validateLuhn('4532 0151 1283 0366')).toBe(true);
  });

  it('detects invalid checksum', () => {
    // Changed last digit from 6 to 7
    expect(validateLuhn('4532015112830367')).toBe(false);
  });

  it('rejects cards with invalid lengths', () => {
    expect(validateLuhn('123456789')).toBe(false); // too short (<12)
    expect(validateLuhn('123456789012345678901')).toBe(false); // too long (>19)
    expect(validateLuhn('')).toBe(false);
  });
});
