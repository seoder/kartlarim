import { CardColorKey } from '../theme/theme';

export type { CardColorKey };

export interface Card {
  id: string; // uuid
  label: string; // zorunlu
  holderName?: string;
  number: string; // sadece rakam, 12–19 hane, zorunlu
  expiry?: string; // AA/YY
  cvv?: string; // 3–4 hane
  note?: string;
  iban?: string; // Hızlı kopyalama için IBAN desteği
  color: CardColorKey;
  createdAt: number;
}

export type CardFormData = Omit<Card, 'id' | 'createdAt'>;
