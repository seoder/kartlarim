import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../src/context/ThemeContext';
import { useCards } from '../src/context/CardContext';
import { CardView } from '../src/components/CardView';
import { EmptyState } from '../src/components/EmptyState';
import { FloatingButton } from '../src/components/FloatingButton';
import { typography, SPACING } from '../src/theme';

export default function CardListScreen() {
  const { tokens } = useAppTheme();
  const { cards } = useCards();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleOpenAdd = () => {
    router.push('/modal');
  };

  const handleOpenDetail = (id: string) => {
    router.push({
      pathname: '/detail',
      params: { id },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + SPACING.base,
            paddingBottom: Math.max(insets.bottom, 16) + 90, // Leave room for FAB
            paddingHorizontal: SPACING.screenPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: "Kartlarım" (title) + card count (caption) */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>Kartlarım</Text>
          {cards.length > 0 && (
            <Text style={[styles.count, { color: tokens.textSecondary }]}>
              {cards.length}
            </Text>
          )}
        </View>

        {/* Card list or Empty state */}
        {cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState onPress={handleOpenAdd} />
          </View>
        ) : (
          <View style={styles.cardList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <CardView
                  card={card}
                  masked={true}
                  onPress={() => handleOpenDetail(card.id)}
                  enableLongPressCopy={true}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (+) */}
      <FloatingButton onPress={handleOpenAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  title: {
    ...typography.title,
  },
  count: {
    ...typography.caption,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  cardList: {
    gap: 16, // Specification: aralarında 16
  },
  cardItem: {
    width: '100%',
  },
});
