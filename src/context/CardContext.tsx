import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardFormData } from '../types/card';
import {
  getAllCards,
  saveCard as saveCardStorage,
  deleteCard as deleteCardStorage,
  generateId,
  getLeastUsedColor,
} from '../services/storage';
import { CardColorKey } from '../theme/theme';
import { useAuth } from './AuthContext';

interface CardContextValue {
  cards: Card[];
  isLoading: boolean;
  leastUsedColor: CardColorKey;
  refreshCards: () => Promise<void>;
  addCard: (data: CardFormData) => Promise<Card>;
  updateCard: (id: string, data: Partial<CardFormData>) => Promise<Card | null>;
  deleteCard: (id: string) => Promise<void>;
  getCard: (id: string) => Card | undefined;
}

const CardContext = createContext<CardContextValue>({
  cards: [],
  isLoading: true,
  leastUsedColor: 'grafit',
  refreshCards: async () => {},
  addCard: async () => ({} as Card),
  updateCard: async () => null,
  deleteCard: async () => {},
  getCard: () => undefined,
});

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  const refreshCards = useCallback(async () => {
    // Specification: "Doğrulama olmadan hiçbir kart verisi ekrana gelmez."
    if (!isAuthenticated) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const loaded = await getAllCards();
      setCards(loaded);
    } catch {
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCards();
    } else {
      // Clear data when locked
      setCards([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshCards]);

  const leastUsedColor = useMemo(() => {
    return getLeastUsedColor(cards);
  }, [cards]);

  const addCard = useCallback(async (data: CardFormData): Promise<Card> => {
    const newCard: Card = {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
    };

    await saveCardStorage(newCard);
    setCards((prev) => [newCard, ...prev.filter((c) => c.id !== newCard.id)]);
    return newCard;
  }, []);

  const updateCard = useCallback(
    async (id: string, data: Partial<CardFormData>): Promise<Card | null> => {
      const existing = cards.find((c) => c.id === id);
      if (!existing) return null;

      const updated: Card = {
        ...existing,
        ...data,
      };

      await saveCardStorage(updated);
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    },
    [cards]
  );

  const deleteCard = useCallback(async (id: string): Promise<void> => {
    await deleteCardStorage(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCard = useCallback(
    (id: string): Card | undefined => {
      return cards.find((c) => c.id === id);
    },
    [cards]
  );

  return (
    <CardContext.Provider
      value={{
        cards,
        isLoading,
        leastUsedColor,
        refreshCards,
        addCard,
        updateCard,
        deleteCard,
        getCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export function useCards(): CardContextValue {
  return useContext(CardContext);
}
