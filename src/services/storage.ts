import * as SecureStore from 'expo-secure-store';
import { Card } from '../types/card';
import { CardColorKey, CARD_COLOR_KEYS } from '../theme/theme';

const CARD_INDEX_KEY = 'card_index';

// Simple UUID generator without external dependencies
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Reads card index (array of IDs)
 */
export async function getCardIndex(): Promise<string[]> {
  try {
    const raw = await SecureStore.getItemAsync(CARD_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves card index
 */
async function saveCardIndex(ids: string[]): Promise<void> {
  await SecureStore.setItemAsync(CARD_INDEX_KEY, JSON.stringify(ids));
}

/**
 * Gets a single card by ID
 */
export async function getCardById(id: string): Promise<Card | null> {
  try {
    const raw = await SecureStore.getItemAsync(`card_${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as Card;
  } catch {
    return null;
  }
}

/**
 * Loads all cards, sorted by creation date (newest first or stable order)
 */
export async function getAllCards(): Promise<Card[]> {
  const ids = await getCardIndex();
  const cards: Card[] = [];

  for (const id of ids) {
    const card = await getCardById(id);
    if (card) {
      cards.push(card);
    }
  }

  // Sort newest first
  return cards.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Saves (creates or updates) a card in SecureStore
 */
export async function saveCard(card: Card): Promise<Card> {
  const key = `card_${card.id}`;
  await SecureStore.setItemAsync(key, JSON.stringify(card));

  const ids = await getCardIndex();
  if (!ids.includes(card.id)) {
    ids.unshift(card.id);
    await saveCardIndex(ids);
  }

  return card;
}

/**
 * Deletes a card from SecureStore
 */
export async function deleteCard(id: string): Promise<void> {
  const key = `card_${id}`;
  await SecureStore.deleteItemAsync(key);

  const ids = await getCardIndex();
  const filtered = ids.filter((item) => item !== id);
  await saveCardIndex(filtered);
}

/**
 * Finds the least used card color among existing cards
 * As specified in Section 4: "Yeni kartta varsayılan renk: listede en az kullanılan renk."
 */
export function getLeastUsedColor(cards: Card[]): CardColorKey {
  const counts: Record<CardColorKey, number> = {
    grafit: 0,
    gece: 0,
    zumrut: 0,
    bordo: 0,
    mor: 0,
    bakir: 0,
  };

  for (const card of cards) {
    if (counts[card.color] !== undefined) {
      counts[card.color]++;
    }
  }

  let minCount = Infinity;
  let leastUsed: CardColorKey = CARD_COLOR_KEYS[0];

  for (const key of CARD_COLOR_KEYS) {
    if (counts[key] < minCount) {
      minCount = counts[key];
      leastUsed = key;
    }
  }

  return leastUsed;
}
