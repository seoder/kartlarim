import { StyleSheet, TextStyle } from 'react-native';
import { FONTS } from './theme';

export const typography: Record<string, TextStyle> = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  fieldLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  numberCard: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '500',
    letterSpacing: 1,
  },
  numberDetail: {
    fontFamily: FONTS.mono,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  monoValue: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
});
