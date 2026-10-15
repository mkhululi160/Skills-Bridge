import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { JobCard } from '../components/JobCard';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchMatches, fetchUser } from '../utils/api';

export const HomeScreen = ({ navigation }: any) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const [jobsData, userData] = await Promise.all([fetchMatches(), fetchUser()]);
    setJobs(jobsData);
    setUser(userData);
    setRefreshing(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Reload when screen comes into focus (after adding AI skills)
  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const totalSkills = (user?.skills?.filter((s: any) => s.verified).length || 0) + (user?.aiSkills?.length || 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} tintColor={COLORS.surface} />}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'there'} 👋</Text>
            <Text style={styles.subGreeting}>Let's shorten the distance to your income.</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
            <MaterialIcons name="person" size={24} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalSkills}</Text>
            <Text style={styles.statLabel}>Total Skills</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.aiSkills?.length || 0}</Text>
            <Text style={styles.statLabel}>AI-Added</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{jobs[0]?.matchScore || 0}%</Text>
            <Text style={styles.statLabel}>Top Match</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Verify')}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <MaterialIcons name="verified" size={24} color={COLORS.info} />
            </View>
            <Text style={styles.actionText}>Verify Skill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Experience')}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.aiLight }]}>
              <MaterialIcons name="auto-awesome" size={24} color={COLORS.ai} />
            </View>
            <Text style={styles.actionText}>AI Log Work</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Admin')}>
            <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
              <MaterialIcons name="dashboard" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.actionText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.jobSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Matched for You</Text>
          <Text style={styles.seeAll}>{jobs.length} jobs</Text>
        </View>
        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No matches yet.</Text>
            <Text style={styles.emptySubtext}>Add skills to unlock jobs.</Text>
          </View>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={() => alert(`Applied to ${job.title}`)} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg, paddingTop: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...TYPOGRAPHY.h2, color: COLORS.surface },
  subGreeting: { ...TYPOGRAPHY.body, color: '#94A3B8', marginTop: 4 },
  profileIcon: { backgroundColor: 'rgba(255,255,255,0.1)', padding: SPACING.sm, borderRadius: 50 },
  statsContainer: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: SPACING.md,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { ...TYPOGRAPHY.h3, color: COLORS.surface },
  statLabel: { ...TYPOGRAPHY.caption, color: '#94A3B8', marginTop: 4 },
  actionSection: { padding: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.md },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: {
    backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 16, alignItems: 'center', width: '30%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  iconCircle: { padding: SPACING.sm, borderRadius: 50, marginBottom: SPACING.sm },
  actionText: { ...TYPOGRAPHY.caption, fontWeight: '600', textAlign: 'center' },
  jobSection: { padding: SPACING.lg, paddingTop: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  seeAll: { color: COLORS.textSecondary, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: SPACING.xl },
  emptyText: { ...TYPOGRAPHY.h3, marginTop: SPACING.md },
  emptySubtext: { ...TYPOGRAPHY.caption, marginTop: SPACING.xs },
});