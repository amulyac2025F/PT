import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PatientProgress } from './PatientProgress';

type Patient = { id: string; name: string; email: string; exercises: string[] };

const SAMPLE: Patient[] = [
  { id: '1', name: 'John Smith', email: 'smithjohn23@gmail.com', exercises: ['Shoulder Flexion (3×10)', 'Knee Extension (2×15)'] },
  { id: '2', name: 'Micheal Scott', email: 'theoffice@email.com', exercises: ['Hip Abduction (3×12)'] },
  { id: '3', name: 'Taylor Johnson', email: 'taylor@email.com', exercises: [] },
];

// Color system
const colorPalette = {
  primary: '#0a7ea4',
  secondary: '#00d4ff',
  success: '#22c55e',
  danger: '#ef4444',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  background: '#f9fafb',
  surface: '#ffffff',
  shadowColor: '#00000015',
};

export default function DoctorDashboard() {
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(() => SAMPLE);
  const [addPatientModalVisible, setAddPatientModalVisible] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({ name: '', email: '', patientId: '' });
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  const openAddPatient = () => {
    setNewPatientForm({ name: '', email: '', patientId: '' });
    setAddPatientModalVisible(true);
  };

  const closeAddPatient = () => setAddPatientModalVisible(false);

  const handleAddPatient = () => {
    if (!newPatientForm.name.trim() || !newPatientForm.email.trim() || !newPatientForm.patientId.trim()) {
      return;
    }
    const newP: Patient = {
      id: Date.now().toString(),
      name: newPatientForm.name.trim(),
      email: newPatientForm.email.trim(),
      exercises: [],
    };
    setPatients((prev) => [newP, ...prev]);
    closeAddPatient();
  };

  const handleSavePlan = (exercises: string[]) => {
    if (!selectedPatient) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id ? { ...p, exercises } : p
      )
    );
    setPlanModalVisible(false);
    setSelectedPatient(null);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colorPalette.background }]}>
      {/* Premium Header */}
      <View style={[styles.header, { backgroundColor: colorPalette.surface, borderBottomColor: colorPalette.border }]}>
        <View>
          <ThemedText type="title" style={styles.headerTitle}>Doctor Portal</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Manage your patients effectively</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: '#e0f2fe', borderColor: colorPalette.primary, borderWidth: 2 }]}>
              <ThemedText style={[styles.avatarText, { color: colorPalette.primary }]}>DR</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.doctorName}>Dr. Smith</ThemedText>
              <ThemedText style={styles.doctorRole}>Senior PT</ThemedText>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.replace('/signin')} style={[styles.logoutBtn, { backgroundColor: '#fee2e2', borderColor: colorPalette.danger, borderWidth: 1 }]}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={16} color={colorPalette.danger} />
            <ThemedText style={[styles.logoutText, { color: colorPalette.danger }]}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Premium Stats Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          {[
            { label: 'Total Patients', value: patients.length.toString(), icon: '👥', color: '#dbeafe', lightColor: '#e0f2fe' },
            { label: 'Active Plans', value: patients.filter((p) => p.exercises.length > 0).length.toString(), icon: '📋', color: '#dcfce7', lightColor: '#f0fdf4' },
            { label: 'Pending Reviews', value: '5', icon: '⏰', color: '#fed7aa', lightColor: '#fffbeb' },
            { label: 'Completion Rate', value: '87%', icon: '📊', color: '#e9d5ff', lightColor: '#faf5ff' },
          ].map((stat, idx) => (
            <View key={idx} style={[styles.statCard, { backgroundColor: colorPalette.surface }]}>
              <View style={[styles.statIconBox, { backgroundColor: stat.lightColor }]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
              </View>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {stat.value}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <PatientsListInline
            patients={patients}
            onAdd={openAddPatient}
            onEdit={(p) => {
              setSelectedPatient(p);
              setPlanModalVisible(true);
            }}
            onViewProgress={(p) => setViewingPatient(p)}
          />
        </View>

        <CreateExercisePlanModal
          patient={selectedPatient}
          visible={planModalVisible}
          onClose={() => setPlanModalVisible(false)}
          onSave={handleSavePlan}
        />
      </ScrollView>

      {/* Add Patient Modal */}
      <Modal visible={addPatientModalVisible} animationType="slide" onRequestClose={closeAddPatient} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Patient</Text>
                <Text style={styles.modalSubtitle}>Create a new patient profile</Text>
              </View>
              <Pressable onPress={closeAddPatient} style={[styles.closeBtn, { backgroundColor: '#f3f4f6' }]}>
                <IconSymbol name="xmark" size={18} color={colorPalette.text} />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Full Name</ThemedText>
                <TextInput
                  placeholder="Enter patient name"
                  value={newPatientForm.name}
                  onChangeText={(v) => setNewPatientForm((s) => ({ ...s, name: v }))}
                  style={[styles.input, { backgroundColor: colorPalette.background, borderColor: colorPalette.border }]}
                  placeholderTextColor={colorPalette.textSecondary}
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Email Address</ThemedText>
                <TextInput
                  placeholder="patient@example.com"
                  value={newPatientForm.email}
                  onChangeText={(v) => setNewPatientForm((s) => ({ ...s, email: v }))}
                  style={[styles.input, { backgroundColor: colorPalette.background, borderColor: colorPalette.border }]}
                  keyboardType="email-address"
                  placeholderTextColor={colorPalette.textSecondary}
                />
              </View>
              <View style={styles.formGroup}>
                <ThemedText style={styles.formLabel}>Patient ID</ThemedText>
                <TextInput
                  placeholder="P-001234"
                  value={newPatientForm.patientId}
                  onChangeText={(v) => setNewPatientForm((s) => ({ ...s, patientId: v }))}
                  style={[styles.input, { backgroundColor: colorPalette.background, borderColor: colorPalette.border }]}
                  placeholderTextColor={colorPalette.textSecondary}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colorPalette.background, borderColor: colorPalette.border }]} onPress={closeAddPatient}>
                <ThemedText style={[styles.secondaryBtnText, { color: colorPalette.text }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colorPalette.primary }]} onPress={handleAddPatient}>
                <ThemedText style={styles.primaryBtnText}>Add Patient</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {viewingPatient ? (
        <Modal visible={!!viewingPatient} animationType="slide" onRequestClose={() => setViewingPatient(null)} transparent={false}>
          <PatientProgress patientName={viewingPatient.name} onBack={() => setViewingPatient(null)} />
        </Modal>
      ) : null}
    </ThemedView>
  );
}

function CreateExercisePlanModal({ patient, visible, onClose, onSave }: { patient: Patient | null; visible: boolean; onClose: () => void; onSave: (exercises: string[]) => void }) {
  type Exercise = { id: string; name: string; description?: string; reps: number; sets: number; category: string };
  const exerciseLibrary: Exercise[] = [
    { id: 'e1', name: 'Shoulder Flexion', description: 'Raise arm forward', reps: 10, sets: 3, category: 'Shoulder' },
    { id: 'e2', name: 'Shoulder Abduction', description: 'Raise arm sideways', reps: 10, sets: 3, category: 'Shoulder' },
    { id: 'e3', name: 'Shoulder External Rotation', description: 'Rotate shoulder outward', reps: 12, sets: 2, category: 'Shoulder' },
    { id: 'e4', name: 'Knee Extension', description: 'Straighten knee', reps: 15, sets: 2, category: 'Knee' },
    { id: 'e5', name: 'Hip Abduction', description: 'Move leg outward', reps: 12, sets: 3, category: 'Hip' },
    { id: 'e6', name: 'Ankle Circles', description: 'Rotate ankle', reps: 10, sets: 2, category: 'Ankle' },
  ];

  const categories = ['All', ...Array.from(new Set(exerciseLibrary.map((e) => e.category)))];
  const [selected, setSelected] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [selCategory, setSelCategory] = useState<string>('All');

  const filtered = exerciseLibrary.filter((e) => {
    const matchesSearch = (e.name + ' ' + (e.description ?? '') + ' ' + e.category).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selCategory === 'All' || e.category === selCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSelect = (exercise: Exercise) => {
    const exists = selected.find((s) => s.id === exercise.id);
    if (exists) setSelected((s) => s.filter((x) => x.id !== exercise.id));
    else setSelected((s) => [...s, { ...exercise }]);
  };

  const removeExercise = (id: string) => setSelected((s) => s.filter((x) => x.id !== id));

  const updateField = (id: string, field: 'sets' | 'reps', valueStr: string) =>
    setSelected((s) => s.map((ex) => (ex.id === id ? { ...ex, [field]: parseInt(valueStr, 10) || 0 } : ex)));

  const handleSave = () => {
    const exerciseStrings = selected.map((ex) => `${ex.name} (${ex.sets}×${ex.reps})`);
    onSave(exerciseStrings);
    setSelected([]);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.planModal, { backgroundColor: colorPalette.surface }]}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Create Exercise Plan</Text>
              <Text style={styles.modalSubtitle}>For {patient?.name}</Text>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: '#f3f4f6' }]}>
              <IconSymbol name="xmark" size={18} color={colorPalette.text} />
            </Pressable>
          </View>
          <View style={styles.twoColumnContainer}>
            <View style={styles.leftColumn}>
              <TextInput placeholder="Search exercises..." value={search} onChangeText={setSearch} style={[styles.input, { backgroundColor: colorPalette.background }]} placeholderTextColor={colorPalette.textSecondary} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12 }}>
                {categories.map((c) => (
                  <TouchableOpacity key={c} style={[styles.categoryBtn, selCategory === c && { backgroundColor: colorPalette.primary, borderColor: colorPalette.primary }]} onPress={() => setSelCategory(c)}>
                    <Text style={{ color: selCategory === c ? '#fff' : colorPalette.text, fontWeight: '500' }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <ScrollView style={{ flex: 1 }}>
                {filtered.map((ex) => {
                  const isSelected = selected.some((s) => s.id === ex.id);
                  return (
                    <TouchableOpacity key={ex.id} onPress={() => toggleSelect(ex)} style={[styles.exerciseItem, isSelected && { backgroundColor: '#f0f9ff', borderColor: colorPalette.primary, borderWidth: 2 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.exerciseName, { color: colorPalette.text }]}>{ex.name}</Text>
                        {ex.description && <Text style={[styles.exerciseDesc, { color: colorPalette.textSecondary }]}>{ex.description}</Text>}
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                          <Text style={[styles.exerciseInfo, { color: colorPalette.textSecondary }]}>{ex.sets} sets</Text>
                          <Text style={[styles.exerciseInfo, { color: colorPalette.textSecondary, marginHorizontal: 6 }]}>•</Text>
                          <Text style={[styles.exerciseInfo, { color: colorPalette.textSecondary }]}>{ex.reps} reps</Text>
                        </View>
                      </View>
                      <View style={[styles.categoryBadge, { backgroundColor: colorPalette.background }]}>
                        <Text style={{ fontSize: 11, color: colorPalette.textSecondary, fontWeight: '600' }}>{ex.category}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            <View style={[styles.rightColumn, { borderLeftColor: colorPalette.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={[styles.planTitle, { color: colorPalette.text }]}>Selected Exercises</Text>
                <View style={[styles.selectedCount, { backgroundColor: colorPalette.primary }]}>
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>{selected.length}</Text>
                </View>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {selected.length === 0 ? (
                  <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ color: colorPalette.textSecondary, fontSize: 13 }}>Select exercises from the left</Text>
                  </View>
                ) : (
                  selected.map((ex, idx) => (
                    <View key={ex.id} style={[styles.selectedItem, { backgroundColor: colorPalette.background, borderColor: colorPalette.border }]}>
                      <View style={[styles.numberBadge, { backgroundColor: colorPalette.primary }]}>
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{idx + 1}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{ fontWeight: '600', color: colorPalette.text }}>{ex.name}</Text>
                        <Text style={{ fontSize: 11, color: colorPalette.textSecondary, marginTop: 4 }}>{ex.category}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeExercise(ex.id)}>
                        <Text style={{ fontSize: 18, color: colorPalette.danger }}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
              <View style={{ gap: 10, marginTop: 12 }}>
                <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colorPalette.primary }]} onPress={handleSave}>
                  <ThemedText style={styles.primaryBtnText}>✓ Save & Assign</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: colorPalette.background, borderColor: colorPalette.border, borderWidth: 1 }]} onPress={onClose}>
                  <ThemedText style={[styles.secondaryBtnText, { color: colorPalette.text }]}>Close</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function PatientsListInline({ onEdit, patients, onAdd, onViewProgress }: { onEdit: (p: Patient) => void; patients: Patient[]; onAdd: () => void; onViewProgress?: (p: Patient) => void }) {
  const [query, setQuery] = useState('');
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
      <View style={[styles.patientCard, { backgroundColor: colorPalette.surface }]}>
        <View style={styles.patientLeft}>
          <View style={[styles.patientAvatar, { backgroundColor: '#dbeafe', borderColor: colorPalette.primary, borderWidth: 2 }]}>
            <ThemedText style={[styles.patientInitials, { color: colorPalette.primary }]}>{initials}</ThemedText>
          </View>
          <View style={styles.patientInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ThemedText type="defaultSemiBold" style={{ color: colorPalette.text, fontSize: 15 }}>
                {item.name}
              </ThemedText>
              <View style={[styles.exerciseContainer, { backgroundColor: '#f0fdf4' }]}>
                <ThemedText style={[styles.exerciseBadgeText, { color: colorPalette.success }]}>
                  {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={{ color: colorPalette.textSecondary, marginTop: 4, fontSize: 13 }}>{item.email}</ThemedText>
            <View style={{ marginTop: 10 }}>
              <ThemedText style={{ color: colorPalette.textSecondary, fontSize: 12, fontWeight: '600' }}>Current Exercises:</ThemedText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 6 }}>
                {item.exercises.length > 0 ? (
                  item.exercises.map((ex, i) => (
                    <View key={i} style={[styles.exercisePill, { backgroundColor: colorPalette.background, borderColor: colorPalette.border }]}>
                      <ThemedText style={{ fontSize: 11, color: colorPalette.text }}>{ex}</ThemedText>
                    </View>
                  ))
                ) : (
                  <ThemedText style={{ color: colorPalette.textSecondary, fontSize: 12, fontStyle: 'italic' }}>No exercises assigned</ThemedText>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.patientActions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f0f9ff', borderColor: colorPalette.primary, borderWidth: 1 }]} onPress={() => onEdit(item)}>
            <IconSymbol name="plus" size={14} color={colorPalette.primary} />
            <ThemedText style={[styles.actionBtnText, { color: colorPalette.primary }]}>
              {item.exercises.length ? 'Edit' : 'Create'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colorPalette.primary }]} onPress={() => onViewProgress && onViewProgress(item)}>
            <IconSymbol name="chart.bar" size={14} color="#fff" />
            <ThemedText style={[styles.actionBtnText, { color: '#fff' }]}>View</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <ThemedText type="title" style={{ color: colorPalette.text, marginBottom: 12 }}>
          Your Patients
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search patients..."
            style={[styles.input, { flex: 1, backgroundColor: colorPalette.background, borderColor: colorPalette.border }]}
            placeholderTextColor={colorPalette.textSecondary}
          />
          <TouchableOpacity 
            style={[styles.addPatientBtn, { backgroundColor: colorPalette.primary }]} 
            onPress={onAdd}
          >
            <IconSymbol name="plus" size={20} color="#fff" />
            <ThemedText style={{ color: '#fff', marginLeft: 8, fontWeight: '700' }}>Add</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
      />
    </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },

  // Selected Count
  selectedCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Plan Title
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Selected Item
  selectedItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },

  // Patient Card
  patientCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 12,
  },
  patientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientInitials: {
    fontWeight: '700',
    fontSize: 16,
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 26, fontWeight: '700', marginBottom: 2 },
  headerSubtitle: { fontSize: 13, color: colorPalette.textSecondary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', fontSize: 13 },
  doctorName: { fontWeight: '600', fontSize: 13 },
  doctorRole: { fontSize: 11, color: colorPalette.textSecondary },
  logoutBtn: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center', gap: 4 },
  logoutText: { fontSize: 12, fontWeight: '600' },

  // Stats
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  statCard: { width: '48%', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colorPalette.border, alignItems: 'center' },
  statIconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statIcon: { fontSize: 24 },
  statLabel: { fontSize: 12, color: colorPalette.textSecondary, textAlign: 'center', marginBottom: 6 },
  statValue: { fontSize: 22, color: colorPalette.text },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colorPalette.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingVertical: 24, maxHeight: '70%' },
  planModal: { borderTopLeftRadius: 20, borderTopRightRadius: 20, flex: 1, maxHeight: '95%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colorPalette.text },
  modalSubtitle: { fontSize: 13, color: colorPalette.textSecondary, marginTop: 4 },
  closeBtn: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  
  // Form
  modalForm: { gap: 16, marginBottom: 20 },
  formGroup: { gap: 8 },
  formLabel: { fontSize: 13, fontWeight: '600', color: colorPalette.text },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1, color: colorPalette.text },
  
  // Buttons
  primaryBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  secondaryBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  secondaryBtnText: { fontWeight: '600', fontSize: 14 },
  
  // Modal Actions
  modalActions: { flexDirection: 'row', gap: 12 },

  // Action Button
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: { fontSize: 12, fontWeight: '600' },

  // Category Button
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorPalette.border,
    marginRight: 8,
    marginBottom: 8,
  },

  // Exercise Plan Modal
  twoColumnContainer: { flexDirection: 'row', height: 520, gap: 12, paddingHorizontal: 16 },
  leftColumn: { flex: 2 },
  rightColumn: { flex: 1, paddingLeft: 12, borderLeftWidth: 1 },
  exerciseContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  exerciseName: { fontSize: 14, fontWeight: '600' },
  exercisePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  exerciseBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseDesc: {
    fontSize: 12,
    color: colorPalette.textSecondary,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    fontSize: 12,
    color: colorPalette.textSecondary,
  },
  exerciseItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorPalette.border,
    alignItems: 'center',
    marginBottom: 8,
  },
  // Add Patient Button
  addPatientBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorPalette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});