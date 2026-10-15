import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  skill: string;
  verified?: boolean;
  isAI?: boolean;
}

export const SkillBadge: React.FC<Props> = ({ skill, verified, isAI }) => {
  const bg = isAI ? COLORS.ai : verified ? COLORS.secondary : COLORS.border;
  const textColor = isAI || verified ? COLORS.surface : COLORS.textSecondary;
  const iconName = isAI ? 'auto-awesome' : 'check-circle';

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {(verified || isAI) && (
        <MaterialIcons name={iconName} size={12} color={COLORS.surface} style={{ marginRight: 4 }} />
      )}
      <Text style={[styles.text, { color: textColor }]}>{skill}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.sm, paddingVertical: 6,
    borderRadius: 20, marginRight: SPACING.sm, marginBottom: SPACING.sm,
  },
  text: { fontSize: 12, fontWeight: '600' },
});