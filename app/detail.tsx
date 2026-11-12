import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../src/context/ThemeContext';
import { useCards } from '../src/context/CardContext';
import { CardView } from '../src/components/CardView';
import { CardRow } from '../src/components/CardRow';
import { ConfirmSheet } from '../src/components/ConfirmSheet';
import { formatCardNumber, formatIBAN } from '../src/services/formatters';
import { typography, SPACING, RADIUS, ICONS } from '../src/theme';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tokens } = useAppTheme();
  const { getCard, deleteCard } = useCards();
  const insets = useSafeAreaInsets();

  const [cvvRevealed, setCvvRevealed] = useState(false);
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false);

  const card = id ? getCard(id) : undefined;

  if (!card) {
    return (
      <View style={[styles.container, { backgroundColor: tokens.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.headline, { color: tokens.textSecondary }]}>Kart bulunamadı</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: SPACING.base }}>
          <Text style={[typography.body, { color: tokens.textPrimary }]}>Geri Dön</Text>
        </Pressable>
      </View>
    );
  }

  const handleEdit = () => {
    router.push({
      pathname: '/modal',
      params: { id: card.id },
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteSheetVisible(false);
    await deleteCard(card.id);
    router.back();
  };

  const formattedNumber = formatCardNumber(card.number);

  return (
    <View style={[styles.container, { backgroundColor: tokens.bg }]}>
      {/* Top Bar: Back button on left, "Düzenle" text button on right */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + SPACING.sm,
            paddingHorizontal: SPACING.screenPadding,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Geri"
          style={styles.backButton}
        >
          <ChevronLeft size={ICONS.size + 4} color={tokens.textPrimary} strokeWidth={ICONS.strokeWidth} />
        </Pressable>

        <Pressable
          onPress={handleEdit}
          hitSlop={12}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Kartı Düzenle"
          style={styles.editButton}
        >
          <Text style={[typography.headline, { color: tokens.textPrimary, fontSize: 16 }]}>
            Düzenle
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 16) + SPACING.xxxl,
            paddingHorizontal: SPACING.screenPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top: Card with unmasked number */}
        <View style={styles.cardContainer}>
          <CardView
            card={card}
            masked={false}
            enableLongPressCopy={false}
          />
        </View>

        {/* Grouped Information Block (surface, radius 14, rows divided by border) */}
        <View style={[styles.infoBlock, { backgroundColor: tokens.surface }]}>
          {/* Kart Numarası */}
          <CardRow
            label="Kart Numarası"
            value={formattedNumber}
            copyValue={card.number}
            isMono={true}
          />

          {/* Son Kullanma */}
          <CardRow
            label="Son Kullanma"
            value={card.expiry || ''}
            isMono={true}
          />

          {/* CVV */}
          <CardRow
            label="CVV"
            value={card.cvv || ''}
            isMono={true}
            isSecret={true}
            isRevealed={cvvRevealed}
            onEyeToggle={() => setCvvRevealed((prev) => !prev)}
          />

          {/* Kart Sahibi */}
          <CardRow
            label="Kart Sahibi"
            value={card.holderName || ''}
          />

          {/* IBAN (if provided) */}
          {card.iban ? (
            <CardRow
              label="IBAN"
              value={formatIBAN(card.iban)}
              copyValue={card.iban.replace(/\s/g, '')}
              isMono={true}
            />
          ) : null}

          {/* Not (if provided) */}
          {card.note ? (
            <CardRow
              label="Not"
              value={card.note}
              isLast={true}
            />
          ) : null}
        </View>

        {/* Delete Card Button: 32px below block, danger text button */}
        <View style={styles.deleteContainer}>
          <Pressable
            onPress={() => setDeleteSheetVisible(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Kartı Sil"
            style={styles.deleteButton}
          >
            <Text style={[typography.headline, { color: tokens.danger, fontSize: 16 }]}>
              Kartı Sil
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Delete Confirmation Sheet */}
      <ConfirmSheet
        visible={deleteSheetVisible}
        title="Bu kart silinsin mi?"
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  editButton: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingTop: SPACING.sm,
  },
  cardContainer: {
    marginBottom: SPACING.xl,
  },
  infoBlock: {
    borderRadius: RADIUS.field,
    overflow: 'hidden',
  },
  deleteContainer: {
    marginTop: SPACING.xxl, // Specification: 32px below block
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
});
