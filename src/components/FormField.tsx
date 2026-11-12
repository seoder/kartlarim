import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { typography, SPACING, RADIUS, SIZES, FONTS } from '../theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  warning?: string;
  isMono?: boolean;
}

export const FormField = forwardRef<any, FormFieldProps>(
  ({ label, error, warning, isMono = false, style, ...inputProps }, ref) => {
    const { tokens } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.container}>
        <Text style={[styles.label, { color: tokens.textSecondary }]}>{label}</Text>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: tokens.surface,
              borderColor: error
                ? tokens.danger
                : isFocused
                ? tokens.textPrimary
                : tokens.border,
              borderWidth: isFocused ? 1.5 : 1,
            },
          ]}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={tokens.textTertiary}
            selectionColor={tokens.textPrimary}
            style={[
              styles.input,
              isMono ? styles.monoText : typography.body,
              { color: tokens.textPrimary },
              style,
            ]}
            onFocus={(e) => {
              setIsFocused(true);
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              inputProps.onBlur?.(e);
            }}
            {...inputProps}
          />
        </View>

        {error ? (
          <Text style={[styles.message, { color: tokens.danger }]}>{error}</Text>
        ) : warning ? (
          <Text style={[styles.message, { color: tokens.warning }]}>{warning}</Text>
        ) : null}
      </View>
    );
  }
);

FormField.displayName = 'FormField';

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    ...typography.fieldLabel,
    marginBottom: SPACING.xs + 2,
  },
  inputWrapper: {
    height: SIZES.fieldHeight,
    borderRadius: RADIUS.field,
    paddingHorizontal: SPACING.base,
    justifyContent: 'center',
  },
  input: {
    height: '100%',
    padding: 0,
    fontSize: 16,
  },
  monoText: {
    fontFamily: FONTS.mono,
    fontSize: 17,
    letterSpacing: 0.5,
  },
  message: {
    ...typography.caption,
    marginTop: 4,
    marginLeft: 2,
  },
});
