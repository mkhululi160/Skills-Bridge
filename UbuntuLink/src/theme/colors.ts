export const COLORS = {
  primary: '#0F172A',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  ai: '#8B5CF6',              // NEW: AI purple
  aiLight: '#F5F3FF',         // NEW: AI background
  gradientStart: '#0F172A',
  gradientEnd: '#1E293B',
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' as const, color: COLORS.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: 'bold' as const, color: COLORS.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 },
  caption: { fontSize: 13, color: COLORS.textSecondary },
  button: { fontSize: 16, fontWeight: 'bold' as const, color: COLORS.surface },
};