import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { Card } from '../types/card';
import { CARD_COLORS, RADIUS, SPACING, SIZES, typography, FONTS } from '../theme';
import { detectCardNetwork } from '../services/cardDetector';
import { formatCardNumber, maskCardNumber, getMaskedAccessibilityLabel } from '../services/formatters';
import { copyToClipboard } from '../services/clipboard';
import { useAppTheme } from '../context/ThemeContext';

interface CardViewProps {
  card: Card;
  masked?: boolean;
  onPress?: () => void;
  enableLongPressCopy?: boolean;
  showShadow?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CardView: React.FC<CardViewProps> = ({
  card,
  masked = true,
  onPress,
  enableLongPressCopy = true,
  showShadow = true,
}) => {
  const { isDark } = useAppTheme();
  const [copiedBadgeVisible, setCopiedBadgeVisible] = useState(false);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.98, {
      duration: 120,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 120,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleLongPress = async () => {
    if (!enableLongPressCopy || !card.number) return;
    await copyToClipboard(card.number, { enableHaptic: true });
    setCopiedBadgeVisible(true);
    setTimeout(() => {
      setCopiedBadgeVisible(false);
    }, 1500);
  };

  const colorDef = CARD_COLORS[card.color] || CARD_COLORS.grafit;
  const network = detectCardNetwork(card.number);
  const displayNumber = masked ? maskCardNumber(card.number) : formatCardNumber(card.number);

  const shadowStyle = showShadow
    ? {
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.4 : 0.25,
            shadowRadius: 24,
          },
          android: {
            elevation: 10,
          },
        }),
      }
    : null;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      onLongPress={enableLongPressCopy ? handleLongPress : undefined}
      delayLongPress={450}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${card.label}, ${getMaskedAccessibilityLabel(card.number)}`}
      accessibilityHint={enableLongPressCopy ? 'Detayı açmak için dokunun, numarayı kopyalamak için basılı tutun' : undefined}
      style={[styles.container, shadowStyle, animatedStyle]}
    >
      <LinearGradient
        colors={colorDef.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Subtle top inner 1px border for light reflection */}
        <View style={styles.innerHighlight} pointerEvents="none" />

        {/* Top row: Label & Network Text */}
        <View style={styles.topRow}>
          <Text style={styles.label} numberOfLines={1}>
            {card.label || 'Yeni Kart'}
          </Text>
          {network ? <Text style={styles.networkText}>{network}</Text> : <View style={styles.networkPlaceholder} />}
        </View>

        {/* Middle/Lower area: Card Number (Hero) */}
        <View style={styles.numberRow}>
          <Text style={styles.cardNumber} numberOfLines={1} adjustsFontSizeToFit>
            {displayNumber || '•••• •••• •••• ••••'}
          </Text>
        </View>

        {/* Bottom row: Expiry (left) and Holder Name (right) */}
        <View style={styles.bottomRow}>
          <View style={styles.expiryContainer}>
            <Text style={styles.subLabel}>SON KULLANMA</Text>
            <Text style={styles.expiryValue}>
              {card.expiry || '••/••'}
            </Text>
          </View>

          {card.holderName ? (
            <View style={styles.holderContainer}>
              <Text style={styles.holderName} numberOfLines={1}>
                {card.holderName.toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={styles.holderContainer} />
          )}
        </View>

        {/* Long press "Kopyalandı" overlay badge */}
        {copiedBadgeVisible && (
          <View style={styles.copiedBadge}>
            <Check size={18} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.copiedBadgeText}>Kopyalandı</Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: SIZES.cardAspectRatio,
    borderRadius: RADIUS.card,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    borderRadius: RADIUS.card,
    padding: SPACING.screenPadding,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...typography.headline,
    color: '#FFFFFF',
    flex: 1,
    marginRight: SPACING.sm,
  },
  networkText: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  networkPlaceholder: {
    width: 20,
    height: 14,
  },
  numberRow: {
    marginTop: 'auto',
    marginBottom: SPACING.md,
  },
  cardNumber: {
    ...typography.numberCard,
    color: '#FFFFFF',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  expiryContainer: {
    justifyContent: 'flex-end',
  },
  subLabel: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontWeight: '600',
  },
  expiryValue: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  holderContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: SPACING.md,
  },
  holderName: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  copiedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderRadius: RADIUS.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  copiedBadgeText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
