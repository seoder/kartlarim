import { getLeastUsedColor } from '../src/services/storage';
import { Card } from '../src/types/card';
import { CARD_COLOR_KEYS } from '../src/theme/theme';

describe('getLeastUsedColor', () => {
  it('returns grafit when no cards exist', () => {
    expect(getLeastUsedColor([])).toBe('grafit');
  });

  it('selects the least used color among cards', () => {
    const cards: Card[] = [
      { id: '1', label: 'C1', number: '123412341234', color: 'grafit', createdAt: 1 },
      { id: '2', label: 'C2', number: '123412341235', color: 'grafit', createdAt: 2 },
      { id: '3', label: 'C3', number: '123412341236', color: 'gece', createdAt: 3 },
    ];

    // grafit: 2, gece: 1, others: 0
    // The next available with count 0 is 'zumrut' (first zero count)
    const least = getLeastUsedColor(cards);
    expect(least).toBe('zumrut');
  });

  it('picks next zero count color sequentially', () => {
    const cards: Card[] = [
      { id: '1', label: 'C1', number: '123412341234', color: 'grafit', createdAt: 1 },
      { id: '2', label: 'C2', number: '123412341235', color: 'gece', createdAt: 2 },
      { id: '3', label: 'C3', number: '123412341236', color: 'zumrut', createdAt: 3 },
      { id: '4', label: 'C4', number: '123412341237', color: 'bordo', createdAt: 4 },
      { id: '5', label: 'C5', number: '123412341238', color: 'mor', createdAt: 5 },
    ];
    // Only bakir is 0
    expect(getLeastUsedColor(cards)).toBe('bakir');
  });
});
