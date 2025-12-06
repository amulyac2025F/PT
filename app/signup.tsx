// app/signup.tsx
import { StyledInput } from '@/components/styled-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');

  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="xmark" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={{marginBottom: 8, color: '#000'}}>Get Started</ThemedText>
        <ThemedText style={{marginBottom: 24, color: 'gray'}}>Create your account to begin your recovery</ThemedText>

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
        
        {/* Form Fields */}
        <ThemedText type="defaultSemiBold" style={styles.label}>Full Name</ThemedText>
        <StyledInput icon="person" placeholder="John Doe" />

        <ThemedText type="defaultSemiBold" style={styles.label}>Email</ThemedText>
        <StyledInput icon="envelope" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />

        <ThemedText type="defaultSemiBold" style={styles.label}>Password</ThemedText>
        <StyledInput icon="lock" placeholder="••••••••" secureTextEntry />

        <TouchableOpacity style={styles.submitBtn}>
          <ThemedText style={styles.submitBtnText}>Create Account</ThemedText>
        </TouchableOpacity>

         <View style={styles.footer}>
          <ThemedText style={{color: 'gray'}}>Already have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/signin')}>
            <ThemedText type="defaultSemiBold" style={{color: '#2563eb'}}>Sign in</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  label: {
    marginBottom: 8,
    color: '#000'
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  toggleBtnActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  toggleTextInactive: {
    color: 'gray',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});