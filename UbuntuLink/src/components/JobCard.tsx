import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { SkillBadge } from './SkillBadge';
import { PrimaryButton } from './PrimaryButton';
import { MaterialIcons } from '@expo/vector-icons';

interface JobProps {
  job: {
    id: string; title: string; company: string; location: string;
    stipend: string; type: string; requiredSkills: string[]; matchScore: number;
  };
  onApply: () => void;
}

export const JobCard: React.FC<JobProps> = ({ job, onApply }) => {
  const scoreColor = job.matchScore >= 75 ? COLORS.secondary : job.matchScore >= 50 ? COLORS.warning : COLORS.textSecondary;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company} • {job.location}</Text>
        </View>
        <View style={[styles.scoreContainer, { backgroundColor: `${scoreColor}15` }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>{job.matchScore}%</Text>
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>Match</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialIcons name="access-time" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{job.type}</Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialIcons name="attach-money" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{job.stipend}</Text>
        </View>
      </View>

      <View style={styles.skillsRow}>
        {job.requiredSkills.map((skill, i) => (
          <SkillBadge key={i} skill={skill} verified={job.matchScore >= 50} />
        ))}
      </View>

      <PrimaryButton title="Apply Now" icon="send" onPress={onApply} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: 20, padding: SPACING.md,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleContainer: { flex: 1 },
  title: { ...TYPOGRAPHY.h3, marginBottom: 4 },
  company: { ...TYPOGRAPHY.caption },
  scoreContainer: { padding: SPACING.sm, borderRadius: 12, alignItems: 'center', marginLeft: SPACING.sm },
  scoreText: { fontWeight: 'bold', fontSize: 16 },
  scoreLabel: { fontSize: 10, fontWeight: '600' },
  metaRow: { flexDirection: 'row', marginTop: SPACING.md, marginBottom: SPACING.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: SPACING.md },
  metaText: { ...TYPOGRAPHY.caption, marginLeft: 4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.sm },
});