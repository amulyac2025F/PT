import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

// --- DATA: ALL EXERCISE DETAILS HERE ---
const EXERCISE_DATA: any = {
  shoulder: {
    title: "Shoulder Flexion",
    category: "Shoulder",
    sets: 3,
    reps: 10,
    instructions: "Stand upright with feet shoulder-width apart. Slowly raise your arm forward to shoulder height, keeping your elbow straight. Hold for 2 seconds, then lower slowly. Keep your core engaged throughout."
  },
  knee: {
    title: "Knee Extension",
    category: "Knee",
    sets: 2,
    reps: 15,
    instructions: "Sit in a chair with your back straight. Slowly extend your knee to a straight position. Hold for 3 seconds at the top, then lower your foot back down slowly. Keep your thigh on the chair."
  },
  wall: {
    title: "Wall Push-ups",
    category: "Upper Body",
    sets: 2,
    reps: 12,
    instructions: "Stand arm's length from a wall. Place your hands flat on the wall at shoulder height. Bend your elbows to bring your chest toward the wall, then push back to start. Keep your body straight."
  }
};

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get the ID passed from Home
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  // Load data based on ID, fallback to 'shoulder' if missing
  const exercise = EXERCISE_DATA[id as string] || EXERCISE_DATA['shoulder'];
  const { sets: TOTAL_SETS, reps: REPS_PER_SET } = exercise;

  // --- CAMERA PERMISSIONS ---
  const [permission, requestPermission] = useCameraPermissions();

  // --- STATE ---
  const [isStarted, setIsStarted] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);

  // Reset state if the exercise ID changes
  useEffect(() => {
    setIsStarted(false);
    setCurrentSet(1);
    setCurrentRep(0);
  }, [id]);

  // Calculate Progress
  const totalRepsDone = ((currentSet - 1) * REPS_PER_SET) + currentRep;
  const totalRepsGoal = TOTAL_SETS * REPS_PER_SET;
  const progressPercent = Math.min(Math.round((totalRepsDone / totalRepsGoal) * 100), 100);

  // --- RENDER HELPERS ---
  const renderCameraContent = () => {
    if (!permission) return <View style={styles.loadingContainer} />;
    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <ThemedText style={{ textAlign: 'center', marginBottom: 10, color: '#94a3b8' }}>
            We need your permission to show the camera
          </ThemedText>
          <Button onPress={requestPermission} title="Grant Permission" color="#0f172a" />
        </View>
      );
    }
    return (
      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} facing="front">
          <View style={styles.cameraOverlay}>
             {isStarted && (
               <View style={styles.recordingIndicator}>
                 <View style={styles.recordingDot} />
                 <Text style={{color: 'white', fontWeight: 'bold'}}>Live Analysis</Text>
               </View>
             )}
          </View>
        </CameraView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* HEADER: Dynamic Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={24} color="#000" />
        </TouchableOpacity>
        <View>
          <ThemedText type="defaultSemiBold" style={{fontSize: 18}}>{exercise.title}</ThemedText>
          <ThemedText style={styles.subHeader}>{exercise.category}</ThemedText>
        </View>
        <View style={styles.setBadge}>
          <ThemedText style={styles.setBadgeText}>{TOTAL_SETS} sets × {REPS_PER_SET} reps</ThemedText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TOP ROW */}
        <View style={[styles.sectionContainer, isWide && styles.rowContainer]}>
          <View style={[styles.cameraContainer, isWide && { flex: 2, marginRight: 20, marginBottom: 0 }]}>
            {renderCameraContent()}
          </View>

          <View style={[styles.card, isWide && { flex: 1 }]}>
            <View style={styles.progressHeader}>
              <ThemedText style={{fontSize: 14, color: '#64748b'}}>Progress</ThemedText>
              <ThemedText style={{fontSize: 14, fontWeight: 'bold'}}>{progressPercent}%</ThemedText>
            </View>
            <View style={styles.progressBarBg}>
               <View style={{ width: `${progressPercent}%`, backgroundColor: '#0f172a', height: '100%', borderRadius: 4 }} />
            </View>

            <View style={styles.counterStack}>
              <View style={styles.counterItem}>
                <ThemedText style={styles.counterLabel}>Current Set</ThemedText>
                <ThemedText style={styles.counterValue}>{currentSet} / {TOTAL_SETS}</ThemedText>
              </View>
              <View style={styles.counterItem}>
                <ThemedText style={styles.counterLabel}>Current Rep</ThemedText>
                <ThemedText style={styles.counterValue}>{currentRep} / {REPS_PER_SET}</ThemedText>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isStarted && { backgroundColor: '#be123c' }]} 
              onPress={() => setIsStarted(!isStarted)}
            >
              <IconSymbol name={isStarted ? "stop.fill" : "play.fill"} size={16} color="#fff" />
              <ThemedText style={styles.primaryButtonText}>
                {isStarted ? "Stop Camera" : "Start Camera"}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setIsStarted(false); setCurrentSet(1); setCurrentRep(0); }}>
              <IconSymbol name="arrow.counterclockwise" size={16} color="#000" />
              <ThemedText style={styles.secondaryButtonText}>Reset</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTTOM ROW: Dynamic Instructions */}
        <View style={[styles.sectionContainer, isWide && styles.rowContainer]}>
          <View style={[styles.leftColumn, isWide && { flex: 2, marginRight: 20 }]}>
            <View style={styles.cardNoBorder}>
                <ThemedText type="defaultSemiBold" style={{marginBottom: 12}}>Instructions</ThemedText>
                <ThemedText style={styles.instructionText}>
                  {exercise.instructions}
                </ThemedText>

                <View style={styles.tipBox}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8}}>
                    <IconSymbol name="info.circle.fill" size={16} color="#2563eb" />
                    <ThemedText style={styles.tipTitle}>Tips for Best Results</ThemedText>
                  </View>
                  <View style={styles.bulletPoint}><TextBullet /><ThemedText style={styles.tipText}>Maintain steady breathing throughout</ThemedText></View>
                  <View style={styles.bulletPoint}><TextBullet /><ThemedText style={styles.tipText}>Focus on controlled movements, not speed</ThemedText></View>
                  <View style={styles.bulletPoint}><TextBullet /><ThemedText style={styles.tipText}>Stop if you feel sharp pain</ThemedText></View>
                  <View style={styles.bulletPoint}><TextBullet /><ThemedText style={styles.tipText}>Position yourself fully in camera view</ThemedText></View>
                </View>
            </View>
          </View>

          <View style={[styles.rightColumn, isWide && { flex: 1 }]}>
            <View style={styles.card}>
               <ThemedText type="defaultSemiBold" style={{marginBottom: 16}}>Today's Performance</ThemedText>
               <View style={styles.statRow}>
                 <ThemedText style={styles.statLabel}>Form Accuracy</ThemedText>
                 <ThemedText style={[styles.statValue, {color: '#16a34a'}]}>94%</ThemedText>
               </View>
               <View style={styles.divider} />
               <View style={styles.statRow}>
                 <ThemedText style={styles.statLabel}>Completed Reps</ThemedText>
                 <ThemedText style={styles.statValue}>45</ThemedText>
               </View>
               <View style={styles.divider} />
               <View style={styles.statRow}>
                 <ThemedText style={styles.statLabel}>Session Time</ThemedText>
                 <ThemedText style={styles.statValue}>12m 34s</ThemedText>
               </View>
            </View>
            <TouchableOpacity style={styles.outlineFooterButton}>
                <IconSymbol name="video.circle" size={20} color="#000" />
                <ThemedText style={{fontWeight: '600'}}>Send Video to Doctor</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const TextBullet = () => <View style={{width: 4, height: 4, borderRadius: 2, backgroundColor: '#2563eb', marginTop: 8, marginRight: 8}} />

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { padding: 8, marginRight: 8 },
  subHeader: { color: '#64748b', fontSize: 13 },
  setBadge: { marginLeft: 'auto', backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  setBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  scrollContent: { padding: 20 },
  sectionContainer: { marginBottom: 20 },
  rowContainer: { flexDirection: 'row', alignItems: 'stretch' },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1 },

  // Camera Styles
  cameraContainer: { backgroundColor: '#000', height: 450, borderRadius: 12, overflow: 'hidden', marginBottom: 20, width: '100%' },
  cameraWrapper: { flex: 1, width: '100%', height: '100%' }, 
  camera: { flex: 1 }, 
  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: 20 },
  loadingContainer: { flex: 1, backgroundColor: '#000' },
  
  cameraOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 16 },
  recordingIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 6 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },

  // Cards
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 20, marginBottom: 20 },
  cardNoBorder: { marginBottom: 20 },
  
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBarBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, marginBottom: 20 },
  counterStack: { gap: 12, marginBottom: 20 },
  counterItem: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counterLabel: { color: '#64748b', fontSize: 14 },
  counterValue: { fontWeight: 'bold', fontSize: 16 },
  
  primaryButton: { backgroundColor: '#0f172a', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 8, gap: 8, marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 8, gap: 8 },
  secondaryButtonText: { color: '#0f172a', fontWeight: '600' },

  instructionText: { color: '#334155', lineHeight: 24, fontSize: 15, marginBottom: 24 },
  tipBox: { backgroundColor: '#eff6ff', padding: 20, borderRadius: 12 },
  tipTitle: { color: '#2563eb', fontWeight: '600', fontSize: 15 },
  tipText: { color: '#1e40af', fontSize: 14, lineHeight: 22 },
  bulletPoint: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  statLabel: { color: '#64748b', fontSize: 14 },
  statValue: { fontWeight: '600', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#f1f5f9' },
  outlineFooterButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 10 },
});