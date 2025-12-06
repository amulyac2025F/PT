import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Patient = {
  id: string;
  name: string;
  email: string;
  exercises: string[];
};

const SAMPLE: Patient[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', exercises: ['Shoulder Flexion (3×10)', 'Knee Extension (2×15)'] },
  { id: '2', name: 'Michael Chen', email: 'mchen@email.com', exercises: ['Hip Abduction (3×12)'] },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@email.com', exercises: [] },
];

export default function PatientsList() {
  const [query, setQuery] = useState('');
  const patients = SAMPLE;

  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query, patients]
  );

  function renderItem({ item }: { item: Patient }) {
    const initials = item.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.email}>{item.email}</ThemedText>

            <ThemedText style={styles.currentLabel}>Current Exercises:</ThemedText>
            <View style={styles.pillsRow}>
              {item.exercises.length > 0 ? (
                item.exercises.map((ex, i) => (
                  <View key={i} style={styles.pill}>
                    <ThemedText style={styles.pillText}>{ex}</ThemedText>
                  </View>
                ))
              ) : (
                <ThemedText style={styles.noExercises}>No exercises assigned</ThemedText>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineBtn}>
            <IconSymbol name="plus" size={14} color="#000" />
            <ThemedText style={styles.outlineBtnText}> {item.exercises.length ? 'Edit Plan' : 'Create Plan'}</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineBtn}>
            <ThemedText style={styles.outlineBtnText}>View Progress</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ThemedView>
      <View style={styles.headerRow}>
        <ThemedText type="title">My Patients</ThemedText>

        <View style={styles.headerActions}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search patients..."
            style={styles.search}
            placeholderTextColor="#8b8f96"
          />
          <TouchableOpacity style={styles.addBtn}>
            <IconSymbol name="person.bust" size={16} color="#fff" />
            <ThemedText style={styles.addBtnText}> Add Patient</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  search: {
    minWidth: 180,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    color: '#000',
  },
  addBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtnText: { color: '#fff' },
  row: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', flex: 1, gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#eef2f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: '700', color: '#1f2937' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    marginLeft: 8,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, color: '#374151' },
  email: { color: '#64748b', marginTop: 4 },
  currentLabel: { marginTop: 10, color: '#374151', fontSize: 13 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  pill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e9ee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: { fontSize: 12, color: '#111827' },
  noExercises: { color: '#6b7280', fontSize: 13, marginTop: 6 },
  actions: { justifyContent: 'center', alignItems: 'flex-end', gap: 10 },
  outlineBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e6e9ee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  outlineBtnText: { color: '#111827' },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 6 },
});