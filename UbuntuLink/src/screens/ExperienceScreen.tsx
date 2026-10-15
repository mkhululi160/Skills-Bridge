import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';
import { SkillBadge } from '../components/SkillBadge';
import { Header } from '../components/Header';
import { MaterialIcons } from '@expo/vector-icons';
import { analyzeExperience, confirmAISkills } from '../utils/api';

export const ExperienceScreen = ({ navigation }: any) => {
  const [experience, setExperience] = useState('');
  const [aiSkills, setAiSkills] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAnalyze = async () => {
    if (!experience.trim() || experience.trim().length < 10) {
      Alert.alert('Tell us more', 'Please describe your experience in at least one full sentence.');
      return;
    }
    setIsAnalyzing(true);
    setAiSkills([]);
    setAiSummary('');
    setConfirmed(false);

    try {
      const result = await analyzeExperience(experience);
      setAiSkills(result.skills || []);
      setAiSummary(result.summary || '');
      setConfidence(result.confidence || 0);
    } catch (err: any) {
      Alert.alert('AI Error', err.message || 'Could not analyze. Check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = async () => {
    if (aiSkills.length === 0) return;
    setIsConfirming(true);
    try {
      await confirmAISkills(aiSkills);
      setConfirmed(true);
      Alert.alert(
        '✅ Skills Added!',
        `${aiSkills.length} AI-verified skills added to your profile.\n\nYour job matches have been updated.`,
        [{ text: 'See Matches', onPress: () => navigation.navigate('Home') }, { text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Error', 'Could not save skills. Try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReset = () => {
    setExperience('');
    setAiSkills([]);
    setAiSummary('');
    setConfirmed(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Header title="AI Log Experience" subtitle="Powered by Llama 3.1 via OpenRouter" onBack={() => navigation.goBack()} />

      <View style={styles.aiBadgeBanner}>
        <MaterialIcons name="auto-awesome" size={16} color={COLORS.ai} />
        <Text style={styles.aiBannerText}>Real AI analyzes your experience in seconds</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>What did you do?</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g., I sold sweets at school and managed my own stock and money for 6 months..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={5}
          value={experience}
          onChangeText={setExperience}
          textAlignVertical="top"
          editable={!isAnalyzing && !confirmed}
        />

        <PrimaryButton
          title={isAnalyzing ? 'AI is analyzing...' : 'Analyze with AI'}
          icon="auto-awesome"
          onPress={handleAnalyze}
          loading={isAnalyzing}
          variant="ai"
        />
      </View>

      {isAnalyzing && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={COLORS.ai} />
          <Text style={styles.loadingTitle}>Llama 3.1 is thinking...</Text>
          <Text style={styles.loadingSubtitle}>Translating your hustle into professional skills</Text>
        </View>
      )}

      {aiSkills.length > 0 && (
        <>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.aiIconCircle}>
                <MaterialIcons name="auto-awesome" size={20} color={COLORS.surface} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>AI-Suggested Skills</Text>
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(confidence * 100)}%
                </Text>
              </View>
            </View>

            {aiSummary ? (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Professional Summary</Text>
                <Text style={styles.summaryText}>"{aiSummary}"</Text>
              </View>
            ) : null}

            <Text style={styles.skillsLabel}>Skills detected:</Text>
            <View style={styles.badgeContainer}>
              {aiSkills.map((s, i) => (
                <SkillBadge key={i} skill={s} isAI />
              ))}
            </View>
          </View>

          {!confirmed ? (
            <View style={styles.confirmContainer}>
              <PrimaryButton
                title={isConfirming ? 'Saving...' : 'Confirm & Add to Profile'}
                icon="check-circle"
                onPress={handleConfirm}
                loading={isConfirming}
              />
              <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
                <MaterialIcons name="refresh" size={18} color={COLORS.primary} />
                <Text style={styles.retryText}>Not accurate? Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successCard}>
              <MaterialIcons name="verified" size={24} color={COLORS.success} />
              <Text style={styles.successText}>
                Skills saved! Your profile is now stronger and job matches have updated.
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  aiBadgeBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.aiLight, padding: SPACING.sm, margin: SPACING.lg,
    marginTop: SPACING.md, borderRadius: 12,
  },
  aiBannerText: { ...TYPOGRAPHY.caption, color: COLORS.ai, fontWeight: '600', marginLeft: SPACING.xs },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 20, padding: SPACING.lg,
    marginHorizontal: SPACING.lg, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  label: { ...TYPOGRAPHY.caption, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: {
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: SPACING.md, fontSize: 16, color: COLORS.textPrimary,
  },
  textArea: { height: 140 },
  loadingCard: {
    backgroundColor: COLORS.aiLight, borderRadius: 20, padding: SPACING.xl,
    margin: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: `${COLORS.ai}30`,
  },
  loadingTitle: { ...TYPOGRAPHY.h3, color: COLORS.ai, marginTop: SPACING.md },
  loadingSubtitle: { ...TYPOGRAPHY.caption, marginTop: SPACING.xs, textAlign: 'center' },
  resultCard: {
    backgroundColor: COLORS.aiLight, borderRadius: 20, padding: SPACING.lg,
    marginHorizontal: SPACING.lg, borderWidth: 1, borderColor: `${COLORS.ai}40`,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  aiIconCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.ai,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm,
  },
  resultTitle: { ...TYPOGRAPHY.h3, color: COLORS.ai },
  confidenceText: { ...TYPOGRAPHY.caption, color: COLORS.ai, fontWeight: '600' },
  summaryBox: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md,
    marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.ai,
  },
  summaryLabel: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.ai, marginBottom: 4 },
  summaryText: { ...TYPOGRAPHY.body, fontStyle: 'italic', color: COLORS.textPrimary },
  skillsLabel: { ...TYPOGRAPHY.caption, fontWeight: '600', marginBottom: SPACING.sm },
  badgeContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  confirmContainer: { padding: SPACING.lg, alignItems: 'center' },
  retryButton: { marginTop: SPACING.md, flexDirection: 'row', alignItems: 'center' },
  retryText: { color: COLORS.primary, marginLeft: 4, fontWeight: '600' },
  successCard: {
    backgroundColor: '#D1FAE5', borderRadius: 16, padding: SPACING.md,
    marginHorizontal: SPACING.lg, flexDirection: 'row', alignItems: 'center',
  },
  successText: { ...TYPOGRAPHY.caption, color: COLORS.success, marginLeft: SPACING.sm, flex: 1, fontWeight: '600' },
});