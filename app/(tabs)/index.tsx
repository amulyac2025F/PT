import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- CONFIG ---
// Replace placeholders with your actual Azure keys once you create the resource
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT ?? '<YOUR_AZURE_ENDPOINT>';
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY ?? '<YOUR_AZURE_KEY>';
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT ?? '<YOUR_DEPLOYMENT_NAME>';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const iconColor = Colors[colorScheme].icon;
  const [chatVisible, setChatVisible] = useState(false);

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
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
            subtitle="Get help with exercises or recovery" 
            iconBg="#e3f2fd"
            iconColor="#2196f3"
            onPress={() => setChatVisible(true)}
          />
          <ActionCard 
            icon="chart.line.uptrend.xyaxis" 
            title="View Progress" 
            subtitle="Track your exercise history" 
            iconBg="#f3e5f5"
            iconColor="#9c27b0"
          />
        </View>

        {/* 4. EXERCISE PLAN SECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Today's Exercise Plan</ThemedText>
            <Text style={styles.sectionSubtitle}>Prescribed by Dr. Smith</Text>
          </View>
          
          <View style={styles.listCard}>
            <ExerciseRow isCompleted={true} number={1} title="Shoulder Flexion" subtitle="Raise arm forward" meta="3 sets × 10 reps" tag="Shoulder" />
            <View style={styles.divider} />
            <ExerciseRow isCompleted={false} number={2} title="Knee Extension" subtitle="Straighten knee while seated" meta="2 sets × 15 reps" tag="Knee" />
            <View style={styles.divider} />
            <ExerciseRow isCompleted={false} number={3} title="Wall Push-ups" subtitle="Modified push-up" meta="2 sets × 12 reps" tag="Upper Body" />
          </View>
        </View>

        {/* 5. FOOTER CARD */}
        <View style={styles.footerCard}>
          <View>
            <ThemedText type="defaultSemiBold">Share Progress</ThemedText>
            <ThemedText style={{fontSize: 14, color: '#687076'}}>Send report to Dr. Smith</ThemedText>
          </View>
          <TouchableOpacity style={styles.outlineButton}>
            <ThemedText style={{fontSize: 14, fontWeight: '600'}}>Send Update</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 6. CHATBOT MODAL */}
      <ChatbotModal 
        visible={chatVisible} 
        onClose={() => setChatVisible(false)} 
      />
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

function ActionCard({ icon, title, subtitle, iconBg, iconColor, onPress }: any) {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} style={[styles.card, styles.actionCard]}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <IconSymbol name={icon} size={24} color={iconColor} />
      </View>
      <View style={{flex: 1}}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={{fontSize: 12, color: 'gray'}} numberOfLines={1}>{subtitle}</ThemedText>
      </View>
    </Wrapper>
  );
}

// --- CHATBOT MODAL ---
type Message = { id: string; role: 'user' | 'assistant'; content: string; timestamp: number; suggestions?: string[] };

function ChatbotModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'assistant', content: "Hi! I'm your AI assistant. How can I help?", timestamp: Date.now(),
    suggestions: ['Shoulder pain', 'Lower back tips', 'Recovery'],
  }]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2023-10-01-preview`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_KEY },
        body: JSON.stringify({ 
            messages: [{ role: 'system', content: 'You are a physio assistant.' }, ...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content }],
            max_tokens: 500 
        }),
      });
      const json = await res.json();
      const botText = json?.choices?.[0]?.message?.content || 'Service unavailable.';
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: botText, timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: 'Connection error. Check Azure keys.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.chatModalOverlay}>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={onClose} style={{ padding: 10 }}><Text style={{ fontSize: 20 }}>✕</Text></TouchableOpacity>
            <ThemedText type="defaultSemiBold" style={{ marginLeft: 10 }}>Physio AI</ThemedText>
          </View>
          <ScrollView style={styles.chatMessages} contentContainerStyle={{ paddingBottom: 20 }}>
            {messages.map((m) => (
              <View key={m.id} style={{ marginBottom: 15, alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <View style={[m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={{ color: m.role === 'user' ? '#fff' : '#111827' }}>{m.content}</Text>
                </View>
                {m.suggestions?.map(s => (
                  <TouchableOpacity key={s} style={styles.suggestionBtn} onPress={() => handleSend(s)}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            {loading && <ActivityIndicator size="small" color="#0a7ea4" />}
          </ScrollView>
          <View style={styles.chatInputRow}>
            <TextInput value={inputValue} onChangeText={setInputValue} placeholder="Type here..." style={styles.chatInput} />
            <TouchableOpacity style={styles.sendButton} onPress={() => handleSend(inputValue)}><Text style={{ color: '#fff' }}>Send</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ExerciseRow({ isCompleted, number, title, subtitle, meta, tag }: any) {
    return (
      <View style={styles.exerciseRow}>
        <View style={styles.iconColumn}>
          {isCompleted ? (
            <View style={[styles.circle, { backgroundColor: '#dcfce7' }]}><IconSymbol name="checkmark.circle.fill" size={24} color="#16a34a" /></View>
          ) : (
            <View style={[styles.circle, { backgroundColor: '#f3f4f6' }]}><ThemedText style={{color: '#6b7280', fontWeight: 'bold'}}>{number}</ThemedText></View>
          )}
        </View>
        <View style={styles.contentColumn}>
          <View style={styles.titleRow}>
            <ThemedText type="defaultSemiBold">{title}</ThemedText>
            {isCompleted && <View style={styles.completedBadge}><ThemedText style={styles.completedText}>Completed</ThemedText></View>}
          </View>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          <View style={styles.metaRow}>
            <ThemedText style={styles.metaText}>{meta}</ThemedText>
            <View style={styles.tag}><ThemedText style={styles.tagText}>{tag}</ThemedText></View>
          </View>
        </View>
        <TouchableOpacity style={isCompleted ? styles.reviewButton : styles.startButton}>
            <Text style={{ color: isCompleted ? '#000' : '#fff', fontWeight: 'bold' }}>{isCompleted ? 'Review' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  profileBadge: { width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  profileInitials: { fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', padding: 5, borderRadius: 8 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 50 },
  statsContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#f0f0f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTrack: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 15 },
  progressFill: { height: '100%', borderRadius: 4 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sectionContainer: { marginTop: 10, marginBottom: 20 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionSubtitle: { fontSize: 13, color: '#687076' },
  listCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0', overflow: 'hidden' },
  exerciseRow: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },
  iconColumn: { width: 32 },
  circle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  contentColumn: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  completedBadge: { backgroundColor: '#e5e7eb', paddingHorizontal: 6, borderRadius: 4 },
  completedText: { fontSize: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#6b7280' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 12, color: '#4b5563' },
  tag: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, borderRadius: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  tagText: { fontSize: 10 },
  startButton: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  reviewButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  footerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  outlineButton: { borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  
  // CHAT STYLES
  chatModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  chatContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '85%' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chatMessages: { flex: 1, padding: 15 },
  userBubble: { backgroundColor: '#0a7ea4', padding: 12, borderRadius: 15, alignSelf: 'flex-end', maxWidth: '80%' },
  assistantBubble: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 15, alignSelf: 'flex-start', maxWidth: '80%' },
  chatInputRow: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  sendButton: { backgroundColor: '#0a7ea4', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  suggestionBtn: { marginTop: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0a7ea4', padding: 8, borderRadius: 15, alignSelf: 'flex-start' },
  suggestionText: { color: '#0a7ea4', fontSize: 12 }
});