import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  title: string;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ai';
}

export const PrimaryButton: React.FC<Props> = ({ title, onPress, icon, loading, variant = 'primary' }) => {
  const isOutline = variant === 'outline';
  const isAI = variant === 'ai';

  const bgColor = isOutline ? 'transparent' : isAI ? COLORS.ai : variant === 'secondary' ? COLORS.secondary : COLORS.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        isOutline && styles.outlineButton,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.surface} />
      ) : (
        <>
          {icon && (
            <MaterialIcons name={icon} size={20} color={isOutline ? COLORS.primary : COLORS.surface} style={styles.icon} />
          )}
          <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, paddingHorizontal: SPACING.lg,
    borderRadius: 16, marginVertical: SPACING.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  outlineButton: { borderWidth: 2, borderColor: COLORS.primary, shadowOpacity: 0, elevation: 0 },
  text: { ...TYPOGRAPHY.button },
  outlineText: { color: COLORS.primary },
  icon: { marginRight: SPACING.sm },
});