import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MedicalRecord } from '../types';

const mockRecords: MedicalRecord[] = [
  { id: '1', date: '10 Jun 2026', title: 'Anatomy Ultrasound (20w)', provider: 'Dr. Selamawit T.', type: 'ULTRASOUND', summary: 'Normal fetal growth and development. All organs developing properly.', status: 'NORMAL' },
  { id: '2', date: '28 May 2026', title: 'Complete Blood Count', provider: 'TenaLink Central Lab', type: 'LAB_RESULT', summary: 'Hemoglobin levels slightly low. Advised to increase iron intake.', status: 'ATTENTION_NEEDED' },
  { id: '3', date: '15 May 2026', title: 'Initial Prenatal Visit', provider: 'Dr. Selamawit T.', type: 'DOCTOR_NOTE', summary: 'Patient in good health. Prescribed prenatal vitamins.', status: 'INFO' }
];

export default function RecordsScreen() {
  const listAnims = useRef(mockRecords.map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();
    Animated.stagger(150, listAnims.map(anim => 
      Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.back(1.5)) })
    )).start();
  }, []);

  const getIcon = (type: string) => { switch (type) { case 'ULTRASOUND': return '🖼️'; case 'LAB_RESULT': return '🧪'; case 'DOCTOR_NOTE': return '📝'; default: return '📄'; } };
  const getStatusColor = (status: string) => { switch (status) { case 'NORMAL': return '#10b981'; case 'ATTENTION_NEEDED': return '#f59e0b'; case 'INFO': return '#3b82f6'; default: return '#8492a6'; } };
  const getStatusText = (status: string) => { switch (status) { case 'NORMAL': return 'Normal'; case 'ATTENTION_NEEDED': return 'Attention'; case 'INFO': return 'Info'; default: return 'Unknown'; } };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f8fafc', '#e2e8f0', '#cbd5e1']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }], zIndex: 10 }}>
          <LinearGradient colors={['rgba(92, 89, 240, 0.95)', 'rgba(139, 92, 246, 0.95)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
            <Text style={styles.headerTitle}>Result Library</Text>
            <Text style={styles.headerSubtitle}>Your health records, secured.</Text>
            
            <View style={styles.filterContainer}>
              {['All', 'Labs', 'Scans', 'Notes'].map((filter, i) => (
                <TouchableOpacity key={i} style={[styles.filterButton, i === 0 && styles.filterActive]}>
                  <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.recordsList}>
          {mockRecords.map((record, index) => (
            <Animated.View key={record.id} style={{ opacity: listAnims[index], transform: [{ translateY: listAnims[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }, { scale: listAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }}>
              <BlurView intensity={60} tint="light" style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <LinearGradient colors={['#eef2ff', '#e0e7ff']} style={styles.recordIconContainer}>
                    <Text style={styles.recordIcon}>{getIcon(record.type)}</Text>
                  </LinearGradient>
                  <View style={styles.recordMainInfo}>
                    <Text style={styles.recordTitle}>{record.title}</Text>
                    <Text style={styles.recordDate}>{record.date} • {record.provider}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(record.status)}15`, borderColor: `${getStatusColor(record.status)}30` }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(record.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>{getStatusText(record.status)}</Text>
                  </View>
                </View>
                <Text style={styles.recordSummary}>{record.summary}</Text>
                <TouchableOpacity style={styles.viewDetailsBtn}>
                  <Text style={styles.viewDetailsText}>View Full Report →</Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#ffffff', fontFamily: 'Outfit', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontFamily: 'Inter', marginBottom: 24 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  filterContainer: { flexDirection: 'row', gap: 10 },
  filterButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  filterActive: { backgroundColor: '#ffffff', borderColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  filterText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', fontFamily: 'Inter' },
  filterTextActive: { color: '#5c59f0' },
  recordsList: { gap: 20, padding: 24 },
  recordCard: { borderRadius: 24, padding: 20, overflow: 'hidden', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.4)' },
  recordHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  recordIconContainer: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  recordIcon: { fontSize: 24 },
  recordMainInfo: { flex: 1, justifyContent: 'center' },
  recordTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', fontFamily: 'Outfit', marginBottom: 4 },
  recordDate: { fontSize: 12, color: '#64748b', fontFamily: 'Inter', fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginLeft: 8, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '800', fontFamily: 'Inter' },
  recordSummary: { fontSize: 14, color: '#475569', lineHeight: 22, fontFamily: 'Inter', marginBottom: 16, fontWeight: '500' },
  viewDetailsBtn: { backgroundColor: 'rgba(255,255,255,0.7)', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  viewDetailsText: { color: '#5c59f0', fontSize: 14, fontWeight: '800', fontFamily: 'Inter' }
});
