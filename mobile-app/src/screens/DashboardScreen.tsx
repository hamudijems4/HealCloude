import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Bell, Plus, ChevronRight, Heart, Calendar, Clock, Star, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

const WEEK = 22;
const DUE_DATE = 'Nov 14, 2026';
const TRIMESTER = '2nd Trimester';

const milestones = [
  { week: 20, title: 'Anatomy Scan', desc: "Baby's organs fully visible. All markers normal.", done: true },
  { week: 22, title: 'Sensory Growth', desc: 'Hearing is active. Talk or sing to your baby.', done: true },
  { week: 24, title: 'Lung Development', desc: 'Lungs forming oxygen branches. Stay hydrated.', done: false },
  { week: 28, title: 'Kick Counts Begin', desc: 'Track daily kick counts — aim for 10 per session.', done: false },
];

const appointments = [
  { id: '1', title: 'Prenatal Checkup', doctor: 'Dr. Tsige Abebe', date: 'Jun 18, 2026', time: '10:00 AM', status: 'upcoming' },
  { id: '2', title: 'Blood Panel', doctor: 'Bole Clinical Lab', date: 'Jun 25, 2026', time: '8:30 AM', status: 'upcoming' },
  { id: '3', title: '20-Week Scan', doctor: 'Dr. Yared Shimeles', date: 'May 10, 2026', time: '9:00 AM', status: 'completed' },
];

const doctors = [
  { id: '1', name: 'Dr. Tsige Abebe', specialty: 'OB/GYN', hospital: 'Tikur Anbessa', slots: 3, queue: 2, available: true },
  { id: '2', name: 'Dr. Yared Shimeles', specialty: 'Maternal Health', hospital: 'St. Paul Millennium', slots: 1, queue: 5, available: true },
  { id: '3', name: 'Dr. Kenenisa D.', specialty: 'Pediatric', hospital: 'Zewditu Memorial', slots: 0, queue: 12, available: false },
];

type Tab = 'home' | 'schedule' | 'doctors';

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('home');
  const [booked, setBooked] = useState<string | null>(null);
  const progress = (WEEK / 40) * 100;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <MotiView from={{ opacity: 0, translateY: -16 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back 👋</Text>
            <Text style={styles.userName}>{profile?.full_name || 'Almaz Tadesse'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarBtn}>
              <Text style={styles.avatarInitial}>{(profile?.full_name || 'A').charAt(0)}</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Pregnancy Card */}
        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 200 }}>
          <LinearGradient colors={['#3A59FF', '#6C63FF', '#A78BFA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.pregnancyCard}>
            <View style={styles.cardCircle1} />
            <View style={styles.cardCircle2} />
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.cardLabel}>{TRIMESTER}</Text>
                <Text style={styles.cardWeek}>Week {WEEK} of 40</Text>
              </View>
              <View style={styles.cardBadge}>
                <Heart size={14} color={COLORS.white} />
                <Text style={styles.cardBadgeText}>Healthy</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <MotiView from={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ type: 'timing', duration: 1400, delay: 600 }} style={styles.progressBarFill} />
            </View>
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardSub}>{Math.round(40 - WEEK)} weeks remaining</Text>
              <Text style={styles.cardSub}>Due: {DUE_DATE}</Text>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Reminder Banner */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }} style={styles.reminderBanner}>
          <AlertCircle size={16} color={COLORS.warning} />
          <Text style={styles.reminderText}>Vitamin D due at 8:00 PM • Hydration: 45% of daily goal</Text>
        </MotiView>

        {/* Tab Switcher */}
        <View style={styles.tabs}>
          {(['home', 'schedule', 'doctors'] as Tab[]).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'home' ? 'Milestones' : t === 'schedule' ? 'Schedule' : 'Doctors'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AnimatePresence>

          {/* MILESTONES TAB */}
          {tab === 'home' && (
            <MotiView key="home" from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
              {milestones.map((m, i) => (
                <MotiView key={m.week} from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 80 }} style={styles.milestoneRow}>
                  <View style={[styles.milestoneIcon, { backgroundColor: m.done ? COLORS.successLight : COLORS.primaryLight }]}>
                    {m.done
                      ? <CheckCircle2 size={20} color={COLORS.accent} />
                      : <Calendar size={20} color={COLORS.primary} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.milestoneHeaderRow}>
                      <Text style={styles.milestoneTitle}>{m.title}</Text>
                      <Text style={styles.milestoneWeek}>Wk {m.week}</Text>
                    </View>
                    <Text style={styles.milestoneDesc}>{m.desc}</Text>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {/* SCHEDULE TAB */}
          {tab === 'schedule' && (
            <MotiView key="schedule" from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Appointments</Text>
                <TouchableOpacity style={styles.newBtn}>
                  <Plus size={14} color={COLORS.primary} />
                  <Text style={styles.newBtnText}>Book New</Text>
                </TouchableOpacity>
              </View>
              {appointments.map((apt, i) => (
                <MotiView key={apt.id} from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 80 }} style={styles.aptCard}>
                  <View style={styles.aptLeft}>
                    <View style={[styles.aptStatus, { backgroundColor: apt.status === 'completed' ? COLORS.successLight : COLORS.primaryLight }]}>
                      {apt.status === 'completed'
                        ? <CheckCircle2 size={18} color={COLORS.accent} />
                        : <Clock size={18} color={COLORS.primary} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aptTitle}>{apt.title}</Text>
                      <Text style={styles.aptDoctor}>{apt.doctor}</Text>
                      <View style={styles.aptTimeRow}>
                        <Calendar size={12} color={COLORS.textMuted} />
                        <Text style={styles.aptTime}>{apt.date} • {apt.time}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.aptBadge, { backgroundColor: apt.status === 'completed' ? COLORS.successLight : COLORS.primaryLight }]}>
                    <Text style={[styles.aptBadgeText, { color: apt.status === 'completed' ? COLORS.accent : COLORS.primary }]}>
                      {apt.status === 'completed' ? 'Done' : 'Upcoming'}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {/* DOCTORS TAB */}
          {tab === 'doctors' && (
            <MotiView key="doctors" from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
              <Text style={[styles.sectionTitle, { marginBottom: SPACING.md }]}>Available Specialists</Text>
              {doctors.map((doc, i) => (
                <MotiView key={doc.id} from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 80 }} style={styles.doctorCard}>
                  <View style={[styles.doctorAvatar, { backgroundColor: doc.available ? COLORS.successLight : COLORS.cardAlt }]}>
                    <Stethoscope size={22} color={doc.available ? COLORS.accent : COLORS.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>{doc.name}</Text>
                    <Text style={styles.doctorSpec}>{doc.specialty} • {doc.hospital}</Text>
                    <View style={styles.doctorMeta}>
                      <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                      <Text style={styles.doctorMetaText}>
                        {doc.available ? `${doc.slots} slots left` : `Queue: #${doc.queue}`}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    disabled={booked === doc.id}
                    onPress={() => setBooked(doc.id)}
                    style={[styles.bookBtn, !doc.available && styles.bookBtnFull]}
                  >
                    <Text style={[styles.bookBtnText, !doc.available && { color: COLORS.textMuted }]}>
                      {booked === doc.id ? '✓ Booked' : doc.available ? 'Book' : 'Waitlist'}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </MotiView>
          )}

        </AnimatePresence>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 110 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  welcomeText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 40, height: 40, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: COLORS.white, fontWeight: '800', fontSize: 16 },

  pregnancyCard: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md, overflow: 'hidden', ...SHADOWS.medium },
  cardCircle1: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)', top: -30, right: -20 },
  cardCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.06)', top: 20, right: 60 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  cardLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 4 },
  cardWeek: { fontSize: 28, fontWeight: '900', color: COLORS.white, letterSpacing: -1 },
  cardBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BORDER_RADIUS.full, gap: 6 },
  cardBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: SPACING.sm },
  progressBarFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 4 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  reminderBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warningLight, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xl, gap: 10, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  reminderText: { flex: 1, fontSize: 12, color: COLORS.warning, fontWeight: '600' },

  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, padding: 4, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: BORDER_RADIUS.sm },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  milestoneRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 14, alignItems: 'center' },
  milestoneIcon: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  milestoneHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  milestoneTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  milestoneWeek: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  milestoneDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 18 },

  aptCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'space-between', alignItems: 'center' },
  aptLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  aptStatus: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  aptTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  aptDoctor: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  aptTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  aptTime: { fontSize: 11, color: COLORS.textMuted },
  aptBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  aptBadgeText: { fontSize: 11, fontWeight: '700' },

  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  doctorAvatar: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  doctorName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  doctorSpec: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  doctorMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  doctorMetaText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  bookBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: BORDER_RADIUS.md },
  bookBtnFull: { backgroundColor: COLORS.cardAlt },
  bookBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
});
