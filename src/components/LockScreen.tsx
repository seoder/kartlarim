import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SIZES, RADIUS, SPACING, typography } from '../theme';

export const LockScreen: React.FC = () => {
  const { tokens } = useAppTheme();
  const { authenticate, isAuthenticating, hasDeviceLockWarning } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tokens.bg,
          paddingTop: insets.top + SPACING.xl,
          paddingBottom: Math.max(insets.bottom, SPACING.base) + SPACING.base,
          paddingHorizontal: SPACING.screenPadding,
        },
      ]}
    >
      {/* Device Lock Warning if no PIN/biometric enrolled on device */}
      {hasDeviceLockWarning && (
        <View style={[styles.warningBox, { backgroundColor: tokens.surface, borderColor: tokens.warning }]}>
          <Text style={[styles.warningText, { color: tokens.warning }]}>
            Telefonda ekran kilidi tanımlı değil. Güvenliğiniz için ekran kilidi ayarlamanız önerilir.
          </Text>
        </View>
      )}

      {/* Center: App Icon (64px) with 48px gap below */}
      <View style={styles.centerContent}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <View style={styles.gap48} />
      </View>

      {/* Bottom: Main Button "Kilidi Aç" */}
      <Pressable
        onPress={() => authenticate()}
        disabled={isAuthenticating}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Kilidi Aç"
        style={({ pressed }) => [
          styles.unlockButton,
          {
            backgroundColor: tokens.action,
            opacity: pressed || isAuthenticating ? 0.8 : 1,
          },
        ]}
      >
        {isAuthenticating ? (
          <ActivityIndicator color={tokens.actionText} />
        ) : (
          <Text style={[styles.unlockButtonText, { color: tokens.actionText }]}>
            Kilidi Aç
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  gap48: {
    height: 48,
  },
  unlockButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  unlockButtonText: {
    ...typography.headline,
    fontWeight: '600',
  },
  warningBox: {
    padding: SPACING.base,
    borderRadius: RADIUS.field,
    borderWidth: 1,
    marginBottom: SPACING.base,
  },
  warningText: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
});
