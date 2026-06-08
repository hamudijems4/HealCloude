import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Svg, Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Bell, Plus, ChevronRight, Heart, Calendar, Clock, Stethoscope, CheckCircle2, AlertCircle, TrendingUp, Activity, Star } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const CARD_PAD = SPACING.lg;
const INNER = width - CARD_PAD * 2;

// ── Mini sparkline data (wellness score over 6 weeks) ──────────────────────
const SPARK_DATA = [62, 70, 66, 78, 74, 88];
const SPARK_W = INNER;
const SPARK_H = 56;
const sparkPoints = SPARK_DATA.map((v, i) => {
  const x = (i / (SPARK_DATA.length - 1)) * (SPARK_W - 16) + 8;
  const y = SPARK_H - ((v - 55) / 40) * (SPARK_H - 12) - 4;
  return `${x},${y}`;
}).join(' ');
const lastX = parseFloat(sparkPoints.split(' ').pop()!.split(',')[0]);
const lastY = parseFloat(sparkPoints.split(' ').pop()!.split(',')[1]);

const WEEK = 22;
const DUE_DATE = 'Nov 14, 2026';
const PROGRESS = Math.round((WEEK / 40) * 100);

const appointments = [
  { id: '1', title: 'Prenatal Checkup', doctor: 'Dr. Tsige Abebe', date: 'Jun 18', time: '10:00 AM', status: 'upcoming' },
  { id: '2', title: 'Blood Panel', doctor: 'Bole Lab', date: 'Jun 25', time: '8:30 AM', status: 'upcoming' },
  { id: '3', title: '20-Week Scan', doctor: 'Dr. Yared', date: 'May 10', time: '9:00 AM', status: 'completed' },
];

const doctors = [
  { id: '1', name: 'Dr. Tsige Abebe', specialty: 'OB/GYN', slots: 3, available: true },
  { id: '2', name: 'Dr. Yared Shimeles', specialty: 'Maternal Health', slots: 1, available: true },
  { id: '3', name: 'Dr. Kenenisa D.', specialty: 'Pediatric', slots: 0, available: false },
];

type Tab = 'overview' | 'schedule' | 'doctors';

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [booked, setBooked] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
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

        {/* ── Sparkline Graph Card ── */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 150 }} style={styles.sparkCard}>
          <View style={styles.sparkHeader}>
            <View>
              <Text style={styles.sparkTitle}>Wellness Score</Text>
              <Text style={styles.sparkSub}>Last 6 weeks</Text>
            </View>
            <View style={styles.sparkBadge}>
              <TrendingUp size={13} color={COLORS.accent} />
              <Text style={styles.sparkBadgeText}>+26 pts</Text>
            </View>
          </View>

          {/* Week labels */}
          <View style={styles.sparkLabels}>
            {['Wk17', 'Wk18', 'Wk19', 'Wk20', 'Wk21', 'Wk22'].map(l => (
              <Text key={l} style={styles.sparkLabel}>{l}</Text>
            ))}
          </View>

          <Svg width={SPARK_W} height={SPARK_H} style={{ marginTop: 2 }}>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((f, i) => (
              <Line key={i} x1={0} y1={SPARK_H * f} x2={SPARK_W} y2={SPARK_H * f} stroke={COLORS.border} strokeWidth={1} />
            ))}
            {/* Line */}
            <Polyline points={sparkPoints} fill="none" stroke={COLORS.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {/* Dot on last point */}
            <Circle cx={lastX} cy={lastY} r={5} fill={COLORS.primary} />
            <Circle cx={lastX} cy={lastY} r={9} fill={COLORS.primary} opacity={0.2} />
            {/* Score label */}
            <SvgText x={lastX - 4} y={lastY - 14} fill={COLORS.white} fontSize={11} fontWeight="700">88</SvgText>
          </Svg>
        </MotiView>

        {/* ── Big + Small card row ── */}
        <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 280 }} style={styles.cardRow}>

          {/* BIG card — pregnancy main info */}
          <LinearGradient colors={['#3A59FF', '#7C3AFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bigCard}>
            <View style={styles.bigCircle1} />
            <View style={styles.bigCircle2} />
            <View style={styles.bigCardBadge}>
              <Heart size={11} color={COLORS.white} />
              <Text style={styles.bigCardBadgeText}>Healthy</Text>
            </View>
            <Text style={styles.bigCardWeekNum}>{WEEK}</Text>
            <Text style={styles.bigCardWeekLabel}>weeks</Text>
            <Text style={styles.bigCardTrimester}>2nd Trimester</Text>
            {/* Mini progress arc indicator */}
            <View style={styles.bigProgressBg}>
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: `${PROGRESS}%` }}
                transition={{ type: 'timing', duration: 1400, delay: 700 }}
                style={styles.bigProgressFill}
              />
            </View>
            <Text style={styles.bigProgressLabel}>{PROGRESS}% complete</Text>
          </LinearGradient>

          {/* SMALL card column */}
          <View style={styles.smallCol}>
            {/* Due date */}
            <View style={styles.smallCard}>
              <Calendar size={16} color={COLORS.primary} />
              <Text style={styles.smallCardValue}>Nov 14</Text>
              <Text style={styles.smallCardLabel}>Due Date</Text>
            </View>
            {/* Weeks left */}
            <View style={[styles.smallCard, { backgroundColor: COLORS.cardAlt }]}>
              <Clock size={16} color={COLORS.warning} />
              <Text style={[styles.smallCardValue, { color: COLORS.warning }]}>{40 - WEEK}</Text>
              <Text style={styles.smallCardLabel}>Wks Left</Text>
            </View>
            {/* Next appt */}
            <View style={[styles.smallCard, { backgroundColor: COLORS.successLight }]}>
              <CheckCircle2 size={16} color={COLORS.accent} />
              <Text style={[styles.smallCardValue, { color: COLORS.accent, fontSize: 13 }]}>Jun 18</Text>
              <Text style={styles.smallCardLabel}>Next Appt</Text>
            </View>
          </View>
        </MotiView>

        {/* ── Reminder banner ── */}
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 380 }} style={styles.reminderBanner}>
          <AlertCircle size={15} color={COLORS.warning} />
          <Text style={styles.reminderText}>Vitamin D due at 8:00 PM  •  Hydration: 45% of daily goal</Text>
        </MotiView>

        {/* ── Bottom info boxes row ── */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 420 }} style={styles.bottomBoxRow}>
          {[
            { label: 'Risk Level', value: 'Low', icon: Activity, color: COLORS.accent, bg: COLORS.successLight },
            { label: 'Visits Done', value: '3', icon: CheckCircle2, color: COLORS.primary, bg: COLORS.primaryLight },
            { label: 'Top Doctor', value: '4.9★', icon: Star, color: COLORS.warning, bg: COLORS.warningLight },
          ].map((box, i) => (
            <MotiView key={box.label} from={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 450 + i * 80, type: 'spring' }} style={[styles.bottomBox, { backgroundColor: box.bg }]}>
              <box.icon size={18} color={box.color} />
              <Text style={[styles.bottomBoxValue, { color: box.color }]}>{box.value}</Text>
              <Text style={styles.bottomBoxLabel}>{box.label}</Text>
            </MotiView>
          ))}
        </MotiView>

        {/* ── Tab Switcher ── */}
        <View style={styles.tabs}>
          {(['overview', 'schedule', 'doctors'] as Tab[]).map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'overview' ? 'Milestones' : t === 'schedule' ? 'Schedule' : 'Doctors'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab Content ── */}
        <AnimatePresence>

          {tab === 'overview' && (
            <MotiView key="overview" from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 280 }}>
              {[
                { week: 20, title: 'Anatomy Scan', desc: "Baby's organs fully visible. All markers normal.", done: true },
                { week: 22, title: 'Sensory Growth', desc: 'Hearing is active. Talk or sing to your baby.', done: true },
                { week: 24, title: 'Lung Development', desc: 'Lungs forming oxygen branches. Stay hydrated.', done: false },
                { week: 28, title: 'Kick Counts Begin', desc: 'Track daily kick counts — aim for 10 per session.', done: false },
              ].map((m, i) => (
                <MotiView key={m.week} from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 70 }} style={styles.milestoneRow}>
                  <View style={[styles.milestoneIcon, { backgroundColor: m.done ? COLORS.successLight : COLORS.primaryLight }]}>
                    {m.done ? <CheckCircle2 size={20} color={COLORS.accent} /> : <Calendar size={20} color={COLORS.primary} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.milestoneTopRow}>
                      <Text style={styles.milestoneTitle}>{m.title}</Text>
                      <Text style={styles.milestoneWk}>Wk {m.week}</Text>
                    </View>
                    <Text style={styles.milestoneDesc}>{m.desc}</Text>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {tab === 'schedule' && (
            <MotiView key="schedule" from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 280 }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Appointments</Text>
                <TouchableOpacity style={styles.newBtn}>
                  <Plus size={13} color={COLORS.primary} />
                  <Text style={styles.newBtnText}>Book New</Text>
                </TouchableOpacity>
              </View>
              {appointments.map((apt, i) => (
                <MotiView key={apt.id} from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 70 }} style={styles.aptCard}>
                  <View style={[styles.aptIcon, { backgroundColor: apt.status === 'completed' ? COLORS.successLight : COLORS.primaryLight }]}>
                    {apt.status === 'completed' ? <CheckCircle2 size={18} color={COLORS.accent} /> : <Clock size={18} color={COLORS.primary} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aptTitle}>{apt.title}</Text>
                    <Text style={styles.aptDoctor}>{apt.doctor}</Text>
                    <Text style={styles.aptTime}>{apt.date}  •  {apt.time}</Text>
                  </View>
                  <View style={[styles.aptBadge, { backgroundColor: apt.status === 'completed' ? COLORS.successLight : COLORS.primaryLight }]}>
                    <Text style={[styles.aptBadgeText, { color: apt.status === 'completed' ? COLORS.accent : COLORS.primary }]}>
                      {apt.status === 'completed' ? 'Done' : 'Soon'}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {tab === 'doctors' && (
            <MotiView key="doctors" from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 280 }}>
              <Text style={[styles.sectionTitle, { marginBottom: SPACING.md }]}>Available Specialists</Text>
              {doctors.map((doc, i) => (
                <MotiView key={doc.id} from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 70 }} style={styles.doctorCard}>
                  <View style={[styles.docAvatar, { backgroundColor: doc.available ? COLORS.successLight : COLORS.cardAlt }]}>
                    <Stethoscope size={20} color={doc.available ? COLORS.accent : COLORS.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docSpec}>{doc.specialty}</Text>
                    <Text style={styles.docSlots}>
                      {doc.available ? `${doc.slots} slot${doc.slots !== 1 ? 's' : ''} left` : 'Fully booked'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setBooked(doc.id)}
                    disabled={booked === doc.id}
                    style={[styles.bookBtn, !doc.available && styles.bookBtnOff]}
                  >
                    <Text style={[styles.bookBtnText, !doc.available && { color: COLORS.textMuted }]}>
                      {booked === doc.id ? '✓' : doc.available ? 'Book' : 'Wait'}
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

const BIG_W = (INNER - 10) * 0.52;
const SMALL_W = (INNER - 10) * 0.46;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: CARD_PAD, paddingTop: Platform.OS === 'ios' ? 58 : 38, paddingBottom: 110 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  welcomeText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  userName: { fontSize: 21, fontWeight: '800', color: COLORS.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 38, height: 38, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: COLORS.white, fontWeight: '800', fontSize: 15 },

  // Sparkline card
  sparkCard: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  sparkHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sparkTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  sparkSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  sparkBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, gap: 4 },
  sparkBadgeText: { fontSize: 11, color: COLORS.accent, fontWeight: '800' },
  sparkLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  sparkLabel: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600' },

  // Big + small row
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },

  bigCard: { width: BIG_W, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, overflow: 'hidden', justifyContent: 'flex-end', minHeight: 190, ...SHADOWS.medium },
  bigCircle1: { position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.07)', top: -28, right: -22 },
  bigCircle2: { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.05)', top: 16, right: 50 },
  bigCardBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, gap: 5, marginBottom: SPACING.sm },
  bigCardBadgeText: { fontSize: 11, color: COLORS.white, fontWeight: '700' },
  bigCardWeekNum: { fontSize: 52, fontWeight: '900', color: COLORS.white, lineHeight: 56, letterSpacing: -2 },
  bigCardWeekLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: -4, marginBottom: SPACING.sm },
  bigCardTrimester: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginBottom: SPACING.md },
  bigProgressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  bigProgressFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 3 },
  bigProgressLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '700' },

  smallCol: { width: SMALL_W, gap: 8, justifyContent: 'space-between' },
  smallCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, gap: 2 },
  smallCardValue: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginTop: 2 },
  smallCardLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },

  // Reminder
  reminderBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warningLight, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: 10, marginBottom: SPACING.md, gap: 8, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  reminderText: { flex: 1, fontSize: 11, color: COLORS.warning, fontWeight: '600' },

  // Bottom info boxes
  bottomBoxRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.xl },
  bottomBox: { flex: 1, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.border },
  bottomBoxValue: { fontSize: 17, fontWeight: '900' },
  bottomBoxLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },

  // Tabs
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, padding: 4, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  tabBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: BORDER_RADIUS.sm },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  milestoneRow: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, gap: 12, alignItems: 'center' },
  milestoneIcon: { width: 42, height: 42, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  milestoneTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  milestoneTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  milestoneWk: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  milestoneDesc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 17 },

  aptCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, gap: 12, alignItems: 'center' },
  aptIcon: { width: 42, height: 42, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  aptTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  aptDoctor: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 1 },
  aptTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  aptBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  aptBadgeText: { fontSize: 10, fontWeight: '800' },

  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  docAvatar: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  docName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  docSpec: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  docSlots: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  bookBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BORDER_RADIUS.md },
  bookBtnOff: { backgroundColor: COLORS.cardAlt },
  bookBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
});
