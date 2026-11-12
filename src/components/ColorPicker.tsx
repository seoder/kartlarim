import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CardColorKey, CARD_COLORS, CARD_COLOR_KEYS, SPACING } from '../theme';
import { useAppTheme } from '../context/ThemeContext';

interface ColorPickerProps {
  selectedColor: CardColorKey;
  onSelectColor: (color: CardColorKey) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  const { tokens } = useAppTheme();

  return (
    <View style={styles.container}>
      {CARD_COLOR_KEYS.map((key) => {
        const colorDef = CARD_COLORS[key];
        const isSelected = selectedColor === key;

        return (
          <Pressable
            key={key}
            onPress={() => onSelectColor(key)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${colorDef.label} rengi`}
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.circleContainer,
              isSelected && {
                borderColor: tokens.textPrimary,
                borderWidth: 2,
              },
            ]}
          >
            <LinearGradient
              colors={colorDef.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.circle}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  circleContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
