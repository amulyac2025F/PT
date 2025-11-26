import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor = Colors[colorScheme].icon;

  return (
    <ThemedView style={styles.container}>
      {/* 1. HEADER SECTION */}
      <View style={styles.header}>
        <ThemedText type="title">Physical Therapy</ThemedText>
        <View style={styles.headerRight}>
          <IconSymbol name="bell.fill" size={24} color={iconColor} />
          <View style={styles.profileBadge}>
            <ThemedText style={styles.profileInitials}>SJ</ThemedText>
          </View>
          <TouchableOpacity style={styles.logoutButton}>
             <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={iconColor} />
             <ThemedText style={{marginLeft: 5}}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 2. STATS ROW */}
        <View style={styles.statsContainer}>
          <InfoCard>
            <View style={styles.cardHeader}>
              <ThemedText type="defaultSemiBold">Today's Progress</ThemedText>
              <IconSymbol name="clock.fill" size={20} color="#0a7ea4" />
            </View>
            <ThemedText type="title" style={{marginTop: 10}}>
              1<ThemedText style={{fontSize: 16}}>/3 exercises</ThemedText>
            </ThemedText>
            <ProgressBar progress={0.33} color="#0a7ea4" />
          </InfoCard>

          <InfoCard>
            <View style={styles.cardHeader}>
              <ThemedText type="defaultSemiBold">Weekly Streak</ThemedText>
              <IconSymbol name="checkmark.circle.fill" size={20} color="green" />
            </View>
            <ThemedText type="title" style={{marginTop: 10}}>
              5 <ThemedText style={{fontSize: 16}}>days</ThemedText>
            </ThemedText>
            <ThemedText style={{color: 'green', marginTop: 10}}>Keep it up! 🔥</ThemedText>
          </InfoCard>

          <InfoCard>
            <View style={styles.cardHeader}>
              <ThemedText type="defaultSemiBold">Overall Completion</ThemedText>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="purple" />
            </View>
            <ThemedText type="title" style={{marginTop: 10}}>78%</ThemedText>
            <ProgressBar progress={0.78} color="purple" />
          </InfoCard>
        </View>

        {/* 3. ACTION ROW */}
        <View style={styles.actionRow}>
          <ActionCard 
            icon="message.fill" 
            title="Ask AI Assistant" 
            subtitle="Get help with exercises, technique, or recovery questions" 
            iconBg="#e3f2fd"
            iconColor="#2196f3"
          />
          <ActionCard 
            icon="chart.line.uptrend.xyaxis" 
            title="View Progress" 
            subtitle="Track your improvement and exercise history" 
            iconBg="#f3e5f5"
            iconColor="#9c27b0"
          />
        </View>

        {/* 4. EXERCISE PLAN SECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Today's Exercise Plan</ThemedText>
            <ThemedText style={{color: '#687076'}}>Prescribed by Dr. Smith</ThemedText>
          </View>
          
          <View style={styles.listCard}>
            {/* Exercise 1: Completed */}
            <ExerciseRow 
              isCompleted={true}
              number={1}
              title="Shoulder Flexion"
              subtitle="Raise arm forward to shoulder height"
              meta="3 sets × 10 reps"
              tag="Shoulder"
            />
            
            <View style={styles.divider} />

            {/* Exercise 2: Pending */}
            <ExerciseRow 
              isCompleted={false}
              number={2}
              title="Knee Extension"
              subtitle="Straighten knee while seated"
              meta="2 sets × 15 reps"
              tag="Knee"
            />

            <View style={styles.divider} />

            {/* Exercise 3: Pending */}
            <ExerciseRow 
              isCompleted={false}
              number={3}
              title="Wall Push-ups"
              subtitle="Modified push-up against wall"
              meta="2 sets × 12 reps"
              tag="Upper Body"
            />
          </View>
        </View>

        {/* 5. FOOTER CARD */}
        <View style={styles.footerCard}>
          <View>
            <ThemedText type="defaultSemiBold">Share Progress with Dr. Smith</ThemedText>
            <ThemedText style={{fontSize: 14, color: '#687076'}}>Send your latest exercise videos and progress report</ThemedText>
          </View>
          <TouchableOpacity style={styles.outlineButton}>
            <ThemedText style={{fontSize: 14, fontWeight: '600'}}>Send Update</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

// --- HELPER COMPONENTS ---

function InfoCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function ProgressBar({ progress, color }: { progress: number, color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

function ActionCard({ icon, title, subtitle, iconBg, iconColor }: any) {
  return (
    <View style={[styles.card, styles.actionCard]}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <IconSymbol name={icon} size={24} color={iconColor} />
      </View>
      <View style={{flex: 1}}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={{fontSize: 14, color: 'gray'}}>{subtitle}</ThemedText>
      </View>
    </View>
  );
}

function ExerciseRow({ isCompleted, number, title, subtitle, meta, tag }: any) {
  return (
    <View style={styles.exerciseRow}>
      {/* Icon Column */}
      <View style={styles.iconColumn}>
        {isCompleted ? (
          <View style={[styles.circle, { backgroundColor: '#dcfce7' }]}>
             <IconSymbol name="checkmark.circle.fill" size={24} color="#16a34a" />
          </View>
        ) : (
          <View style={[styles.circle, { backgroundColor: '#f3f4f6' }]}>
            <ThemedText style={{color: '#6b7280', fontWeight: 'bold'}}>{number}</ThemedText>
          </View>
        )}
      </View>

      {/* Content Column */}
      <View style={styles.contentColumn}>
        <View style={styles.titleRow}>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <ThemedText style={styles.completedText}>Completed</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        
        <View style={styles.metaRow}>
          <ThemedText style={styles.metaText}>{meta}</ThemedText>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>{tag}</ThemedText>
          </View>
        </View>
      </View>

      {/* Button Column */}
      <View style={styles.buttonColumn}>
        {isCompleted ? (
           <TouchableOpacity style={styles.reviewButton}>
             <IconSymbol name="play.fill" size={14} color="#000" />
             <ThemedText style={styles.reviewButtonText}>Review</ThemedText>
           </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startButton}>
            <IconSymbol name="play.fill" size={14} color="#fff" />
            <ThemedText style={styles.startButtonText}>Start</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileBadge: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#000', 
    fontWeight: 'bold'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 15,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    minWidth: '45%',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  exerciseRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  iconColumn: {
    paddingTop: 2,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentColumn: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  completedBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#4b5563',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  buttonColumn: {
    justifyContent: 'center',
    paddingTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  reviewButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  reviewButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
});