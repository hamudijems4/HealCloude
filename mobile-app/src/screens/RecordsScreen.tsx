import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Svg, Polyline, Circle, Line } from 'react-native-svg';
import { FileText, Microscope, Eye, ChevronRight, Calendar, Search, X, Download, Share2, Clock, ShieldCheck, Activity, Lock, TrendingUp, AlertCircle } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width, height } = Dimensions.get('window');
const PAD = SPACING.lg;
const INNER = width - PAD * 2;
const BIG_W = (INNER - 10) * 0.54;
const SM_W = (INNER - 10) * 0.44;

// Sparkline — lab values trend (Hemoglobin g/dL over 6 months)
const HB_DATA = [11.2, 11.8, 12.0, 11.6, 12.3, 12.5];
const SP_W = BIG_W - 24;
const SP_H = 48;
const hbPoints = HB_DATA.map((v, i) => {
  const x = (i / (HB_DATA.length - 1)) * (SP_W - 8) + 4;
  const y = SP_H - ((v - 10.5) / 2.5) * (SP_H - 10) - 4;
  return `${x},${y}`;
}).join(' ');
const lastPt = hbPoints.split(' ').pop()!.split(',');
const lx = parseFloat(lastPt[0]);
const ly = parseFloat(lastPt[1]);

interface Doc {
  id: string; title: string; type: 'scan' | 'lab' | 'note';
  date: string; provider: string; status: 'Normal' | 'Monitor' | 'Routine'; summary: string;
}

const DOCS: Doc[] = [
  { id: '1', title: '22-Week Fetal Ultrasound', type: 'scan', date: 'Jun 05, 2026', provider: 'Dr. Tsige Abebe • Tikur Anbessa', status: 'Normal', summary: 'Healthy fetal heartbeat. Skeletal measurements standard for 22 weeks. Amniotic fluid normal.' },
  { id: '2', title: 'Maternal Blood Panel', type: 'lab', date: 'May 12, 2026', provider: 'Bole Clinical Laboratory', status: 'Routine', summary: 'Glucose: 90 mg/dL. Hemoglobin: 12.5 g/dL. Iron stable. CBC within normal range.' },
  { id: '3', title: 'First Trimester Consultation', type: 'note', date: 'Mar 10, 2026', provider: 'St. Paul Millennium Hospital', status: 'Routine', summary: 'BP: 110/70 mmHg. Weight: 58 kg. Prescribed folic acid 400mcg + iron daily.' },
];

const TIMELINE = [
  { id: 'a', date: 'Jun 05, 2026', title: 'Prenatal Scan + Vitals', provider: 'Tikur Anbessa Hospital', outcome: 'Healthy heartbeat. Skeletal on track. Vitals stable.', icon: Eye },
  { id: 'b', date: 'May 12, 2026', title: 'Routine Blood Screening', provider: 'Bole Clinical Laboratory', outcome: 'Hemoglobin normal. Iron confirmed.', icon: Microscope },
  { id: 'c', date: 'Mar 10, 2026', title: 'First Trimester Consult', provider: 'St. Paul Millennium Hospital', outcome: 'BP 110/70. Prenatal vitamins started.', icon: Activity },
];

const FILTERS = [
  { id: 'all', label: 'All Files' },
  { id: 'scan', label: 'Ultrasounds' },
  { id: 'lab', label: 'Lab Panels' },
  { id: 'note', label: 'Dr. Notes' },
] as const;

type Filter = typeof FILTERS[number]['id'];
type ViewMode = 'vault' | 'timeline';

const TYPE_COLORS: Record<string, string> = { scan: '#6C63FF', lab: '#10B981', note: '#F59E0B' };
const TYPE_ICONS = { scan: Eye, lab: Microscope, note: FileText };

export default function RecordsScreen() {
  const [view, setView] = useState<ViewMode>('vault');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Doc | null>(null);

  const filtered = DOCS.filter(d => filter === 'all' || d.type === filter);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <MotiView from={{ opacity: 0, translateY: -14 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
          <View>
            <Text style={styles.headerSub}>🔒 Fayda ID Verified</Text>
            <Text style={styles.headerTitle}>Health Vault</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={19} color={COLORS.primary} />
          </TouchableOpacity>
        </MotiView>

        {/* ── BIG card + SMALL column row ── */}
        <MotiView from={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 160, type: 'spring' }} style={styles.topRow}>

          {/* BIG gradient card */}
          <LinearGradient colors={['#3A59FF', '#7C3AFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bigCard}>
            <View style={styles.bigCircle1} />
            <View style={styles.bigCircle2} />

            {/* Shield badge */}
            <View style={styles.bigBadge}>
              <ShieldCheck size={12} color={COLORS.white} />
              <Text style={styles.bigBadgeText}>Secured</Text>
            </View>

            {/* Doc count */}
            <Text style={styles.bigCount}>3</Text>
            <Text style={styles.bigCountLabel}>Documents</Text>

            {/* Mini sparkline — Hb trend */}
            <View style={styles.sparkWrap}>
              <Text style={styles.sparkTitle}>Hb Trend</Text>
              <Svg width={SP_W} height={SP_H}>
                {[0.33, 0.66].map((f, i) => (
                  <Line key={i} x1={0} y1={SP_H * f} x2={SP_W} y2={SP_H * f} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                ))}
                <Polyline points={hbPoints} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                <Circle cx={lx} cy={ly} r={4} fill={COLORS.white} />
                <Circle cx={lx} cy={ly} r={8} fill={COLORS.white} opacity={0.2} />
              </Svg>
              <View style={styles.sparkFooter}>
                <Text style={styles.sparkVal}>12.5 g/dL</Text>
                <View style={styles.sparkUp}>
                  <TrendingUp size={10} color={COLORS.accent} />
                  <Text style={styles.sparkUpText}>+11%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* SMALL column — 3 stacked cards */}
          <View style={styles.smallCol}>
            {[
              { label: 'Hospitals', value: '3', color: COLORS.primary, bg: COLORS.primaryLight, icon: AlertCircle },
              { label: 'Scans', value: '1', color: '#6C63FF', bg: 'rgba(108,99,255,0.15)', icon: Eye },
              { label: 'Lab Tests', value: '1', color: COLORS.accent, bg: COLORS.successLight, icon: Microscope },
            ].map((s, i) => (
              <MotiView key={s.label} from={{ opacity: 0, translateX: 16 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 280 + i * 80 }} style={[styles.smallCard, { backgroundColor: s.bg }]}>
                <s.icon size={15} color={s.color} />
                <Text style={[styles.smallVal, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.smallLabel}>{s.label}</Text>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* ── Bottom 3 info boxes ── */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 340 }} style={styles.boxRow}>
          {[
            { label: 'Last Visit', value: 'Jun 05', color: COLORS.primary, bg: COLORS.primaryLight },
            { label: 'Next Due', value: 'Jun 18', color: COLORS.warning, bg: COLORS.warningLight },
            { label: 'Encryption', value: 'E2E ✓', color: COLORS.accent, bg: COLORS.successLight },
          ].map((b, i) => (
            <MotiView key={b.label} from={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 380 + i * 70, type: 'spring' }} style={[styles.infoBox, { backgroundColor: b.bg }]}>
              <Text style={[styles.infoBoxVal, { color: b.color }]}>{b.value}</Text>
              <Text style={styles.infoBoxLabel}>{b.label}</Text>
            </MotiView>
          ))}
        </MotiView>

        {/* ── Tab switcher ── */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setView('vault')} style={[styles.tab, view === 'vault' && styles.tabActive]}>
            <FileText size={15} color={view === 'vault' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.tabText, view === 'vault' && styles.tabTextActive]}>Vault</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('timeline')} style={[styles.tab, view === 'timeline' && styles.tabActive]}>
            <Calendar size={15} color={view === 'timeline' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.tabText, view === 'timeline' && styles.tabTextActive]}>Timeline</Text>
          </TouchableOpacity>
        </View>

        <AnimatePresence>

          {/* ── VAULT ── */}
          {view === 'vault' && (
            <MotiView key="vault" from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 280 }}>
              {/* Filter pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {FILTERS.map(f => (
                  <TouchableOpacity key={f.id} onPress={() => setFilter(f.id)} style={[styles.pill, filter === f.id && styles.pillActive]}>
                    <Text style={[styles.pillText, filter === f.id && styles.pillTextActive]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Doc cards — first one is FEATURED large card */}
              {filtered.map((doc, i) => {
                const Icon = TYPE_ICONS[doc.type];
                const accent = TYPE_COLORS[doc.type];
                if (i === 0) return (
                  <MotiView key={doc.id} from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
                    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.featuredCard}>
                      <View style={styles.featuredCircle} />
                      <View style={styles.featuredTop}>
                        <View style={[styles.featuredIcon, { backgroundColor: `${accent}25` }]}>
                          <Icon size={24} color={accent} />
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: `${doc.status === 'Normal' ? COLORS.accent : COLORS.warning}20` }]}>
                          <Text style={[styles.statusText, { color: doc.status === 'Normal' ? COLORS.accent : COLORS.warning }]}>{doc.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.featuredTitle}>{doc.title}</Text>
                      <Text style={styles.featuredProvider}>{doc.provider}</Text>
                      <Text style={styles.featuredSummary} numberOfLines={2}>{doc.summary}</Text>
                      <View style={styles.featuredFooter}>
                        <View style={styles.featuredDateRow}>
                          <Clock size={12} color="rgba(255,255,255,0.5)" />
                          <Text style={styles.featuredDate}>{doc.date}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setSelected(doc)} style={styles.featuredBtn}>
                          <Text style={styles.featuredBtnText}>View</Text>
                          <ChevronRight size={14} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </MotiView>
                );
                return (
                  <MotiView key={doc.id} from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 + i * 70 }} style={styles.docCard}>
                    <View style={[styles.docIcon, { backgroundColor: `${accent}18` }]}>
                      <Icon size={20} color={accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docTitle} numberOfLines={1}>{doc.title}</Text>
                      <Text style={styles.docProvider} numberOfLines={1}>{doc.provider}</Text>
                      <View style={styles.docMetaRow}>
                        <Clock size={10} color={COLORS.textMuted} />
                        <Text style={styles.docDate}>{doc.date}</Text>
                      </View>
                    </View>
                    <View style={styles.docRight}>
                      <View style={[styles.statusBadge, { backgroundColor: `${doc.status === 'Normal' ? COLORS.accent : COLORS.warning}18` }]}>
                        <Text style={[styles.statusText, { color: doc.status === 'Normal' ? COLORS.accent : COLORS.warning }]}>{doc.status}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelected(doc)} style={styles.docViewBtn}>
                        <ChevronRight size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </MotiView>
                );
              })}
            </MotiView>
          )}

          {/* ── TIMELINE ── */}
          {view === 'timeline' && (
            <MotiView key="timeline" from={{ opacity: 0, translateX: 10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 280 }}>
              {TIMELINE.map((e, i) => (
                <View key={e.id} style={styles.tlItem}>
                  <View style={styles.tlLeft}>
                    <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 200 + i * 100, type: 'spring' }} style={styles.tlNode}>
                      <e.icon size={13} color={COLORS.white} />
                    </MotiView>
                    {i < TIMELINE.length - 1 && <View style={styles.tlLine} />}
                  </View>
                  <MotiView from={{ opacity: 0, translateX: 14 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 280 + i * 100 }} style={styles.tlCard}>
                    <Text style={styles.tlDate}>{e.date}</Text>
                    <Text style={styles.tlTitle}>{e.title}</Text>
                    <Text style={styles.tlProvider}>{e.provider}</Text>
                    <View style={styles.tlOutcome}>
                      <Text style={styles.tlOutcomeText}>{e.outcome}</Text>
                    </View>
                  </MotiView>
                </View>
              ))}
            </MotiView>
          )}

        </AnimatePresence>
      </ScrollView>

      {/* ── Document Modal ── */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.overlay}>
          <MotiView from={{ translateY: height }} animate={{ translateY: 0 }} transition={{ type: 'spring', damping: 22 }} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <TouchableOpacity style={styles.sheetClose} onPress={() => setSelected(null)}>
              <X size={20} color={COLORS.text} />
            </TouchableOpacity>
            {selected && (
              <ScrollView contentContainerStyle={styles.sheetBody}>
                {/* Modal header gradient */}
                <LinearGradient colors={['#3A59FF', '#7C3AFF']} style={styles.modalBanner}>
                  <View style={styles.modalBannerCircle} />
                  <ShieldCheck size={32} color="rgba(255,255,255,0.6)" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalBannerTitle}>{selected.title}</Text>
                    <Text style={styles.modalBannerSub}>{selected.date}  •  {selected.provider}</Text>
                  </View>
                </LinearGradient>

                {/* Report body */}
                <View style={styles.reportCard}>
                  <Text style={styles.reportSectionLabel}>Summary & Findings</Text>
                  <Text style={styles.reportText}>{selected.summary}</Text>
                  <View style={styles.reportDivider} />
                  {[
                    ['Status', selected.status],
                    ['Verification', 'Fayda ID Verified ✓'],
                    ['Encryption', 'E2E Encrypted'],
                    ['Standard', 'HL7 FHIR R4'],
                  ].map(([k, v]) => (
                    <View key={k} style={styles.reportRow}>
                      <Text style={styles.reportKey}>{k}</Text>
                      <Text style={[styles.reportVal, k === 'Status' && { color: selected.status === 'Normal' ? COLORS.accent : COLORS.warning }]}>{v}</Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.actionPrimary}>
                    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionGradient}>
                      <Download size={18} color={COLORS.white} />
                      <Text style={styles.actionPrimaryText}>Download PDF</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionSecondary}>
                    <Share2 size={18} color={COLORS.primary} />
                    <Text style={styles.actionSecondaryText}>Share Securely</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </MotiView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: PAD, paddingTop: Platform.OS === 'ios' ? 58 : 38, paddingBottom: 110 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  headerSub: { fontSize: 11, color: COLORS.accent, fontWeight: '700', marginBottom: 3 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, letterSpacing: -0.5 },
  searchBtn: { width: 42, height: 42, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },

  // Top row
  topRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },

  // Big card
  bigCard: { width: BIG_W, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, overflow: 'hidden', minHeight: 200, ...SHADOWS.medium },
  bigCircle1: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.07)', top: -25, right: -20 },
  bigCircle2: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.05)', top: 30, right: 55 },
  bigBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, gap: 4, marginBottom: SPACING.sm },
  bigBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: '700' },
  bigCount: { fontSize: 48, fontWeight: '900', color: COLORS.white, lineHeight: 52, letterSpacing: -2 },
  bigCountLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: SPACING.md },
  sparkWrap: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: BORDER_RADIUS.md, padding: SPACING.sm },
  sparkTitle: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  sparkFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sparkVal: { fontSize: 11, color: COLORS.white, fontWeight: '800' },
  sparkUp: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sparkUpText: { fontSize: 10, color: COLORS.accent, fontWeight: '700' },

  // Small column
  smallCol: { width: SM_W, gap: 8 },
  smallCard: { flex: 1, borderRadius: BORDER_RADIUS.lg, padding: SPACING.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, gap: 3 },
  smallVal: { fontSize: 18, fontWeight: '900' },
  smallLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },

  // Bottom boxes
  boxRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  infoBox: { flex: 1, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, gap: 3 },
  infoBoxVal: { fontSize: 14, fontWeight: '900' },
  infoBoxLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },

  // Tabs
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, padding: 4, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BORDER_RADIUS.sm, gap: 6 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },

  // Filter pills
  filterScroll: { marginHorizontal: -PAD, paddingHorizontal: PAD, marginBottom: SPACING.md },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.card, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  pillActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  pillText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  pillTextActive: { color: COLORS.primary },

  // Featured (first) doc card
  featuredCard: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: 10, overflow: 'hidden', ...SHADOWS.medium },
  featuredCircle: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(108,99,255,0.12)', top: -40, right: -30 },
  featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  featuredIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  featuredTitle: { fontSize: 16, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  featuredProvider: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginBottom: SPACING.sm },
  featuredSummary: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 19, marginBottom: SPACING.md },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: SPACING.sm },
  featuredDateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  featuredDate: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  featuredBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: BORDER_RADIUS.full, gap: 4 },
  featuredBtnText: { fontSize: 12, color: COLORS.white, fontWeight: '700' },

  // Regular doc card
  docCard: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', gap: 12 },
  docIcon: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  docTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  docProvider: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginBottom: 3 },
  docMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docDate: { fontSize: 11, color: COLORS.textMuted },
  docRight: { alignItems: 'flex-end', gap: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  statusText: { fontSize: 10, fontWeight: '800' },
  docViewBtn: { width: 28, height: 28, backgroundColor: COLORS.primaryLight, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  // Timeline
  tlItem: { flexDirection: 'row', marginBottom: SPACING.xl },
  tlLeft: { alignItems: 'center', marginRight: SPACING.md, width: 30 },
  tlNode: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  tlLine: { position: 'absolute', top: 30, bottom: -SPACING.xl, width: 2, backgroundColor: COLORS.border },
  tlCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tlDate: { fontSize: 11, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
  tlTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  tlProvider: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },
  tlOutcome: { backgroundColor: COLORS.cardAlt, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  tlOutcomeText: { fontSize: 12, color: COLORS.textSub, lineHeight: 17 },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, height: height * 0.86, borderWidth: 1, borderColor: COLORS.border },
  sheetHandle: { width: 40, height: 5, backgroundColor: COLORS.border, borderRadius: 3, alignSelf: 'center', marginTop: SPACING.md },
  sheetClose: { position: 'absolute', right: SPACING.lg, top: SPACING.md, zIndex: 10 },
  sheetBody: { padding: SPACING.lg, paddingTop: SPACING.xl },
  modalBanner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: SPACING.lg, borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.lg, overflow: 'hidden' },
  modalBannerCircle: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.07)', right: -20, top: -20 },
  modalBannerTitle: { fontSize: 15, fontWeight: '800', color: COLORS.white, marginBottom: 3 },
  modalBannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  reportCard: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  reportSectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm },
  reportText: { fontSize: 14, color: COLORS.textSub, lineHeight: 21, marginBottom: SPACING.lg },
  reportDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.lg },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  reportKey: { fontSize: 13, color: COLORS.textMuted },
  reportVal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  modalActions: { gap: SPACING.md },
  actionPrimary: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
  actionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, gap: SPACING.sm },
  actionPrimaryText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  actionSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BORDER_RADIUS.lg, backgroundColor: COLORS.primaryLight, gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  actionSecondaryText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
});
