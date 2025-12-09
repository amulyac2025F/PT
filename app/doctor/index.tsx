import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DoctorDashboard() {
  //tabs
  type Tab = 'Home' | 'My Patients' | 'Profile';
  //active set to home
  const [active, setActive] = useState<Tab>('Home');
  //exrcise modal set to false
  const [planModalVisible, setPlanModalVisible] = useState(false);
  //selectedPatient holds patient being edited/starts as null
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  //defaults to light theme
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  // State for patient list and add patient modal
  const [patients, setPatients] = useState<Patient[]>(() => SAMPLE);
  const [addPatientModalVisible, setAddPatientModalVisible] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({ name: '', email: '', patientId: '' });

  // Reset form and show add patient modal
  const openAddPatient = () => {
    setNewPatientForm({ name: '', email: '', patientId: '' });
    setAddPatientModalVisible(true);
  };

  // Hide add patient modal
  const closeAddPatient = () => setAddPatientModalVisible(false);

  // Add a new patient to the list after validation
  const handleAddPatient = () => {
    // Validate that all fields are filled
    if (!newPatientForm.name.trim() || !newPatientForm.email.trim() || !newPatientForm.patientId.trim()) {
      return;
    }
    
    // Create new patient object with unique ID
    const newP: Patient = {
      id: Date.now().toString(),
      name: newPatientForm.name.trim(),
      email: newPatientForm.email.trim(),
      exercises: [],
    };
    
    // Add to top of patient list and close modal
    setPatients((prev) => [newP, ...prev]);
    closeAddPatient();
  };

  // Update patient's exercise plan when saved from modal
  const handleSavePlan = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setPlanModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header with title and navigation buttons */}
      <View style={styles.header}>
        <ThemedText type="title">PT Portal</ThemedText>
        <View style={styles.headerRight}>
          {/* Switch to patient view */}
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.headerButton}>
            <IconSymbol name="house.fill" size={20} color={tint} />
            <ThemedText style={{ marginLeft: 8 }}>Switch to Patient</ThemedText>
          </TouchableOpacity>
          
          {/* Logout */}
          <TouchableOpacity onPress={() => router.replace('/signin')} style={styles.headerButton}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={tint} />
            <ThemedText style={{ marginLeft: 8 }}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab navigation */}
      <View style={styles.nav}>
        {(['Home', 'My Patients', 'Profile'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setActive(t)}
            style={[styles.navBtn, active === t && { borderBottomColor: tint, borderBottomWidth: 2 }]}
          >
            <ThemedText style={active === t ? styles.navTextActive : styles.navText}>{t}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main content area - renders based on active tab */}
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Home tab: Dashboard overview with stats */}
        {active === 'Home' && (
          <View>
            <ThemedText type="subtitle">Welcome back, Dr. Smith</ThemedText>
            <View style={styles.grid}>
              {/* Total patient count */}
              <View style={styles.card}>
                <ThemedText type="defaultSemiBold">Total Patients</ThemedText>
                <ThemedText type="title">{patients.length}</ThemedText>
              </View>
              
              {/* Count of patients with active exercise plans */}
              <View style={styles.card}>
                <ThemedText type="defaultSemiBold">Active Plans</ThemedText>
                <ThemedText type="title">{patients.filter(p => p.exercises.length > 0).length}</ThemedText>
              </View>
              
              {/* Placeholder for patients needing attention */}
              <View style={styles.card}>
                <ThemedText type="defaultSemiBold">Needs Attention</ThemedText>
                <ThemedText type="title">3</ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* My Patients tab: Searchable patient list with actions */}
        {active === 'My Patients' && (
          <PatientsListInline
            patients={patients}
            onAdd={() => openAddPatient()}
            onEdit={(p) => {
              setSelectedPatient(p);
              setPlanModalVisible(true);
            }}
          />
        )}

        {/* Profile tab: Doctor profile settings placeholder */}
        {active === 'Profile' && (
          <View>
            <ThemedText type="subtitle">Profile</ThemedText>
            <ThemedText>Doctor profile and settings placeholder.</ThemedText>
          </View>
        )}

        {/* Modal for creating/editing exercise plans */}
        <CreateExercisePlanModal
          patient={selectedPatient}
          visible={planModalVisible}
          onClose={() => setPlanModalVisible(false)}
          onSave={handleSavePlan}
        />

        {/* Modal for adding a new patient */}
        <Modal visible={addPatientModalVisible} animationType="slide" onRequestClose={closeAddPatient} transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { width: '90%', maxHeight: '60%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Patient</Text>
                <Pressable onPress={closeAddPatient}>
                  <Text style={styles.modalClose}>Close</Text>
                </Pressable>
              </View>

              <View style={{ paddingVertical: 8 }}>
                {/* Patient name input */}
                <Text style={{ marginBottom: 6 }}>Name</Text>
                <TextInput
                  placeholder="Patient name"
                  value={newPatientForm.name}
                  onChangeText={(v) => setNewPatientForm((s) => ({ ...s, name: v }))}
                  style={styles.search}
                  placeholderTextColor="#8b8f96"
                />
                
                {/* Patient email input */}
                <Text style={{ marginTop: 8, marginBottom: 6 }}>Email</Text>
                <TextInput
                  placeholder="patient@email.com"
                  value={newPatientForm.email}
                  onChangeText={(v) => setNewPatientForm((s) => ({ ...s, email: v }))}
                  style={styles.search}
                  placeholderTextColor="#8b8f96"
                />
                
                {/* Patient ID input */}
                <Text style={{ marginTop: 8, marginBottom: 6 }}>Patient ID</Text>
                <TextInput
                  placeholder="Patient ID"
                  value={newPatientForm.patientId}
                  onChangeText={(v) => setNewPatientForm((s) => ({ ...s, patientId: v }))}
                  style={styles.search}
                  placeholderTextColor="#8b8f96"
                />
              </View>

              {/* Modal action buttons */}
              <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <TouchableOpacity style={[styles.outlineBtn, { paddingHorizontal: 16 }]} onPress={closeAddPatient}>
                  <Text style={styles.outlineBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddPatient}>
                  <Text style={styles.saveButtonText}>Add Patient</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ThemedView>
  );
}

/**
 * Modal component for creating and customizing exercise plans for patients
 * Allows selection from exercise library, customization of sets/reps, and assignment to patients
 */
function CreateExercisePlanModal({
  patient,
  visible,
  onClose,
  onSave,
}: {
  patient: Patient | null;
  visible: boolean;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}) {
  // Exercise type definition with default parameters
  type Exercise = { id: string; name: string; description?: string; reps: number; sets: number; category: string };

  // Library of pre-defined exercises organized by category
  const exerciseLibrary: Exercise[] = [
    { id: 'e1', name: 'Shoulder Flexion', description: 'Raise arm forward', reps: 10, sets: 3, category: 'Shoulder' },
    { id: 'e2', name: 'Shoulder Abduction', description: 'Raise arm sideways', reps: 10, sets: 3, category: 'Shoulder' },
    { id: 'e3', name: 'Shoulder External Rotation', description: 'Rotate shoulder outward', reps: 12, sets: 2, category: 'Shoulder' },
    { id: 'e4', name: 'Knee Extension', description: 'Straighten knee', reps: 15, sets: 2, category: 'Knee' },
    { id: 'e5', name: 'Hip Abduction', description: 'Move leg outward', reps: 12, sets: 3, category: 'Hip' },
    { id: 'e6', name: 'Ankle Circles', description: 'Rotate ankle', reps: 10, sets: 2, category: 'Ankle' },
  ];

  // Get unique categories from exercise library, plus 'All' option
  const categories = ['All', ...Array.from(new Set(exerciseLibrary.map((e) => e.category)))];

  // State for selected exercises, search query, and active category filter
  const [selected, setSelected] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [selCategory, setSelCategory] = useState<string>('All');

  // Filter exercises based on search text and selected category
  const filtered = exerciseLibrary.filter((e) => {
    const matchesSearch = (e.name + ' ' + (e.description ?? '') + ' ' + e.category).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selCategory === 'All' || e.category === selCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle exercise selection (add/remove from plan)
  const toggleSelect = (exercise: Exercise) => {
    const exists = selected.find((s) => s.id === exercise.id);
    if (exists) setSelected((s) => s.filter((x) => x.id !== exercise.id));
    else setSelected((s) => [...s, { ...exercise }]);
  };

  // Remove an exercise from the current plan
  const removeExercise = (id: string) => setSelected((s) => s.filter((x) => x.id !== id));

  // Update sets or reps for a selected exercise
  const updateField = (id: string, field: 'sets' | 'reps', valueStr: string) =>
    setSelected((s) =>
      s.map((ex) => (ex.id === id ? { ...ex, [field]: parseInt(valueStr, 10) || 0 } : ex))
    );

  // Format exercises as display strings (e.g., "Shoulder Flexion (3×10)")
  const formatExercises = (exercises: Exercise[]): string[] => {
    return exercises.map((ex) => `${ex.name} (${ex.sets}×${ex.reps})`);
  };

  // Save the exercise plan to the selected patient
  const handleSave = () => {
    if (patient) {
      const updatedPatient: Patient = {
        ...patient,
        exercises: formatExercises(selected),
      };
      onSave(updatedPatient);
      setSelected([]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { width: '95%', maxHeight: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Exercise Plan — {patient?.name ?? ''}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.modalClose}>Close</Text>
            </Pressable>
          </View>

          {/* Two-column layout: exercise library (left) and selected plan (right) */}
          <View style={styles.twoColumnContainer}>
            
            {/* Left column: Exercise library with search and filters */}
            <View style={styles.leftColumn}>
              {/* Search input for exercises */}
              <TextInput
                placeholder="Search exercises..."
                value={search}
                onChangeText={setSearch}
                style={styles.search}
                placeholderTextColor="#8b8f96"
              />

              {/* Category filter buttons */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8, gap: 8 }}>
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.categoryBtn, selCategory === c && styles.categoryBtnActive]}
                    onPress={() => setSelCategory(c)}
                  >
                    <Text style={{ color: selCategory === c ? '#fff' : '#111827' }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Scrollable list of filtered exercises */}
              <ScrollView style={{ flex: 1 }}>
                {filtered.map((ex) => {
                  const isSelected = selected.some((s) => s.id === ex.id);
                  return (
                    <TouchableOpacity
                      key={ex.id}
                      onPress={() => toggleSelect(ex)}
                      style={[styles.cardItem, isSelected && styles.selectedCard]}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: '600', marginBottom: 4 }}>{ex.name}</Text>
                          {ex.description ? <Text style={{ color: '#6b7280', fontSize: 12 }}>{ex.description}</Text> : null}
                          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>{ex.sets} sets</Text>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>•</Text>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>{ex.reps} reps</Text>
                          </View>
                        </View>
                        <View style={styles.badgeSmall}>
                          <Text style={{ fontSize: 12, color: '#374151' }}>{ex.category}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Right column: Selected exercises and customization */}
            <View style={styles.rightColumn}>
              {/* Plan header with exercise count */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontWeight: '700' }}>Exercise Plan</Text>
                <View style={styles.badgeSmall}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>{selected.length} exercises</Text>
                </View>
              </View>

              {/* Scrollable list of selected exercises with customization options */}
              <ScrollView style={{ flex: 1 }}>
                {selected.length === 0 ? (
                  <View style={{ paddingVertical: 20 }}>
                    <Text style={{ color: '#6b7280' }}>No exercises selected — choose from the library.</Text>
                  </View>
                ) : (
                  selected.map((ex, idx) => (
                    <View key={ex.id} style={styles.selectedCardContainer}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                          {/* Exercise number badge */}
                          <View style={styles.indexCircle}><Text style={{ color: '#0a7ea4' }}>{idx + 1}</Text></View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600' }}>{ex.name}</Text>
                            <View style={{ marginTop: 6 }}>
                              <View style={styles.badgeSmall}><Text style={{ fontSize: 12 }}>{ex.category}</Text></View>
                            </View>
                          </View>
                        </View>
                        
                        {/* Delete exercise button */}
                        <TouchableOpacity style={styles.trashButton} onPress={() => removeExercise(ex.id)}>
                          <Text style={{ color: '#ef4444' }}>🗑</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Sets and reps input fields */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>Sets</Text>
                          <TextInput
                            value={String(ex.sets)}
                            onChangeText={(v) => updateField(ex.id, 'sets', v)}
                            keyboardType="number-pad"
                            style={styles.numberInput}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>Reps</Text>
                          <TextInput
                            value={String(ex.reps)}
                            onChangeText={(v) => updateField(ex.id, 'reps', v)}
                            keyboardType="number-pad"
                            style={styles.numberInput}
                          />
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Save and template buttons */}
              <View style={{ marginTop: 12 }}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save & Assign Plan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.outlineBtn, { marginTop: 8 }]} onPress={onClose}>
                  <Text style={styles.outlineBtnText}>Save as Template</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Patient data type definition
type Patient = { id: string; name: string; email: string; exercises: string[] };

// Sample patient data for initial state
const SAMPLE: Patient[] = [
  { id: '1', name: 'John Smith', email: 'smithjohn@gmail.com', exercises: ['Shoulder Flexion (3×10)', 'Knee Extension (2×15)'] },
  { id: '2', name: 'Micheal Scott', email: 'theoffice@email.com', exercises: ['Hip Abduction (3×12)'] },
  { id: '3', name: 'Taylor Johnson', email: 'taylor@email.com', exercises: [] },
];

/**
 * Component displaying a searchable list of patients with action buttons
 * Shows patient info, current exercises, and options to create/edit plans
 */
function PatientsListInline({ onEdit, patients, onAdd }: { onEdit: (p: Patient) => void; patients: Patient[]; onAdd: () => void }) {
  // Search query state
  const [query, setQuery] = useState('');
  
  // Memoized filtered patient list based on search (by name or email)
  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query, patients]
  );

  // Render individual patient row
  function renderItem({ item }: { item: Patient }) {
    // Generate initials from patient name for avatar
    const initials = item.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <View style={styles.row}>
        {/* Left section: Avatar and patient info */}
        <View style={styles.left}>
          {/* Avatar with initials */}
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>{initials}</ThemedText>
          </View>
          
          {/* Patient details */}
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
              {/* Badge showing number of assigned exercises */}
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>
                  {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>
            </View>
            
            {/* Patient email */}
            <ThemedText style={styles.email}>{item.email}</ThemedText>

            {/* Current exercises label */}
            <ThemedText style={styles.currentLabel}>Current Exercises:</ThemedText>
            
            {/* List of assigned exercises or placeholder */}
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

        {/* Right section: Action buttons */}
        <View style={styles.actions}>
          {/* Create/Edit plan button */}
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => onEdit(item)}
          >
            <IconSymbol name="plus" size={14} color="#000" />
            <ThemedText style={styles.outlineBtnText}> {item.exercises.length ? 'Edit Plan' : 'Create Plan'}</ThemedText>
          </TouchableOpacity>

          {/* View progress button */}
          <TouchableOpacity style={styles.outlineBtn}>
            <ThemedText style={styles.outlineBtnText}>View Progress</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ThemedView>
      {/* Header with search and add button */}
      <View style={styles.headerRow}>
        <ThemedText type="title">My Patients</ThemedText>

        <View style={styles.headerActions}>
          {/* Search input for filtering patients */}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search patients..."
            style={styles.search}
            placeholderTextColor="#8b8f96"
          />
          
          {/* Add new patient button */}
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <IconSymbol name="person.bust" size={16} color="#fff" />
            <ThemedText style={styles.addBtnText}> Add Patient</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable list of filtered patients */}
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

// StyleSheet containing all component styles
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerButton: { flexDirection: 'row', alignItems: 'center' },
  nav: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  navBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  navText: { color: '#6b7280' },
  navTextActive: { color: '#0a7ea4', fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingBottom: 80 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  search: { minWidth: 180, height: 40, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#f3f4f6', color: '#000' },
  addBtn: { backgroundColor: '#0a7ea4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  addBtnText: { color: '#fff' },
  row: { flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 8, alignItems: 'flex-start', justifyContent: 'space-between' },
  left: { flexDirection: 'row', flex: 1, gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#eef2f7', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700', color: '#1f2937' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { marginLeft: 8, backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, color: '#374151' },
  email: { color: '#64748b', marginTop: 4 },
  currentLabel: { marginTop: 10, color: '#374151', fontSize: 13 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  pill: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e9ee', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  pillText: { fontSize: 12, color: '#111827' },
  noExercises: { color: '#6b7280', fontSize: 13, marginTop: 6 },
  actions: { justifyContent: 'center', alignItems: 'flex-end', gap: 10 },
  outlineBtn: { flexDirection: 'row', borderWidth: 1, borderColor: '#e6e9ee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignItems: 'center', backgroundColor: '#fff', marginBottom: 8 },
  outlineBtnText: { color: '#111827' },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#0a7ea4' },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  twoColumnContainer: { flexDirection: 'row', gap: 12, height: 520 },
  leftColumn: { flex: 2, paddingRight: 8 },
  rightColumn: { flex: 1, paddingLeft: 8, borderLeftWidth: 1, borderColor: '#f3f4f6' },
  cardItem: { borderWidth: 1, borderColor: '#e6e9ee', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#fff' },
  selectedCard: { borderColor: '#0a7ea4', backgroundColor: '#f0f9ff' },
  categoryBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e9ee' },
  categoryBtnActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  badgeSmall: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  selectedCardContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  indexCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eef6fb', justifyContent: 'center', alignItems: 'center' },
  numberInput: { height: 36, borderRadius: 8, backgroundColor: '#f3f4f6', paddingHorizontal: 8 },
  saveButton: { backgroundColor: '#0a7ea4', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  trashButton: { padding: 6 },
});