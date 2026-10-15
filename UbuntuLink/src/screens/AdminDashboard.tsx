import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme/colors';
import { Header } from '../components/Header';
import { fetchAdminMetrics } from '../utils/api';

export const AdminDashboard = ({ navigation }: any) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [totals, setTotals] = useState({ totalUsers: 0, totalManualSkills: 0, totalAISkills: 0, totalSkills: 0 });

  useEffect(() => {
    (async () => {
      const data = await fetchAdminMetrics();
      setMetrics(data.metrics || []);
      setTotals(data.totals || { totalUsers: 0, totalManualSkills: 0, totalAISkills: 0, totalSkills: 0 });
    })();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userLocation}>{item.location}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'Active' ? styles.statusActive : styles.statusPending]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.userStatsRow}>
        <View style={styles.userStat}>
          <Text style={styles.userStatNumber}>{item.manualSkillsCount}</Text>
          <Text style={styles.userStatLabel}>Manual</Text>
        </View>
        <View style={styles.userStat}>
          <Text style={[styles.userStatNumber, { color: COLORS.ai }]}>{item.aiSkillsCount}</Text>
          <Text style={styles.userStatLabel}>AI</Text>
        </View>
        <View style={styles.userStat}>
          <Text style={[styles.userStatNumber, { color: COLORS.secondary }]}>{item.totalSkills}</Text>
          <Text style={styles.userStatLabel}>Total</Text>
        </View>
      </View>

      {item.aiSummary && item.aiSummary !== "No AI analysis yet" && (
        <View style={styles.aiRow}>
          <Text style={styles.aiRowIcon}>🤖</Text>
          <Text style={styles.aiRowText} numberOfLines={2}>{item.aiSummary}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Header title="Admin Dashboard" subtitle="Youth engagement metrics" onBack={() => navigation.goBack()} />

      <View style={styles.kpiContainer}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiNumber}>{totals.totalUsers}</Text>
          <Text style={styles.kpiLabel}>Total Youth</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiNumber, { color: COLORS.ai }]}>{totals.totalAISkills}</Text>
          <Text style={styles.kpiLabel}>AI Skills</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiNumber, { color: COLORS.secondary }]}>{totals.totalSkills}</Text>
          <Text style={styles.kpiLabel}>Total Skills</Text>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>All Users (Exportable to Excel)</Text>
        <FlatList
          data={metrics}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.lg, paddingBottom: 0 },
  kpiBox: {
    backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 16, alignItems: 'center', flex: 1,
    marginHorizontal: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  kpiNumber: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  kpiLabel: { ...TYPOGRAPHY.caption, marginTop: 4 },
  tableContainer: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, margin: SPACING.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tableTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.md },
  userCard: {
    paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.background,
  },
  userHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  userName: { ...TYPOGRAPHY.h3, fontSize: 16 },
  userLocation: { ...TYPOGRAPHY.caption, marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: SPACING.sm, borderRadius: 8 },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 10, fontWeight: 'bold', color: COLORS.textPrimary },
  userStatsRow: { flexDirection: 'row', marginTop: SPACING.sm },
  userStat: { flex: 1, alignItems: 'center' },
  userStatNumber: { ...TYPOGRAPHY.h3, fontSize: 18, color: COLORS.textPrimary },
  userStatLabel: { ...TYPOGRAPHY.caption, fontSize: 11, marginTop: 2 },
  aiRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm,
    backgroundColor: COLORS.aiLight, padding: SPACING.sm, borderRadius: 8,
  },
  aiRowIcon: { fontSize: 14, marginRight: SPACING.xs },
  aiRowText: { ...TYPOGRAPHY.caption, flex: 1, color: COLORS.ai },
});