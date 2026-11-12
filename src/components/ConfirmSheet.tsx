import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { typography, SPACING, RADIUS, SIZES } from '../theme';
import { triggerHaptic } from '../services/clipboard';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmSheet: React.FC<ConfirmSheetProps> = ({
  visible,
  title,
  confirmLabel = 'Sil',
  cancelLabel = 'Vazgeç',
  onConfirm,
  onCancel,
}) => {
  const { tokens } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleConfirm = () => {
    triggerHaptic('warning');
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: tokens.surfaceRaised,
                  paddingBottom: Math.max(insets.bottom, SPACING.lg),
                },
              ]}
            >
              <Text style={[styles.title, { color: tokens.textPrimary }]}>
                {title}
              </Text>

              <View style={styles.buttons}>
                <Pressable
                  onPress={handleConfirm}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={confirmLabel}
                  style={({ pressed }) => [
                    styles.confirmButton,
                    {
                      backgroundColor: tokens.danger,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                </Pressable>

                <Pressable
                  onPress={onCancel}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={cancelLabel}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    {
                      borderColor: tokens.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.cancelButtonText, { color: tokens.textSecondary }]}>
                    {cancelLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.screenPadding,
  },
  title: {
    ...typography.headline,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  buttons: {
    gap: SPACING.md,
  },
  confirmButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cancelButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...typography.headline,
    fontWeight: '500',
  },
});
