import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Copy, Check, Eye, EyeOff } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { typography, SPACING, ICONS } from '../theme';
import { copyToClipboard } from '../services/clipboard';

interface CardRowProps {
  label: string;
  value: string;
  copyValue?: string;
  isMono?: boolean;
  isSecret?: boolean;
  isLast?: boolean;
  onEyeToggle?: () => void;
  isRevealed?: boolean;
}

export const CardRow: React.FC<CardRowProps> = ({
  label,
  value,
  copyValue,
  isMono = false,
  isSecret = false,
  isLast = false,
  onEyeToggle,
  isRevealed = false,
}) => {
  const { tokens } = useAppTheme();
  const [copied, setCopied] = useState(false);

  const textToCopy = copyValue ?? value;

  const handlePress = async () => {
    if (!textToCopy) return;
    await copyToClipboard(textToCopy, { enableHaptic: true });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const displayValue = isSecret && !isRevealed ? '•••' : (value || '—');

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${displayValue}. Kopyalamak için dokunun`}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: tokens.border },
        pressed && { backgroundColor: tokens.surfaceRaised },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.label, { color: tokens.textSecondary }]}>{label}</Text>
        <Text
          style={[
            isMono ? typography.monoValue : typography.body,
            { color: value ? tokens.textPrimary : tokens.textTertiary },
          ]}
          numberOfLines={2}
        >
          {displayValue}
        </Text>
      </View>

      <View style={styles.actions}>
        {isSecret && onEyeToggle && (
          <Pressable
            hitSlop={12}
            onPress={(e) => {
              e.stopPropagation();
              onEyeToggle();
            }}
            accessibilityRole="button"
            accessibilityLabel={isRevealed ? 'CVV gizle' : 'CVV göster'}
            style={styles.actionButton}
          >
            {isRevealed ? (
              <EyeOff size={ICONS.size} color={tokens.textSecondary} strokeWidth={ICONS.strokeWidth} />
            ) : (
              <Eye size={ICONS.size} color={tokens.textSecondary} strokeWidth={ICONS.strokeWidth} />
            )}
          </Pressable>
        )}

        <View style={styles.copyIconContainer}>
          {copied ? (
            <Check size={ICONS.size} color={tokens.success} strokeWidth={2} />
          ) : (
            <Copy size={ICONS.size} color={tokens.textSecondary} strokeWidth={ICONS.strokeWidth} />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    minHeight: 64,
  },
  content: {
    flex: 1,
    marginRight: SPACING.md,
  },
  label: {
    ...typography.fieldLabel,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  copyIconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
