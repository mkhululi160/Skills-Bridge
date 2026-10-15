import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';
import { SkillBadge } from '../components/SkillBadge';
import { Header } from '../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { verifySkill } from '../utils/api';

export const VerifyScreen = ({ navigation }: any) => {
  const [skill, setSkill] = useState('');
  const [evidence, setEvidence] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>(['Excel']);

  const handleVerify = async () => {
    if (!skill.trim() || !evidence.trim()) {
      Alert.alert('Missing Info', 'Please fill in both fields.');
      return;
    }
    setIsVerifying(true);
    try {
      await verifySkill(skill, evidence);
      setVerifiedSkills((prev) => [...prev, skill]);
      Alert.alert('Success!', `${skill} has been verified.`);
      setSkill('');
      setEvidence('');
    } catch {
      Alert.alert('Error', 'Could not verify. Check your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Verify Skills" subtitle="Manually verify a skill" onBack={() => navigation.goBack()} />

      <View style={styles.card}>
        <Text style={styles.label}>Skill Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Coding, Excel, Sales"
          placeholderTextColor={COLORS.textSecondary}
          value={skill}
          onChangeText={setSkill}
        />

        <Text style={styles.label}>Evidence of Work</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe where you used this skill..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
          value={evidence}
          onChangeText={setEvidence}
          textAlignVertical="top"
        />

        <PrimaryButton
          title={isVerifying ? 'Verifying...' : 'Submit for Verification'}
          icon="check-circle"
          onPress={handleVerify}
          loading={isVerifying}
        />
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={24} color={COLORS.info} />
        <Text style={styles.infoText}>
          Prefer AI? Use <Text style={{ fontWeight: '700' }}>Log Work</Text> tab to let AI extract your skills automatically.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your Verified Skills</Text>
      <View style={styles.badgeContainer}>
        {verifiedSkills.map((s, i) => (
          <SkillBadge key={i} skill={s} verified />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 20, padding: SPACING.lg, margin: SPACING.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  label: { ...TYPOGRAPHY.caption, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: {
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: SPACING.md, fontSize: 16, color: COLORS.textPrimary,
  },
  textArea: { height: 120 },
  infoCard: {
    flexDirection: 'row', backgroundColor: '#E0F2FE', padding: SPACING.md,
    borderRadius: 16, marginHorizontal: SPACING.lg, alignItems: 'center',
  },
  infoText: { ...TYPOGRAPHY.caption, color: '#0369A1', flex: 1, marginLeft: SPACING.sm },
  sectionTitle: { ...TYPOGRAPHY.h3, marginTop: SPACING.xl, marginHorizontal: SPACING.lg },
  badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.lg },
});