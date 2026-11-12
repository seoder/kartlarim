import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { RADIUS, SPACING, SIZES, typography, ICONS } from '../theme';

interface EmptyStateProps {
  onPress: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onPress }) => {
  const { tokens } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="İlk kartını ekle"
      style={({ pressed }) => [
        styles.cardFrame,
        {
          borderColor: tokens.border,
          backgroundColor: pressed ? tokens.surface : 'transparent',
        },
      ]}
    >
      <Plus size={ICONS.size + 4} color={tokens.textSecondary} strokeWidth={ICONS.strokeWidth} />
      <Text style={[styles.text, { color: tokens.textSecondary }]}>İlk kartını ekle</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardFrame: {
    width: '100%',
    aspectRatio: SIZES.cardAspectRatio,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.screenPadding,
  },
  text: {
    ...typography.headline,
    fontSize: 16,
  },
});
