import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { PregnancyMilestone } from '../types';

const { width } = Dimensions.get('window');

const mockMilestones: PregnancyMilestone[] = [
  { id: '1', title: 'First Trimester Screening', date: 'Completed • 12 Weeks', status: 'COMPLETED', type: 'SCAN' },
  { id: '2', title: 'Anatomy Scan (Detailed)', date: 'Completed • 20 Weeks', status: 'COMPLETED', type: 'SCAN' },
  { id: '3', title: 'Glucose Tolerance Test', date: '24 Jun 2026 • 24 Weeks', status: 'UPCOMING', type: 'GENERAL' },
  { id: '4', title: 'Third Trimester Checkup', date: '15 Jul 2026 • 28 Weeks', status: 'UPCOMING', type: 'CHECKUP' }
];

export default function DashboardScreen() {
  const { profile } = useAuth();
  const currentWeek = 22;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const listAnims = useRef(mockMilestones.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(progressAnim, { toValue: (currentWeek / 40) * 100, duration: 1500, delay: 300, useNativeDriver: false, easing: Easing.out(Easing.cubic) })
    ]).start();

    Animated.stagger(150, listAnims.map(anim => 
      Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic) })
    )).start();
  }, []);

  const getMilestoneIcon = (type: string) => {
    switch(type) { case 'SCAN': return '🖼️'; case 'LAB_RESULT': return '🧪'; case 'CHECKUP': return '🩺'; default: return '📅'; }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f8fafc', '#e2e8f0', '#cbd5e1']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <LinearGradient colors={['rgba(92, 89, 240, 0.9)', 'rgba(139, 92, 246, 0.9)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.name}>{profile?.full_name || 'Selamawit'}</Text>
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>{profile?.full_name?.charAt(0) || 'S'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressCardContainer}>
              <BlurView intensity={40} tint="light" style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Week {currentWeek} of Pregnancy</Text>
                  <View style={styles.trimesterBadge}>
                    <Text style={styles.trimesterText}>2nd Trimester</Text>
                  </View>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <Animated.View style={[styles.progressBarFill, { width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}>
                    <LinearGradient colors={['#ffffff', '#eef2ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                  </Animated.View>
                </View>
                
                <View style={styles.babyUpdate}>
                  <View style={styles.babyUpdateIconBg}><Text style={styles.babyUpdateIcon}>👶</Text></View>
                  <Text style={styles.babyUpdateText}>Your baby is about the size of a papaya.</Text>
                </View>
              </BlurView>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Journey Timeline</Text>
          <View style={styles.timelineContainer}>
            {mockMilestones.map((milestone, index) => (
              <Animated.View key={milestone.id} style={[styles.timelineItem, { opacity: listAnims[index], transform: [{ translateY: listAnims[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, milestone.status === 'COMPLETED' ? styles.timelineDotCompleted : styles.timelineDotUpcoming]}>
                    {milestone.status === 'COMPLETED' && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                  {index < mockMilestones.length - 1 && <View style={[styles.timelineLine, milestone.status === 'COMPLETED' ? styles.timelineLineCompleted : styles.timelineLineUpcoming]} />}
                </View>
                
                <View style={[styles.timelineCard, milestone.status === 'COMPLETED' ? styles.timelineCardCompleted : styles.timelineCardUpcoming]}>
                  <View style={[styles.timelineIconContainer, milestone.status === 'UPCOMING' && { backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                    <Text style={styles.timelineIcon}>{getMilestoneIcon(milestone.type)}</Text>
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineCardTitle}>{milestone.title}</Text>
                    <Text style={styles.timelineCardDate}>{milestone.date}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {[
              { icon: '🍎', title: 'Diet Plan', color: ['#eef2ff', '#c7d2fe'] },
              { icon: '🩸', title: 'Symptoms', color: ['#fee2e2', '#fecaca'] },
              { icon: '🧘‍♀️', title: 'Exercises', color: ['#dcfce7', '#bbf7d0'] }
            ].map((qa, i) => (
              <TouchableOpacity key={i} style={styles.qaCardWrapper}>
                <LinearGradient colors={qa.color as [string, string]} style={styles.qaCardGradient}>
                  <Text style={styles.qaIcon}>{qa.icon}</Text>
                  <Text style={styles.qaTitle}>{qa.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter', letterSpacing: 0.5 },
  name: { fontSize: 32, fontWeight: '800', color: '#ffffff', fontFamily: 'Outfit', marginTop: 2, letterSpacing: -0.5 },
  profileBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  profileBtnText: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  progressCardContainer: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', marginBottom: -50 },
  progressCard: { padding: 24, backgroundColor: 'rgba(255,255,255,0.15)' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  progressTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', fontFamily: 'Outfit' },
  trimesterBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  trimesterText: { fontSize: 12, fontWeight: '700', color: '#ffffff', fontFamily: 'Inter' },
  progressBarContainer: { height: 12, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 6, overflow: 'hidden', marginBottom: 20 },
  progressBarFill: { height: '100%', borderRadius: 6, overflow: 'hidden' },
  babyUpdate: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 16 },
  babyUpdateIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  babyUpdateIcon: { fontSize: 18 },
  babyUpdateText: { flex: 1, fontSize: 14, color: '#ffffff', fontFamily: 'Inter', fontWeight: '500' },
  section: { padding: 24, paddingTop: 40 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', fontFamily: 'Outfit', marginBottom: 24, letterSpacing: -0.5 },
  timelineContainer: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineLeft: { width: 30, alignItems: 'center', marginRight: 16 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, alignItems: 'center', justifyContent: 'center', zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  timelineDotCompleted: { backgroundColor: '#5c59f0', borderColor: '#ffffff' },
  timelineDotUpcoming: { backgroundColor: '#ffffff', borderColor: '#cbd5e1' },
  checkIcon: { color: '#ffffff', fontSize: 10, fontWeight: '900' },
  timelineLine: { width: 2, flex: 1, position: 'absolute', top: 24, bottom: -24, zIndex: 1 },
  timelineLineCompleted: { backgroundColor: '#5c59f0' },
  timelineLineUpcoming: { backgroundColor: '#cbd5e1' },
  timelineCard: { flex: 1, flexDirection: 'row', padding: 16, borderRadius: 20 },
  timelineCardCompleted: { backgroundColor: 'rgba(255,255,255,0.9)', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  timelineCardUpcoming: { backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  timelineIconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  timelineIcon: { fontSize: 22 },
  timelineContent: { flex: 1, justifyContent: 'center' },
  timelineCardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', fontFamily: 'Outfit', marginBottom: 4 },
  timelineCardDate: { fontSize: 13, color: '#64748b', fontFamily: 'Inter', fontWeight: '500' },
  quickAccessGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  qaCardWrapper: { width: (width - 48 - 24) / 3, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  qaCardGradient: { padding: 16, alignItems: 'center', justifyContent: 'center', height: 100 },
  qaIcon: { fontSize: 32, marginBottom: 8 },
  qaTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b', fontFamily: 'Inter' }
});
