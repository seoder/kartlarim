import React from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { SIZES, SPACING, ICONS } from '../theme';

interface FloatingButtonProps {
  onPress: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
  const { tokens, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const bottomPosition = Math.max(insets.bottom, 16) + 20;

  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Yeni kart ekle"
      style={({ pressed }) => [
        styles.button,
        {
          bottom: bottomPosition,
          backgroundColor: tokens.action,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
        Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.5 : 0.25,
            shadowRadius: 10,
          },
          android: {
            elevation: 8,
          },
        }),
      ]}
    >
      <Plus size={ICONS.size + 4} color={tokens.actionText} strokeWidth={2} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: SPACING.screenPadding,
    width: SIZES.fabSize,
    height: SIZES.fabSize,
    borderRadius: SIZES.fabSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});
