import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { Header } from '../components/Header';
import { SkillBadge } from '../components/SkillBadge';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchUser } from '../utils/api';

export const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchUser();
    setUser(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading || !user) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const verifiedSkills = (user.skills || []).filter((s: any) => s.verified);
  const pendingSkills = (user.skills || []).filter((s: any) => !s.verified);
  const aiSkills = user.aiSkills || [];

  return (
    <ScrollView style={styles.container}>
      <Header title="My Profile" onBack={() => navigation.goBack()} />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={40} color={COLORS.surface} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.location}>
          <MaterialIcons name="location-on" size={14} color={COLORS.textSecondary} /> {user.location}
        </Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>

      {user.aiSummary ? (
        <View style={styles.aiSummaryCard}>
          <View style={styles.aiSummaryHeader}>
            <MaterialIcons name="auto-awesome" size={18} color={COLORS.ai} />
            <Text style={styles.aiSummaryTitle}>AI-Generated Summary</Text>
          </View>
          <Text style={styles.aiSummaryText}>"{user.aiSummary}"</Text>
        </View>
      ) : null}

      {aiSkills.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="auto-awesome" size={18} color={COLORS.ai} />
            <Text style={[styles.sectionTitle, { color: COLORS.ai }]}>AI-Verified Skills</Text>
          </View>
          <View style={styles.badgeRow}>
            {aiSkills.map((s: any, i: number) => (
              <SkillBadge key={i} skill={s.name} isAI />
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verified Skills</Text>
        <View style={styles.badgeRow}>
          {verifiedSkills.length > 0 ? verifiedSkills.map((s: any, i: number) => (
            <SkillBadge key={i} skill={s.name} verified />
          )) : <Text style={styles.emptyText}>No verified skills yet</Text>}
        </View>
      </View>

      {pendingSkills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Verification</Text>
          <View style={styles.badgeRow}>
            {pendingSkills.map((s: any, i: number) => (
              <SkillBadge key={i} skill={s.name} verified={false} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  profileCard: {
    backgroundColor: COLORS.surface, margin: SPACING.lg, borderRadius: 20, padding: SPACING.lg,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  name: { ...TYPOGRAPHY.h2, marginBottom: SPACING.xs },
  location: { ...TYPOGRAPHY.caption, marginBottom: SPACING.sm },
  bio: { ...TYPOGRAPHY.body, textAlign: 'center' },
  aiSummaryCard: {
    backgroundColor: COLORS.aiLight, borderRadius: 16, padding: SPACING.md,
    marginHorizontal: SPACING.lg, marginBottom: SPACING.lg,
    borderLeftWidth: 3, borderLeftColor: COLORS.ai,
  },
  aiSummaryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  aiSummaryTitle: { ...TYPOGRAPHY.caption, fontWeight: '700', color: COLORS.ai, marginLeft: SPACING.xs },
  aiSummaryText: { ...TYPOGRAPHY.body, fontStyle: 'italic', color: COLORS.textPrimary },
  section: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, marginLeft: SPACING.xs },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyText: { ...TYPOGRAPHY.caption, fontStyle: 'italic' },
});