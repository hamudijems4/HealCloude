export const COLORS = {
  primary: '#6C63FF',
  secondary: '#A78BFA',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  // Dark theme backgrounds
  background: '#0E0E16',
  surface: '#1A1A2E',
  card: '#1E1E30',
  cardAlt: '#252538',
  text: '#F0F0FF',
  textMuted: '#6B7280',
  textSub: '#9CA3AF',
  white: '#FFFFFF',
  black: '#000000',
  // tinted lights for dark backgrounds
  primaryLight: 'rgba(108, 99, 255, 0.15)',
  successLight: 'rgba(16, 185, 129, 0.15)',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  border: 'rgba(255, 255, 255, 0.06)',
  shadow: 'rgba(0, 0, 0, 0.6)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
};
