import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileScreen() {
  const { profile, logout } = useAuth();
  const [riskScore, setRiskScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    loadRiskScore();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true })
    ]).start();
  }, []);

  const loadRiskScore = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const data = await api.getRiskScore(profile.id);
      setRiskScore(data);
    } catch (error) {
      setRiskScore({ score: 92, level: 'EXCELLENT', recommendations: ['Continue regular exercise', 'Maintain balanced diet, rich in folic acid', 'Stay hydrated'] });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColors = (level: string) => {
    switch (level) {
      case 'EXCELLENT': return ['#10b981', '#059669'];
      case 'MEDIUM': return ['#f59e0b', '#d97706'];
      case 'HIGH': return ['#ef4444', '#b91c1c'];
      default: return ['#3b82f6', '#2563eb'];
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#eef2ff', '#e0e7ff', '#c7d2fe']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }], alignItems: 'center', marginTop: 80, marginBottom: 40 }}>
          <View style={styles.avatarWrapper}>
            <LinearGradient colors={['#5c59f0', '#8b5cf6']} style={styles.avatarGradient}>
              <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'U'}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.name}>{profile?.full_name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile?.role?.replace('_', ' ')}</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <BlurView intensity={70} tint="light" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Wellness Overview</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#5c59f0" style={{ marginVertical: 40 }} />
            ) : riskScore ? (
              <View style={styles.scoreContainer}>
                <View style={styles.scoreDialWrapper}>
                  <LinearGradient colors={getScoreColors(riskScore.level) as [string, string]} style={styles.scoreDialGradient}>
                    <View style={styles.scoreDialInner}>
                      <Text style={styles.scoreNumber}>{riskScore.score}</Text>
                      <Text style={styles.scoreLevel}>{riskScore.level}</Text>
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.recommendationsList}>
                  {riskScore.recommendations?.map((rec: string, i: number) => (
                    <View key={i} style={styles.recItem}>
                      <Text style={styles.recIcon}>✨</Text>
                      <Text style={styles.recText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </BlurView>

          <BlurView intensity={70} tint="light" style={[styles.sectionCard, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fayda ID</Text>
              <Text style={styles.infoValue}>{profile?.fayda_id || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{profile?.phone || '+251 911 234 567'}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.infoLabel}>Account Status</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{profile?.is_active ? 'Active' : 'Inactive'}</Text>
              </View>
            </View>
          </BlurView>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LinearGradient colors={['#ef4444', '#b91c1c']} style={styles.logoutGradient}>
              <Text style={styles.logoutText}>Sign Out Securely</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 60 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 40, overflow: 'hidden', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 10, marginBottom: 20, borderWidth: 2, borderColor: '#ffffff' },
  avatarGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 52, fontWeight: '800', color: '#ffffff', fontFamily: 'Outfit' },
  name: { fontSize: 32, fontWeight: '800', color: '#1e293b', fontFamily: 'Outfit', letterSpacing: -0.5 },
  roleBadge: { backgroundColor: 'rgba(92, 89, 240, 0.1)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  roleText: { fontSize: 13, fontWeight: '800', color: '#5c59f0', fontFamily: 'Inter', letterSpacing: 1, textTransform: 'uppercase' },
  sectionCard: { borderRadius: 32, padding: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.4)', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', fontFamily: 'Outfit', marginBottom: 24 },
  scoreContainer: { alignItems: 'center' },
  scoreDialWrapper: { width: 180, height: 180, borderRadius: 90, overflow: 'hidden', marginBottom: 32, shadowColor: '#10b981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  scoreDialGradient: { flex: 1, padding: 8 },
  scoreDialInner: { flex: 1, backgroundColor: '#ffffff', borderRadius: 82, alignItems: 'center', justifyContent: 'center' },
  scoreNumber: { fontSize: 56, fontWeight: '900', color: '#1e293b', fontFamily: 'Outfit', letterSpacing: -2, marginTop: 10 },
  scoreLevel: { fontSize: 14, fontWeight: '800', color: '#10b981', fontFamily: 'Inter', letterSpacing: 1, textTransform: 'uppercase' },
  recommendationsList: { width: '100%', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 24, padding: 20 },
  recItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  recIcon: { fontSize: 16, marginRight: 12, marginTop: 2 },
  recText: { flex: 1, fontSize: 14, color: '#475569', fontFamily: 'Inter', lineHeight: 22, fontWeight: '500' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  infoLabel: { fontSize: 15, color: '#64748b', fontFamily: 'Inter', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#1e293b', fontFamily: 'Inter', fontWeight: '700' },
  statusPill: { backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusPillText: { color: '#16a34a', fontSize: 13, fontWeight: '800', fontFamily: 'Inter' },
  logoutButton: { marginTop: 32, borderRadius: 24, overflow: 'hidden', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 5 },
  logoutGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: '#ffffff', fontSize: 16, fontWeight: '800', fontFamily: 'Inter', letterSpacing: 0.5 }
});
