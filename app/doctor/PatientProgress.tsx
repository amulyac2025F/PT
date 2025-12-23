import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PatientProgressProps {
  patientName: string;
  onBack: () => void;
}

const weeklyData = [
  { day: 'Mon', completed: 3, total: 3 },
  { day: 'Tue', completed: 2, total: 3 },
  { day: 'Wed', completed: 3, total: 3 },
  { day: 'Thu', completed: 3, total: 3 },
  { day: 'Fri', completed: 1, total: 3 },
  { day: 'Sat', completed: 0, total: 3 },
  { day: 'Sun', completed: 0, total: 3 }
];

const exerciseHistory = [
  { name: 'Shoulder Flexion', date: '2025-11-08', sets: 3, reps: 10, formAccuracy: 94, duration: '8m 45s' },
  { name: 'Knee Extension', date: '2025-11-08', sets: 2, reps: 15, formAccuracy: 89, duration: '6m 20s' },
  { name: 'Wall Push-ups', date: '2025-11-07', sets: 2, reps: 12, formAccuracy: 92, duration: '7m 15s' },
  { name: 'Shoulder Flexion', date: '2025-11-07', sets: 3, reps: 10, formAccuracy: 91, duration: '9m 10s' },
  { name: 'Knee Extension', date: '2025-11-06', sets: 2, reps: 15, formAccuracy: 88, duration: '6m 45s' }
];

const achievements = [
  { title: '5 Day Streak', description: 'Completed exercises 5 days in a row', icon: '🔥', date: '2025-11-08' },
  { title: 'Form Master', description: 'Maintained 90%+ form accuracy', icon: '🎯', date: '2025-11-07' },
  { title: 'Early Bird', description: 'Completed morning exercises', icon: '🌅', date: '2025-11-06' },
  { title: 'Consistency King', description: '30 days of regular practice', icon: '👑', date: '2025-11-01' }
];

export function PatientProgress({ patientName, onBack }: PatientProgressProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={20} color={tint} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText type="title">{patientName}</ThemedText>
          <ThemedText style={styles.subtitle}>Progress Tracking</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📅</Text>
            </View>
            <ThemedText style={styles.statLabel}>Total Sessions</ThemedText>
            <ThemedText type="title" style={styles.statValue}>47</ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📈</Text>
            </View>
            <ThemedText style={styles.statLabel}>Avg Form Score</ThemedText>
            <ThemedText type="title" style={styles.statValue}>91%</ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>🏆</Text>
            </View>
            <ThemedText style={styles.statLabel}>Achievements</ThemedText>
            <ThemedText type="title" style={styles.statValue}>{achievements.length}</ThemedText>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>🔥</Text>
            </View>
            <ThemedText style={styles.statLabel}>Current Streak</ThemedText>
            <ThemedText type="title" style={styles.statValue}>5 days</ThemedText>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>This Week's Activity</ThemedText>
          <View style={styles.weeklyChart}>
            {weeklyData.map((day) => {
              const percentage = (day.completed / day.total) * 100;
              return (
                <View key={day.day} style={styles.dayColumn}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.max(percentage, 5)}%`,
                          backgroundColor: percentage === 100 ? '#22c55e' : percentage > 0 ? '#3b82f6' : '#e5e7eb'
                        }
                      ]}
                    />
                  </View>
                  <ThemedText style={styles.dayLabel}>{day.day}</ThemedText>
                  <ThemedText style={styles.dayCount}>{day.completed}/{day.total}</ThemedText>
                </View>
              );
            })}
          </View>
        </View>

        {/* Exercise History */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Recent Exercise Sessions</ThemedText>
          {exerciseHistory.map((exercise, index) => (
            <View key={index} style={[styles.historyItem, index !== exerciseHistory.length - 1 && styles.historyItemBorder]}>
              <View style={styles.historyLeft}>
                <ThemedText type="defaultSemiBold">{exercise.name}</ThemedText>
                <ThemedText style={styles.historyDate}>{exercise.date}</ThemedText>
              </View>
              <View style={[styles.badge, { backgroundColor: exercise.formAccuracy >= 90 ? '#d1fae5' : '#f3f4f6' }]}>
                <Text style={{ color: exercise.formAccuracy >= 90 ? '#065f46' : '#374151', fontSize: 12, fontWeight: '600' }}>
                  {exercise.formAccuracy}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Achievements</ThemedText>
          {achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementItem, index !== achievements.length - 1 && styles.achievementBorder]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementContent}>
                <ThemedText type="defaultSemiBold">{achievement.title}</ThemedText>
                <ThemedText style={styles.achievementDesc}>{achievement.description}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Progress Insights</ThemedText>
          <View style={styles.insightItem}>
            <ThemedText style={styles.insightLabel}>Form Improvement</ThemedText>
            <View style={styles.insightBar}>
              <View style={[styles.insightFill, { width: '91%' }]} />
            </View>
            <ThemedText style={styles.insightValue}>+8% this month</ThemedText>
          </View>
          
          <View style={styles.insightItem}>
            <ThemedText style={styles.insightLabel}>Consistency Score</ThemedText>
            <View style={styles.insightBar}>
              <View style={[styles.insightFill, { width: '87%' }]} />
            </View>
            <ThemedText style={styles.insightValue}>Excellent</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { marginRight: 12 },
  headerContent: { flex: 1 },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 40 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: { width: '48%', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f0f0f0', alignItems: 'center' },
  statIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statIconText: { fontSize: 24 },
  statLabel: { fontSize: 12, color: '#6b7280', marginBottom: 4, textAlign: 'center' },
  statValue: { fontSize: 20 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  cardTitle: { fontSize: 14, marginBottom: 12 },
  weeklyChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 180 },
  dayColumn: { flex: 1, alignItems: 'center', gap: 8 },
  barContainer: { flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '80%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  dayLabel: { fontSize: 12, fontWeight: '500' },
  dayCount: { fontSize: 10, color: '#6b7280' },
  historyItem: { paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  historyLeft: { flex: 1 },
  historyDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  achievementItem: { flexDirection: 'row', paddingVertical: 12, gap: 12, alignItems: 'center' },
  achievementBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  achievementIcon: { fontSize: 28 },
  achievementContent: { flex: 1 },
  achievementDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  insightItem: { marginBottom: 16 },
  insightLabel: { fontSize: 12, marginBottom: 6, fontWeight: '500' },
  insightBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 4, overflow: 'hidden' },
  insightFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },
  insightValue: { fontSize: 11, color: '#6b7280' }
});