// app/signin.tsx
import { StyledInput } from '@/components/styled-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');

  const handleSignIn = () => {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.modalContainer}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="xmark" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <ThemedText type="title" style={{marginBottom: 8, color: '#000'}}>Welcome Back</ThemedText>
        <ThemedText style={{marginBottom: 24, color: 'gray'}}>Sign in to continue your recovery journey</ThemedText>

         {/* User Type Selector */}
        <ThemedText type="defaultSemiBold" style={styles.label}>I am a...</ThemedText>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, userType === 'patient' && styles.toggleBtnActive]}
            onPress={() => setUserType('patient')}
          >
             <ThemedText style={userType === 'patient' ? styles.toggleTextActive : styles.toggleTextInactive}>Patient</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, userType === 'doctor' && styles.toggleBtnActive]}
            onPress={() => setUserType('doctor')}
          >
             <ThemedText style={userType === 'doctor' ? styles.toggleTextActive : styles.toggleTextInactive}>Doctor/PT</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.label}>Email</ThemedText>
        <StyledInput icon="envelope" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />

        <ThemedText type="defaultSemiBold" style={styles.label}>Password</ThemedText>
        <StyledInput icon="lock" placeholder="••••••••" secureTextEntry />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSignIn}>
          <ThemedText style={styles.submitBtnText}>Sign In</ThemedText>
        </TouchableOpacity>

         <View style={styles.footer}>
          <ThemedText style={{color: 'gray'}}>Don't have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/signup')}>
            <ThemedText type="defaultSemiBold" style={{color: '#2563eb'}}>Sign up</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Reuse the styles from signup.tsx or put them in a shared file
const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, alignItems: 'flex-end' },
  content: { padding: 24, paddingTop: 0 },
  label: { marginBottom: 8, color: '#000' },
  toggleContainer: { flexDirection: 'row', marginBottom: 24, gap: 12 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  toggleBtnActive: { backgroundColor: '#eff6ff', borderColor: '#2563eb' },
  toggleTextInactive: { color: 'gray', fontWeight: '600' },
  toggleTextActive: { color: '#2563eb', fontWeight: '600' },
  submitBtn: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});