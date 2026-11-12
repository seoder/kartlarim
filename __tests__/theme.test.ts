import { DARK_THEME, LIGHT_THEME, CARD_COLORS, CARD_COLOR_KEYS } from '../src/theme/theme';

describe('theme tokens verification', () => {
  it('verifies dark theme tokens match spec', () => {
    expect(DARK_THEME.bg).toBe('#0B0C0E');
    expect(DARK_THEME.surface).toBe('#15171A');
    expect(DARK_THEME.surfaceRaised).toBe('#1D2024');
    expect(DARK_THEME.border).toBe('#2A2E33');
    expect(DARK_THEME.textPrimary).toBe('#F2F3F5');
    expect(DARK_THEME.textSecondary).toBe('#9BA1A9');
    expect(DARK_THEME.textTertiary).toBe('#6B7178');
    expect(DARK_THEME.action).toBe('#F2F3F5');
    expect(DARK_THEME.actionText).toBe('#0B0C0E');
    expect(DARK_THEME.success).toBe('#3DD68C');
    expect(DARK_THEME.warning).toBe('#F5B94A');
    expect(DARK_THEME.danger).toBe('#FF5A5F');
  });

  it('verifies light theme tokens match spec', () => {
    expect(LIGHT_THEME.bg).toBe('#F6F6F4');
    expect(LIGHT_THEME.surface).toBe('#FFFFFF');
    expect(LIGHT_THEME.surfaceRaised).toBe('#FFFFFF');
    expect(LIGHT_THEME.border).toBe('#E4E4E0');
    expect(LIGHT_THEME.textPrimary).toBe('#111315');
    expect(LIGHT_THEME.textSecondary).toBe('#5C6268');
    expect(LIGHT_THEME.textTertiary).toBe('#8A9096');
    expect(LIGHT_THEME.action).toBe('#111315');
    expect(LIGHT_THEME.actionText).toBe('#FFFFFF');
    expect(LIGHT_THEME.success).toBe('#1F9D63');
    expect(LIGHT_THEME.warning).toBe('#B7791F');
    expect(LIGHT_THEME.danger).toBe('#D93036');
  });

  it('verifies all 6 card gradient color pairs match spec', () => {
    expect(CARD_COLOR_KEYS).toEqual(['grafit', 'gece', 'zumrut', 'bordo', 'mor', 'bakir']);

    expect(CARD_COLORS.grafit.colors).toEqual(['#2B2F36', '#111317']);
    expect(CARD_COLORS.gece.colors).toEqual(['#1F3A8A', '#0F1B4D']);
    expect(CARD_COLORS.zumrut.colors).toEqual(['#0F6B5C', '#06382F']);
    expect(CARD_COLORS.bordo.colors).toEqual(['#8A1F3D', '#4A0E22']);
    expect(CARD_COLORS.mor.colors).toEqual(['#5B2A9D', '#2C1259']);
    expect(CARD_COLORS.bakir.colors).toEqual(['#A8562A', '#5C2A12']);

    CARD_COLOR_KEYS.forEach((key) => {
      expect(CARD_COLORS[key].textColor).toBe('#FFFFFF');
    });
  });
});
