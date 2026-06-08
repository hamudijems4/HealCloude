import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { FileText, Microscope, Eye, ChevronRight, Calendar, Search, X, Download, Share2, Clock, ShieldCheck, Activity } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { height } = Dimensions.get('window');

interface Doc { id: string; title: string; type: 'scan' | 'lab' | 'note'; date: string; provider: string; status: 'Normal' | 'Monitor' | 'Routine'; summary: string; }

const DOCS: Doc[] = [
  { id: '1', title: '22-Week Fetal Ultrasound Scan', type: 'scan', date: 'Jun 05, 2026', provider: 'Dr. Tsige Abebe • Tikur Anbessa', status: 'Normal', summary: 'Healthy fetal heartbeat confirmed. Skeletal measurements standard for 22 weeks. Amniotic fluid levels normal.' },
  { id: '2', title: 'Maternal Blood Panel', type: 'lab', date: 'May 12, 2026', provider: 'Bole Clinical Laboratory', status: 'Routine', summary: 'Glucose: 90 mg/dL (Normal). Hemoglobin: 12.5 g/dL. Iron stable. CBC within normal range.' },
  { id: '3', title: 'First Trimester Intake Consultation', type: 'note', date: 'Mar 10, 2026', provider: 'St. Paul Millennium Hospital', status: 'Routine', summary: 'BP: 110/70 mmHg. Weight: 58 kg. Prescribed folic acid 400mcg + iron supplements daily.' },
];

const TIMELINE = [
  { id: 'a', date: 'Jun 05, 2026', title: 'Prenatal Scan + Vitals', provider: 'Dr. Tsige Abebe • Tikur Anbessa Hospital', outcome: 'Healthy heartbeat. Skeletal development on track. Vitals stable.', icon: Eye },
  { id: 'b', date: 'May 12, 2026', title: 'Routine Blood Screening', provider: 'Bole Clinical Laboratory', outcome: 'Hemoglobin normal. Iron supplement dosage confirmed.', icon: Microscope },
  { id: 'c', date: 'Mar 10, 2026', title: 'First Trimester Consult', provider: 'St. Paul Millennium Hospital', outcome: 'BP 110/70. Started prenatal vitamins protocol.', icon: Activity },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Files' },
  { id: 'scan', label: 'Ultrasounds' },
  { id: 'lab', label: 'Lab Panels' },
  { id: 'note', label: 'Dr. Notes' },
] as const;

type Filter = typeof FILTER_OPTIONS[number]['id'];
type ViewMode = 'vault' | 'timeline';

export default function RecordsScreen() {
  const [view, setView] = useState<ViewMode>('vault');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Doc | null>(null);

  const filtered = DOCS.filter(d => filter === 'all' || d.type === filter);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <MotiView from={{ opacity: 0, translateY: -16 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Fayda ID Verified</Text>
            <Text style={styles.headerTitle}>Health Vault</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </MotiView>

        {/* Stats Row */}
        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 200 }} style={styles.statsRow}>
          {[{ label: 'Documents', value: '3', color: COLORS.primary }, { label: 'Hospitals', value: '3', color: COLORS.accent }, { label: 'This Year', value: '2026', color: COLORS.warning }].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </MotiView>

        {/* Tab Switcher */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setView('vault')} style={[styles.tab, view === 'vault' && styles.tabActive]}>
            <FileText size={16} color={view === 'vault' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.tabText, view === 'vault' && styles.tabTextActive]}>Vault</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setView('timeline')} style={[styles.tab, view === 'timeline' && styles.tabActive]}>
            <Calendar size={16} color={view === 'timeline' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.tabText, view === 'timeline' && styles.tabTextActive]}>Timeline</Text>
          </TouchableOpacity>
        </View>

        <AnimatePresence>
          {view === 'vault' && (
            <MotiView key="vault" from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
              {/* Filter Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {FILTER_OPTIONS.map(f => (
                  <TouchableOpacity key={f.id} onPress={() => setFilter(f.id)} style={[styles.pill, filter === f.id && styles.pillActive]}>
                    <Text style={[styles.pillText, filter === f.id && styles.pillTextActive]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Doc Cards */}
              {filtered.map((doc, i) => (
                <MotiView key={doc.id} from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 80 }} style={styles.docCard}>
                  <View style={styles.docCardTop}>
                    <View style={styles.docIcon}>
                      {doc.type === 'scan' ? <Eye size={22} color={COLORS.primary} /> : doc.type === 'lab' ? <Microscope size={22} color={COLORS.primary} /> : <FileText size={22} color={COLORS.primary} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docTitle} numberOfLines={1}>{doc.title}</Text>
                      <View style={styles.docMetaRow}>
                        <Clock size={11} color={COLORS.textMuted} />
                        <Text style={styles.docDate}>{doc.date}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: doc.status === 'Normal' ? COLORS.successLight : COLORS.warningLight }]}>
                      <Text style={[styles.statusText, { color: doc.status === 'Normal' ? COLORS.accent : COLORS.warning }]}>{doc.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.docSummary} numberOfLines={2}>{doc.summary}</Text>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => setSelected(doc)}>
                    <Text style={styles.viewBtnText}>View Report</Text>
                    <ChevronRight size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </MotiView>
              ))}
            </MotiView>
          )}

          {view === 'timeline' && (
            <MotiView key="timeline" from={{ opacity: 0, translateX: 12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300 }}>
              {TIMELINE.map((e, i) => (
                <View key={e.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 200 + i * 100, type: 'spring' }} style={styles.timelineNode}>
                      <e.icon size={14} color={COLORS.white} />
                    </MotiView>
                    {i < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <MotiView from={{ opacity: 0, translateX: 16 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300 + i * 100 }} style={styles.timelineCard}>
                    <Text style={styles.timelineDate}>{e.date}</Text>
                    <Text style={styles.timelineTitle}>{e.title}</Text>
                    <Text style={styles.timelineProvider}>{e.provider}</Text>
                    <View style={styles.outcomeBox}>
                      <Text style={styles.outcomeText}>{e.outcome}</Text>
                    </View>
                  </MotiView>
                </View>
              ))}
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>

      {/* Document Modal */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <MotiView from={{ translateY: height }} animate={{ translateY: 0 }} transition={{ type: 'spring', damping: 20 }} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
              <X size={22} color={COLORS.text} />
            </TouchableOpacity>
            {selected && (
              <ScrollView contentContainerStyle={styles.modalBody}>
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <View style={styles.modalMeta}>
                  <Calendar size={13} color={COLORS.textMuted} />
                  <Text style={styles.modalMetaText}>{selected.date}</Text>
                  <Text style={styles.modalMetaSep}>•</Text>
                  <Text style={styles.modalMetaText}>{selected.provider}</Text>
                </View>
                <LinearGradient colors={['#1a1936', '#2d2d5e']} style={styles.reportBanner}>
                  <ShieldCheck size={28} color={COLORS.white} opacity={0.8} />
                  <Text style={styles.reportBannerText}>Official Medical Report</Text>
                </LinearGradient>
                <View style={styles.reportBody}>
                  <Text style={styles.reportLabel}>Summary & Findings</Text>
                  <Text style={styles.reportText}>{selected.summary}</Text>
                  <View style={styles.reportDivider} />
                  {[['Verification', 'Fayda ID Verified ✓'], ['Encryption', 'E2E Encrypted'], ['Status', selected.status]].map(([k, v]) => (
                    <View key={k} style={styles.reportRow}>
                      <Text style={styles.reportKey}>{k}</Text>
                      <Text style={styles.reportVal}>{v}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}>
                    <Download size={18} color={COLORS.white} />
                    <Text style={styles.actionBtnText}>Download PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: COLORS.border }]}>
                    <Share2 size={18} color={COLORS.primary} />
                    <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Share Securely</Text>
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
  scroll: { padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  headerSub: { fontSize: 12, color: COLORS.accent, fontWeight: '700', marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  searchBtn: { width: 44, height: 44, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.xl },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, padding: 4, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: BORDER_RADIUS.sm, gap: 6 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },
  filterScroll: { marginHorizontal: -SPACING.lg, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.card, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  pillActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  pillText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  pillTextActive: { color: COLORS.primary },
  docCard: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  docCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: 12 },
  docIcon: { width: 48, height: 48, backgroundColor: COLORS.primaryLight, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  docTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  docMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docDate: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full },
  statusText: { fontSize: 10, fontWeight: '800' },
  docSummary: { fontSize: 13, color: COLORS.textMuted, lineHeight: 19, marginBottom: SPACING.md },
  viewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 4 },
  viewBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  timelineItem: { flexDirection: 'row', marginBottom: SPACING.xl },
  timelineLeft: { alignItems: 'center', marginRight: SPACING.lg, width: 32 },
  timelineNode: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  timelineLine: { position: 'absolute', top: 32, bottom: -SPACING.xl, width: 2, backgroundColor: COLORS.border },
  timelineCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  timelineDate: { fontSize: 11, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  timelineTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  timelineProvider: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },
  outcomeBox: { backgroundColor: COLORS.cardAlt, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  outcomeText: { fontSize: 12, color: COLORS.textSub, lineHeight: 17 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, height: height * 0.85, borderWidth: 1, borderColor: COLORS.border },
  modalHandle: { width: 40, height: 5, backgroundColor: COLORS.border, borderRadius: 3, alignSelf: 'center', marginTop: SPACING.md },
  modalClose: { position: 'absolute', right: SPACING.lg, top: SPACING.md },
  modalBody: { padding: SPACING.lg, paddingTop: SPACING.xl },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  modalMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.xl },
  modalMetaText: { fontSize: 12, color: COLORS.textMuted },
  modalMetaSep: { color: COLORS.textMuted },
  reportBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginBottom: 0 },
  reportBannerText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  reportBody: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  reportLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  reportText: { fontSize: 14, color: COLORS.textSub, lineHeight: 21, marginBottom: SPACING.lg },
  reportDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.lg },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  reportKey: { fontSize: 13, color: COLORS.textMuted },
  reportVal: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  modalActions: { gap: SPACING.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: BORDER_RADIUS.md, gap: SPACING.sm },
  actionBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
