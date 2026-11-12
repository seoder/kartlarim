import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ColorTokens, DARK_THEME, LIGHT_THEME } from '../theme/theme';

interface ThemeContextValue {
  tokens: ColorTokens;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  tokens: DARK_THEME,
  isDark: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const isDark = systemScheme !== 'light'; // Dark theme is default per spec

  const tokens = useMemo(() => {
    return isDark ? DARK_THEME : LIGHT_THEME;
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ tokens, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
