import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../src/context/ThemeContext';
import { useCards } from '../src/context/CardContext';
import { CardView } from '../src/components/CardView';
import { FormField } from '../src/components/FormField';
import { ColorPicker } from '../src/components/ColorPicker';
import { Card, CardColorKey } from '../src/types/card';
import { formatCardNumber, formatExpiry, cleanDigits, formatIBAN } from '../src/services/formatters';
import { validateLuhn } from '../src/services/luhn';
import { triggerHaptic } from '../src/services/clipboard';
import { typography, SPACING, RADIUS, SIZES } from '../src/theme';

export default function CardModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { tokens } = useAppTheme();
  const { getCard, addCard, updateCard, leastUsedColor } = useCards();
  const insets = useSafeAreaInsets();

  const existingCard = id ? getCard(id) : undefined;
  const isEditing = Boolean(existingCard);

  // Form State
  const [number, setNumber] = useState<string>(existingCard?.number || '');
  const [label, setLabel] = useState<string>(existingCard?.label || '');
  const [expiry, setExpiry] = useState<string>(existingCard?.expiry || '');
  const [cvv, setCvv] = useState<string>(existingCard?.cvv || '');
  const [holderName, setHolderName] = useState<string>(existingCard?.holderName || '');
  const [iban, setIban] = useState<string>(existingCard?.iban || '');
  const [note, setNote] = useState<string>(existingCard?.note || '');
  const [color, setColor] = useState<CardColorKey>(
    existingCard?.color || leastUsedColor
  );

  // Focus Refs for Keyboard "Next" Navigation
  const labelRef = useRef<any>(null);
  const expiryRef = useRef<any>(null);
  const cvvRef = useRef<any>(null);
  const holderRef = useRef<any>(null);
  const ibanRef = useRef<any>(null);
  const noteRef = useRef<any>(null);

  // Formatting & Input Handlers
  const handleNumberChange = (text: string) => {
    const rawDigits = cleanDigits(text).slice(0, 19);
    setNumber(rawDigits);
  };

  const handleExpiryChange = (text: string) => {
    const digits = cleanDigits(text).slice(0, 4);
    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const handleCvvChange = (text: string) => {
    const digits = cleanDigits(text).slice(0, 4);
    setCvv(digits);
  };

  const handleIbanChange = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 26);
    setIban(cleaned);
  };

  // Validation
  const numberDigits = cleanDigits(number);
  const isNumberLengthValid = numberDigits.length >= 12 && numberDigits.length <= 19;
  const isLabelValid = label.trim().length > 0;
  const isFormValid = isNumberLengthValid && isLabelValid;

  const isLuhnValid = useMemo(() => {
    if (numberDigits.length < 12) return true; // Don't warn while typing initial digits
    return validateLuhn(numberDigits);
  }, [numberDigits]);

  const previewCard: Card = {
    id: existingCard?.id || 'preview',
    label: label.trim() || 'Yeni Kart',
    number: numberDigits,
    expiry,
    cvv,
    holderName: holderName.trim(),
    iban,
    note,
    color,
    createdAt: existingCard?.createdAt || Date.now(),
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    if (isEditing && existingCard) {
      await updateCard(existingCard.id, {
        label: label.trim(),
        number: numberDigits,
        expiry: expiry.trim() || undefined,
        cvv: cvv.trim() || undefined,
        holderName: holderName.trim() || undefined,
        iban: iban.trim() || undefined,
        note: note.trim() || undefined,
        color,
      });
    } else {
      await addCard({
        label: label.trim(),
        number: numberDigits,
        expiry: expiry.trim() || undefined,
        cvv: cvv.trim() || undefined,
        holderName: holderName.trim() || undefined,
        iban: iban.trim() || undefined,
        note: note.trim() || undefined,
        color,
      });
    }

    triggerHaptic('success');
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: tokens.bg }]}
    >
      {/* Top Header: "Vazgeç" on left, title in center */}
      <View
        style={[
          styles.header,
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
          accessibilityLabel="Vazgeç"
          style={styles.cancelButton}
        >
          <Text style={[typography.headline, { color: tokens.textSecondary, fontSize: 16 }]}>
            Vazgeç
          </Text>
        </Pressable>

        <Text style={[typography.headline, { color: tokens.textPrimary, fontSize: 17 }]}>
          {isEditing ? 'Kartı Düzenle' : 'Kart Ekle'}
        </Text>

        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 16) + SIZES.buttonHeight + SPACING.xl,
            paddingHorizontal: SPACING.screenPadding,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Live Card Preview: Updates in real time */}
        <View style={styles.previewContainer}>
          <CardView
            card={previewCard}
            masked={false}
            enableLongPressCopy={false}
          />
        </View>

        {/* Color Picker: 6 gradient circles with active ring */}
        <View style={styles.colorPickerContainer}>
          <ColorPicker selectedColor={color} onSelectColor={setColor} />
        </View>

        {/* Form Fields: Ordered Kart numarası, Etiket, Son kullanma, CVV, Kart sahibi, Not */}
        <View style={styles.fieldsContainer}>
          {/* 1. Kart Numarası */}
          <FormField
            label="KART NUMARASI"
            value={formatCardNumber(number)}
            onChangeText={handleNumberChange}
            placeholder="0000 0000 0000 0000"
            keyboardType="number-pad"
            returnKeyType="next"
            isMono={true}
            onSubmitEditing={() => labelRef.current?.focus()}
            error={
              numberDigits.length > 0 && numberDigits.length < 12
                ? 'Kart numarası en az 12 hane olmalıdır'
                : undefined
            }
            warning={
              numberDigits.length >= 12 && !isLuhnValid
                ? 'Kart numarası doğrulama kuralına uymuyor (Luhn)'
                : undefined
            }
          />

          {/* 2. Etiket */}
          <FormField
            ref={labelRef}
            label="ETİKET"
            value={label}
            onChangeText={setLabel}
            placeholder="Maaş Kartı, Alışveriş vb."
            returnKeyType="next"
            onSubmitEditing={() => expiryRef.current?.focus()}
            error={label.length > 0 && !isLabelValid ? 'Etiket boş olamaz' : undefined}
          />

          {/* 3 & 4. Son Kullanma & CVV (Side by side for optimal mobile layout) */}
          <View style={styles.rowFields}>
            <View style={styles.flexHalf}>
              <FormField
                ref={expiryRef}
                label="SON KULLANMA"
                value={expiry}
                onChangeText={handleExpiryChange}
                placeholder="AA/YY"
                keyboardType="number-pad"
                maxLength={5}
                returnKeyType="next"
                isMono={true}
                onSubmitEditing={() => cvvRef.current?.focus()}
              />
            </View>

            <View style={styles.flexHalf}>
              <FormField
                ref={cvvRef}
                label="CVV"
                value={cvv}
                onChangeText={handleCvvChange}
                placeholder="000"
                keyboardType="number-pad"
                maxLength={4}
                returnKeyType="next"
                isMono={true}
                onSubmitEditing={() => holderRef.current?.focus()}
              />
            </View>
          </View>

          {/* 5. Kart Sahibi */}
          <FormField
            ref={holderRef}
            label="KART SAHİBİ"
            value={holderName}
            onChangeText={setHolderName}
            placeholder="AD SOYAD"
            autoCapitalize="characters"
            returnKeyType="next"
            onSubmitEditing={() => ibanRef.current?.focus()}
          />

          {/* IBAN (Hızlı IBAN erişimi için) */}
          <FormField
            ref={ibanRef}
            label="IBAN (İSTEĞE BAĞLI)"
            value={formatIBAN(iban)}
            onChangeText={handleIbanChange}
            placeholder="TR00 0000 0000 0000 0000 0000 00"
            autoCapitalize="characters"
            returnKeyType="next"
            isMono={true}
            onSubmitEditing={() => noteRef.current?.focus()}
          />

          {/* 6. Not */}
          <FormField
            ref={noteRef}
            label="NOT"
            value={note}
            onChangeText={setNote}
            placeholder="Ekstra notlar (isteğe bağlı)"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Primary Button "Kaydet": 54px height, disabled 40% until valid */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: tokens.bg,
            borderTopColor: tokens.border,
            paddingBottom: Math.max(insets.bottom, 16),
            paddingHorizontal: SPACING.screenPadding,
          },
        ]}
      >
        <Pressable
          onPress={handleSave}
          disabled={!isFormValid}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Kaydet"
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: tokens.action,
              opacity: !isFormValid ? 0.4 : pressed ? 0.88 : 1,
            },
          ]}
        >
          <Text style={[styles.saveButtonText, { color: tokens.actionText }]}>
            Kaydet
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
  },
  cancelButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  headerRightSpacer: {
    width: 48,
  },
  scrollContent: {
    paddingTop: SPACING.xs,
  },
  previewContainer: {
    marginBottom: SPACING.md,
  },
  colorPickerContainer: {
    marginBottom: SPACING.base,
  },
  fieldsContainer: {
    gap: SPACING.xs,
  },
  rowFields: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  flexHalf: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  saveButtonText: {
    ...typography.headline,
    fontWeight: '600',
  },
});
