// app/index.tsx
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LandingPage() {
  return (
    <LinearGradient
      colors={['#2563eb', '#1e40af']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.pill}>
            <IconSymbol name="waveform.path.ecg" size={20} color="#fff" />
            <ThemedText style={styles.pillText}>AI-Powered Physical Therapy</ThemedText>
          </View>
        </View>

        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Your Recovery Journey, Powered by AI
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Professional physical therapy guidance, real-time form feedback, and personalized exercise plans—all in one platform.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          {/* Link to Sign Up Modal */}
          <Link href="/signup" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <ThemedText style={styles.primaryButtonText}>Get Started</ThemedText>
              <IconSymbol name="arrow.right" size={20} color="#2563eb" style={{marginLeft: 8}}/>
            </TouchableOpacity>
          </Link>

          {/* Link to Sign In Modal */}
          <Link href="/signin" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>Sign In</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
        
         {/* TEMPORARY: backdoor to get to tabs while developing */}
         <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{marginTop: 20, alignSelf: 'center'}}>
            <ThemedText style={{color: 'rgba(255,255,255,0.5)'}}>(Dev: Skip to App)</ThemedText>
         </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 8,
  },
  pillText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 26,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});