import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const Header: React.FC<Props> = ({ title, subtitle, onBack }) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  iconButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: SPACING.sm, borderRadius: 50 },
  textContainer: { flex: 1, marginLeft: SPACING.md },
  title: { ...TYPOGRAPHY.h2, color: COLORS.surface },
  subtitle: { ...TYPOGRAPHY.caption, color: '#94A3B8', marginTop: 4 },
});