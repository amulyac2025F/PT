import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

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

// Monthly trends data for line chart - Adherence % (Blue)
const adherenceData = [
  { value: 87, label: 'Week 1' },
  { value: 89, label: 'Week 2' },
  { value: 96, label: 'Week 3' },
  { value: 93, label: 'Week 4' }
];

// Form Accuracy % (Green)
const formAccuracyData = [
  { value: 96, label: 'Week 1' },
  { value: 98, label: 'Week 2' },
  { value: 99, label: 'Week 3' },
  { value: 99, label: 'Week 4' }
];

export function PatientProgress({ patientName, onBack }: PatientProgressProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const [activeTab, setActiveTab] = useState<'history' | 'achievements' | 'insights'>('history');

  const colors = {
    light: { bg: '#f9fafb', card: '#ffffff', text: '#111827', textSecondary: '#6b7280', border: '#e5e7eb' },
    dark: { bg: '#111827', card: '#1f2937', text: '#f3f4f6', textSecondary: '#9ca3af', border: '#374151' }
  };
  const theme = colors[colorScheme];

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconSymbol name="chevron.left" size={24} color={''} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={{ fontSize: 24 }}>{patientName}</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Patient improvement journey
          </ThemedText>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: '📅', label: 'Total Sessions', value: '47', color: '#dbeafe' },
            { icon: '📈', label: 'Avg Form Score', value: '91%', color: '#dcfce7' },
            { icon: '🏆', label: 'Achievements', value: achievements.length, color: '#e9d5ff' },
            { icon: '🔥', label: 'Current Streak', value: '5 days', color: '#fed7aa' }
          ].map((stat, idx) => (
            <View
              key={idx}
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={[styles.statIconBox, { backgroundColor: stat.color }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
              </View>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                {stat.label}
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20, marginTop: 6 }}>
                {stat.value}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {(['history', 'achievements', 'insights'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && [
                  styles.tabActive,
                  { borderBottomColor: '#0a7ea4' }
                ]
              ]}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === tab && { color: '#0a7ea4', fontWeight: '600' }
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'history' && (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Recent Exercise Sessions
            </ThemedText>
            {exerciseHistory.map((exercise, idx) => (
              <View
                key={idx}
                style={[
                  styles.historyItem,
                  idx !== exerciseHistory.length - 1 && [
                    styles.historyItemBorder,
                    { borderColor: theme.border }
                  ]
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" style={{ marginBottom: 4 }}>
                    {exercise.name}
                  </ThemedText>
                  <ThemedText style={[styles.historyDate, { color: theme.textSecondary }]}>
                    {exercise.date}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.formBadge,
                    {
                      backgroundColor: exercise.formAccuracy >= 90 ? '#dcfce7' : '#f3f4f6',
                      borderColor: exercise.formAccuracy >= 90 ? '#86efac' : '#e5e7eb'
                    }
                  ]}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: exercise.formAccuracy >= 90 ? '#15803d' : '#6b7280'
                    }}
                  >
                    {exercise.formAccuracy}%
                  </ThemedText>
                </View>
              </View>
            ))}
            <View style={styles.exerciseDetails}>
              <ThemedText style={[styles.detailsText, { color: theme.textSecondary }]}>
                {exerciseHistory[0].sets} sets × {exerciseHistory[0].reps} reps
              </ThemedText>
              <ThemedText style={[styles.detailsText, { color: theme.textSecondary }]}>
                Duration: {exerciseHistory[0].duration}
              </ThemedText>
            </View>
          </View>
        )}

        {activeTab === 'achievements' && (
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, idx) => (
              <View
                key={idx}
                style={[styles.achievementCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.achievementIconBox}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                </View>
                <ThemedText type="defaultSemiBold" style={styles.achievementTitle}>
                  {achievement.title}
                </ThemedText>
                <ThemedText
                  style={[styles.achievementDesc, { color: theme.textSecondary }]}
                >
                  {achievement.description}
                </ThemedText>
                <ThemedText
                  style={[styles.achievementDate, { color: theme.textSecondary }]}
                >
                  Earned on {achievement.date}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'insights' && (
          <View>
            {/* Progress Bars */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 20 }]}>
              <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                Your Progress Insights
              </ThemedText>

              {[
                { label: 'Form Improvement', badge: '+8% this month', percentage: 91 },
                { label: 'Consistency Score', badge: 'Excellent', percentage: 87 },
                { label: 'Exercise Variety', badge: 'Good', percentage: 73 }
              ].map((insight, idx) => (
                <View key={idx} style={[styles.insightItem, idx !== 2 && { borderBottomColor: theme.border }]}>
                  <View style={styles.insightHeader}>
                    <ThemedText style={{ fontWeight: '500' }}>{insight.label}</ThemedText>
                    <View style={[styles.insightBadge, { backgroundColor: '#f3f4f6' }]}>
                      <ThemedText style={{ fontSize: 12, color: theme.textSecondary }}>
                        {insight.badge}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${insight.percentage}%` }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Monthly Trends Chart */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 20, paddingVertical: 20 }]}>
              <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { paddingHorizontal: 16 }]}>
                Monthly Trends
              </ThemedText>
              <View style={{ alignItems: 'center', paddingHorizontal: 10, marginBottom: 16 }}>
                <LineChart
                  data={adherenceData}
                  data2={formAccuracyData}
                  height={340}
                  width={Dimensions.get('window').width - 60}
                  showVerticalLines
                  verticalLinesColor="#e5e7eb"
                  color="#3b82f6"
                  color2="#22c55e"
                  dataPointsColor="#3b82f6"
                  dataPointsColor2="#22c55e"
                  dataPointsRadius={6}
                  textColor="#6b7280"
                  textFontSize={12}
                  areaChart={false}
                  yAxisTextStyle={{ fontSize: 11 }}
                  xAxisLabelTextStyle={{ fontSize: 11 }}
                  noOfSections={5}
                  maxValue={100}
                />
              </View>
              <View style={styles.legendContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6', marginRight: 8 }} />
                  <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginRight: 24 }}>Adherence %</ThemedText>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e', marginRight: 8 }} />
                  <ThemedText style={{ fontSize: 12, color: theme.textSecondary }}>Form Accuracy %</ThemedText>
                </View>
              </View>
            </View>

            {/* Recommendations */}
            <View style={[styles.card, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', marginBottom: 20 }]}>
              <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: '#1e40af' }]}>
                 DocotorRecommendations
              </ThemedText>
              {[
                'Your shoulder exercises show great improvement! Keep it up.',
                'Try increasing reps on knee extensions next week.',
                'Consider adding more lower body exercises to your routine.',
                'Your morning sessions have better form accuracy - stick to AM workouts!'
              ].map((rec, idx) => (
                <ThemedText
                  key={idx}
                  style={[
                    styles.recommendationText,
                    { color: '#1e40af', marginBottom: idx !== 3 ? 8 : 0 }
                  ]}
                >
                  • {rec}
                </ThemedText>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12
  },
  backBtn: { padding: 8 },
  headerContent: { flex: 1 },
  headerSubtitle: { fontSize: 14, marginTop: 4 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 40 },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, gap: 12 },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center'
  },
  statIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statIcon: { fontSize: 20 },
  statLabel: { fontSize: 12, textAlign: 'center', marginBottom: 6 },

  // Tabs
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: 20, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },

  // History
  card: { borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1 },
  cardTitle: { fontSize: 16, marginBottom: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, gap: 12 },
  historyItemBorder: { borderBottomWidth: 1 },
  historyDate: { fontSize: 12, marginTop: 4 },
  formBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  exerciseDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', gap: 6 },
  detailsText: { fontSize: 13 },

  // Achievements
  achievementsGrid: { gap: 12, marginBottom: 20 },
  achievementCard: { borderRadius: 12, padding: 16, borderWidth: 1, alignItems: 'center' },
  achievementIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,215,0,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  achievementIcon: { fontSize: 28 },
  achievementTitle: { marginBottom: 6, fontSize: 14 },
  achievementDesc: { fontSize: 12, textAlign: 'center', marginBottom: 8 },
  achievementDate: { fontSize: 11 },

  // Insights
  insightItem: { paddingVertical: 16, borderBottomWidth: 1 },
  insightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  insightBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },

  recommendationsBox: { marginTop: 16, padding: 14, borderRadius: 10, borderWidth: 1 },
  recommendationText: { fontSize: 13, lineHeight: 18 },
  legendContainer: { paddingVertical: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' }
});