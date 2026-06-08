import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { 
  FileText, 
  Activity, 
  Microscope, 
  ChevronRight, 
  Calendar, 
  Search, 
  X,
  Eye,
  Download,
  Share2,
  Clock,
  ShieldCheck
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width, height } = Dimensions.get('window');

interface DocRecord {
  id: string;
  title: string;
  type: 'scan' | 'lab' | 'note';
  date: string;
  provider: string;
  status: 'Normal' | 'Monitor' | 'Routine';
  summary: string;
  fileMockType: 'ultrasound' | 'report';
}

const mockVaultDocs: DocRecord[] = [
  { id: '1', title: '22-Week Fetal Ultrasound Scan', type: 'scan', date: 'Jun 05, 2026', provider: 'Dr. Tsige Abebe • Tikur Anbessa', status: 'Normal', summary: 'Ultrasound shows healthy fetal heartbeat and standard skeletal measurements for 22 weeks.', fileMockType: 'ultrasound' },
  { id: '2', title: 'Maternal Blood Panel Result', type: 'lab', date: 'May 12, 2026', provider: 'Bole Clinical Laboratory', status: 'Routine', summary: 'Glucose: 90 mg/dL (Normal). Hemoglobin: 12.5 g/dL. Iron levels stable.', fileMockType: 'report' },
  { id: '3', title: 'First Trimester Intake Consultation', type: 'note', date: 'Mar 10, 2026', provider: 'St. Paul Millennium Hospital', status: 'Routine', summary: 'Intake consultation complete. Normal blood pressure. Prescribed daily folic acid and iron supplements.', fileMockType: 'report' }
];

const mockTimelineEvents = [
  { id: 'a', date: 'Jun 05, 2026', title: 'Prenatal Scan & Vitals check', provider: 'Dr. Tsige Abebe • Tikur Anbessa Hospital', outcome: 'Healthy heartbeat, standard skeletal development. Vitals stable.', icon: FileText },
  { id: 'b', date: 'May 12, 2026', title: 'Routine Maternal Blood Screening', provider: 'Bole Clinical Laboratory', outcome: 'Hemoglobin levels normal. Supplement dosage confirmed.', icon: Microscope },
  { id: 'c', date: 'Mar 10, 2026', title: 'First Trimester Consult & Supplementation', provider: 'St. Paul Millennium Hospital', outcome: 'BP: 110/70. Prescribed prenatal vitamins.', icon: Activity }
];

export default function RecordsScreen() {
  const [activeView, setActiveView] = useState<'vault' | 'timeline'>('vault');
  const [selectedDoc, setSelectedDoc] = useState<DocRecord | null>(null);
  const [filter, setFilter] = useState<'all' | 'scan' | 'lab' | 'note'>('all');

  const filteredDocs = mockVaultDocs.filter(d => filter === 'all' || d.type === filter);

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[COLORS.primaryLight, COLORS.background]} 
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Health Vault</Text>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </MotiView>

        {/* View Switcher */}
        <MotiView 
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={styles.tabContainer}
        >
          <TouchableOpacity 
            style={[styles.tab, activeView === 'vault' && styles.activeTab]}
            onPress={() => setActiveView('vault')}
          >
            <FileText size={18} color={activeView === 'vault' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.tabText, activeView === 'vault' && styles.activeTabText]}>Vault</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeView === 'timeline' && styles.activeTab]}
            onPress={() => setActiveView('timeline')}
          >
            <Calendar size={18} color={activeView === 'timeline' ? COLORS.white : COLORS.textMuted} />
            <Text style={[styles.tabText, activeView === 'timeline' && styles.activeTabText]}>Timeline</Text>
          </TouchableOpacity>
        </MotiView>

        <AnimatePresence>
          {activeView === 'vault' ? (
            <MotiView 
              key="vault"
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: 20 }}
              transition={{ type: 'timing', duration: 400 }}
            >
              {/* Filters */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {([
                  { id: 'all', title: 'All Files' },
                  { id: 'scan', title: 'Ultrasounds' },
                  { id: 'lab', title: 'Lab Panels' },
                  { id: 'note', title: 'Doctor Notes' }
                ] as const).map((item, index) => (
                  <MotiView
                    key={item.id}
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 300 + (index * 100) }}
                  >
                    <TouchableOpacity
                      onPress={() => setFilter(item.id)}
                      style={[styles.filterPill, filter === item.id && styles.filterPillActive]}
                    >
                      <Text style={[styles.filterPillText, filter === item.id && styles.filterPillTextActive]}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </MotiView>
                ))}
              </ScrollView>

              {/* Document Cards */}
              <View style={styles.docsList}>
                {filteredDocs.map((doc, index) => (
                  <MotiView 
                    key={doc.id}
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 400 + (index * 100) }}
                    style={styles.docCard}
                  >
                    <View style={styles.docCardHeader}>
                      <View style={[styles.docIconContainer, { backgroundColor: COLORS.primaryLight }]}>
                        {doc.type === 'scan' ? <Eye size={24} color={COLORS.primary} /> : 
                         doc.type === 'lab' ? <Microscope size={24} color={COLORS.primary} /> : 
                         <FileText size={24} color={COLORS.primary} />}
                      </View>
                      <View style={styles.docMeta}>
                        <Text style={styles.docTitle} numberOfLines={1}>{doc.title}</Text>
                        <View style={styles.docSubtitleRow}>
                          <Clock size={12} color={COLORS.textMuted} />
                          <Text style={styles.docDate}>{doc.date}</Text>
                        </View>
                      </View>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: doc.status === 'Normal' ? COLORS.successLight : COLORS.warningLight }
                      ]}>
                        <Text style={[
                          styles.statusText, 
                          { color: doc.status === 'Normal' ? COLORS.accent : COLORS.warning }
                        ]}>{doc.status}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.docSummary} numberOfLines={2}>{doc.summary}</Text>
                    
                    <TouchableOpacity 
                      style={styles.viewBtn}
                      onPress={() => setSelectedDoc(doc)}
                    >
                      <Text style={styles.viewBtnText}>View Report</Text>
                      <ChevronRight size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  </MotiView>
                ))}
              </View>
            </MotiView>
          ) : (
            <MotiView 
              key="timeline"
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -20 }}
              transition={{ type: 'timing', duration: 400 }}
              style={styles.timelineContainer}
            >
              {mockTimelineEvents.map((event, index) => (
                <View key={event.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <MotiView 
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 200 + (index * 100), type: 'spring' }}
                      style={styles.timelineNode}
                    >
                      <event.icon size={16} color={COLORS.white} />
                    </MotiView>
                    {index < mockTimelineEvents.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <MotiView 
                    from={{ opacity: 0, translateX: 20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 300 + (index * 100) }}
                    style={styles.timelineContent}
                  >
                    <Text style={styles.eventDate}>{event.date}</Text>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventProvider}>{event.provider}</Text>
                    <View style={styles.outcomeBox}>
                      <Text style={styles.eventOutcome}>{event.outcome}</Text>
                    </View>
                  </MotiView>
                </View>
              ))}
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>

      {/* Modal for Document View */}
      <Modal
        visible={!!selectedDoc}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedDoc(null)}
      >
        <View style={styles.modalOverlay}>
          <MotiView 
            from={{ translateY: height }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIndicator} />
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setSelectedDoc(null)}
              >
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              {selectedDoc && (
                <>
                  <Text style={styles.modalTitle}>{selectedDoc.title}</Text>
                  <View style={styles.modalMetaRow}>
                    <View style={styles.modalMetaItem}>
                      <Calendar size={14} color={COLORS.textMuted} />
                      <Text style={styles.modalMetaText}>{selectedDoc.date}</Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Activity size={14} color={COLORS.textMuted} />
                      <Text style={styles.modalMetaText}>{selectedDoc.provider}</Text>
                    </View>
                  </View>

                  <View style={styles.mockReport}>
                    <LinearGradient
                      colors={['#1a1936', '#2a2a5a']}
                      style={styles.reportHeader}
                    >
                      <ShieldCheck size={32} color={COLORS.white} />
                      <Text style={styles.reportHeaderText}>Official Medical Report</Text>
                    </LinearGradient>
                    <View style={styles.reportContent}>
                      <Text style={styles.reportSummaryTitle}>Summary & Findings</Text>
                      <Text style={styles.reportSummaryText}>{selectedDoc.summary}</Text>
                      
                      <View style={styles.reportDivider} />
                      
                      <View style={styles.reportDataRow}>
                        <Text style={styles.reportDataLabel}>Verification</Text>
                        <Text style={styles.reportDataValue}>Fayda ID Verified</Text>
                      </View>
                      <View style={styles.reportDataRow}>
                        <Text style={styles.reportDataLabel}>Security</Text>
                        <Text style={styles.reportDataValue}>E2E Encrypted</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}>
                      <Download size={20} color={COLORS.white} />
                      <Text style={styles.actionBtnText}>Download PDF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primaryLight }]}>
                      <Share2 size={20} color={COLORS.primary} />
                      <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Share Securely</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </MotiView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: COLORS.white,
  },
  filterScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.card,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterPillTextActive: {
    color: COLORS.primary,
  },
  docsList: {
    gap: SPACING.md,
  },
  docCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  docCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  docIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  docMeta: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  docSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  docDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docSummary: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
    gap: 4,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timelineContainer: {
    paddingLeft: SPACING.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  timelineNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...SHADOWS.light,
  },
  timelineLine: {
    position: 'absolute',
    top: 32,
    bottom: -SPACING.xl,
    width: 2,
    backgroundColor: COLORS.primaryLight,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  eventDate: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  eventProvider: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  outcomeBox: {
    backgroundColor: COLORS.cardAlt,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  eventOutcome: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    height: height * 0.85,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
  },
  closeBtn: {
    position: 'absolute',
    right: SPACING.lg,
    top: SPACING.md,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalMetaRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalMetaText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  mockReport: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.light,
    marginBottom: SPACING.xl,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  reportHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  reportContent: {
    padding: SPACING.lg,
  },
  reportSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  reportSummaryText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  reportDivider: {
    height: 1,
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.lg,
  },
  reportDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  reportDataLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  reportDataValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalActions: {
    gap: SPACING.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    ...SHADOWS.light,
  },
  actionBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
