export type ColorSchemeName = 'dark' | 'light';

export type CardColorKey = 'grafit' | 'gece' | 'zumrut' | 'bordo' | 'mor' | 'bakir';

export interface ColorTokens {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  action: string;
  actionText: string;
  success: string;
  warning: string;
  danger: string;
}

export const DARK_THEME: ColorTokens = {
  bg: '#0B0C0E',
  surface: '#15171A',
  surfaceRaised: '#1D2024',
  border: '#2A2E33',
  textPrimary: '#F2F3F5',
  textSecondary: '#9BA1A9',
  textTertiary: '#6B7178',
  action: '#F2F3F5',
  actionText: '#0B0C0E',
  success: '#3DD68C',
  warning: '#F5B94A',
  danger: '#FF5A5F',
};

export const LIGHT_THEME: ColorTokens = {
  bg: '#F6F6F4',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  border: '#E4E4E0',
  textPrimary: '#111315',
  textSecondary: '#5C6268',
  textTertiary: '#8A9096',
  action: '#111315',
  actionText: '#FFFFFF',
  success: '#1F9D63',
  warning: '#B7791F',
  danger: '#D93036',
};

export interface CardColorDefinition {
  key: CardColorKey;
  label: string;
  colors: [string, string];
  textColor: string;
}

export const CARD_COLORS: Record<CardColorKey, CardColorDefinition> = {
  grafit: {
    key: 'grafit',
    label: 'Grafit',
    colors: ['#2B2F36', '#111317'],
    textColor: '#FFFFFF',
  },
  gece: {
    key: 'gece',
    label: 'Gece Mavisi',
    colors: ['#1F3A8A', '#0F1B4D'],
    textColor: '#FFFFFF',
  },
  zumrut: {
    key: 'zumrut',
    label: 'Zümrüt',
    colors: ['#0F6B5C', '#06382F'],
    textColor: '#FFFFFF',
  },
  bordo: {
    key: 'bordo',
    label: 'Bordo',
    colors: ['#8A1F3D', '#4A0E22'],
    textColor: '#FFFFFF',
  },
  mor: {
    key: 'mor',
    label: 'Mor',
    colors: ['#5B2A9D', '#2C1259'],
    textColor: '#FFFFFF',
  },
  bakir: {
    key: 'bakir',
    label: 'Bakır',
    colors: ['#A8562A', '#5C2A12'],
    textColor: '#FFFFFF',
  },
};

export const CARD_COLOR_KEYS: CardColorKey[] = ['grafit', 'gece', 'zumrut', 'bordo', 'mor', 'bakir'];

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screenPadding: 20,
} as const;

export const RADIUS = {
  card: 20,
  sheet: 24,
  field: 14,
  button: 14,
  badge: 8,
} as const;

export const SIZES = {
  buttonHeight: 54,
  fieldHeight: 54,
  minTouchTarget: 48,
  fabSize: 56,
  iconSize: 22,
  cardAspectRatio: 1.586,
} as const;

export const ICONS = {
  strokeWidth: 1.75,
  size: 22,
} as const;

export const FONTS = {
  mono: 'IBMPlexMono-Medium',
} as const;
