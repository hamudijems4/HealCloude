import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Bell, Plus, ChevronRight, Heart, Activity, Calendar, MessageCircle, TrendingUp, Award, Stethoscope, Clock, Star } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

const clinicians = [
  { id: '1', name: 'Dr. Tsige Abebe', specialty: 'OB/GYN', slots: 3, available: true },
  { id: '2', name: 'Dr. Yared Shimeles', specialty: 'Maternal Health', slots: 1, available: true },
  { id: '3', name: 'Dr. Kenenisa D.', specialty: 'Pediatric', slots: 0, available: false },
];

const recentActivity = [
  { id: '1', title: 'Starbucks Coffee', sub: 'Fast food', amount: '-$44.80', icon: '☕' },
  { id: '2', title: 'Amazon', sub: 'Marketplace', amount: '-$104.80', icon: '📦' },
  { id: '3', title: 'Prenatal Checkup', sub: 'Tikur Anbessa', amount: 'Done', icon: '🏥' },
];

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState<'home' | 'doctors'>('home');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <MotiView from={{ opacity: 0, translateY: -16 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, 👋</Text>
            <Text style={styles.userName}>Beatrice Cox</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarBtn}>
              <Text style={styles.avatarInitial}>B</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Balance Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>Your balance</Text>
              <Text style={styles.balanceAmount}>$8,987.00</Text>
            </View>
            <TouchableOpacity style={styles.addMoneyBtn}>
              <Plus size={16} color={COLORS.white} />
              <Text style={styles.addMoneyText}>Add money</Text>
            </TouchableOpacity>
          </View>

          {/* Tab switcher inside card */}
          <View style={styles.cardTabs}>
            {(['home', 'doctors'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.cardTab, activeTab === tab && styles.cardTabActive]}
              >
                <Text style={[styles.cardTabText, activeTab === tab && styles.cardTabTextActive]}>
                  {tab === 'home' ? 'Overview' : 'Doctors'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        <AnimatePresence>
          {activeTab === 'home' ? (
            <MotiView key="home" from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 350 }}>

              {/* Your Cards */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your cards</Text>
                <TouchableOpacity style={styles.newCardBtn}>
                  <Plus size={14} color={COLORS.primary} />
                  <Text style={styles.newCardText}>New card</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
                {/* Main Health Card */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
                  <LinearGradient colors={['#3A59FF', '#6C63FF', '#A78BFA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.healthCard}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardBalanceLabel}>$2,986.12</Text>
                      <View style={styles.cardChip} />
                    </View>
                    <Text style={styles.cardNumber}>**** **** **** 4291</Text>
                    <View style={styles.cardBottomRow}>
                      <Text style={styles.cardDetails}>Card details</Text>
                      <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
                    </View>
                    {/* Decorative circles */}
                    <View style={[styles.cardCircle, { width: 100, height: 100, top: -30, right: -20, opacity: 0.15 }]} />
                    <View style={[styles.cardCircle, { width: 70, height: 70, top: 10, right: 50, opacity: 0.1 }]} />
                  </LinearGradient>
                </MotiView>

                {/* Second Card */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }} style={{ marginLeft: 16 }}>
                  <LinearGradient colors={['#1E293B', '#334155']} style={[styles.healthCard, { opacity: 0.85 }]}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardBalanceLabel}>$1,240.00</Text>
                      <View style={[styles.cardChip, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                    </View>
                    <Text style={styles.cardNumber}>**** **** **** 7823</Text>
                    <View style={styles.cardBottomRow}>
                      <Text style={styles.cardDetails}>Card details</Text>
                      <ChevronRight size={16} color="rgba(255,255,255,0.7)" />
                    </View>
                  </LinearGradient>
                </MotiView>
              </ScrollView>

              {/* Transfer Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Transfer</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
                {['👩🏾', '👨🏽', '👩🏻', '👨🏿', '👩🏼'].map((emoji, i) => (
                  <MotiView key={i} from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 400 + i * 80, type: 'spring' }}>
                    <TouchableOpacity style={styles.transferAvatar}>
                      <Text style={{ fontSize: 24 }}>{emoji}</Text>
                    </TouchableOpacity>
                  </MotiView>
                ))}
                <MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 800, type: 'spring' }}>
                  <TouchableOpacity style={[styles.transferAvatar, styles.transferAvatarAdd]}>
                    <Plus size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </MotiView>
              </ScrollView>

              {/* Recent Transactions */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent transactions</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>

              {recentActivity.map((item, i) => (
                <MotiView
                  key={item.id}
                  from={{ opacity: 0, translateX: -16 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 500 + i * 100 }}
                  style={styles.txRow}
                >
                  <View style={styles.txIcon}>
                    <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txTitle}>{item.title}</Text>
                    <Text style={styles.txSub}>{item.sub}</Text>
                  </View>
                  <Text style={[styles.txAmount, item.amount === 'Done' && { color: COLORS.accent }]}>
                    {item.amount}
                  </Text>
                </MotiView>
              ))}
            </MotiView>
          ) : (
            <MotiView key="doctors" from={{ opacity: 0, translateX: 10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 350 }}>
              <Text style={[styles.sectionTitle, { marginTop: SPACING.md }]}>Available Specialists</Text>
              {clinicians.map((doc, i) => (
                <MotiView
                  key={doc.id}
                  from={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 200 + i * 100 }}
                  style={styles.doctorCard}
                >
                  <View style={styles.doctorAvatar}>
                    <Stethoscope size={22} color={doc.available ? COLORS.accent : COLORS.textMuted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>{doc.name}</Text>
                    <Text style={styles.doctorSpec}>{doc.specialty}</Text>
                  </View>
                  <TouchableOpacity
                    disabled={!doc.available}
                    style={[styles.bookBtn, !doc.available && { backgroundColor: COLORS.cardAlt }]}
                  >
                    <Text style={[styles.bookBtnText, !doc.available && { color: COLORS.textMuted }]}>
                      {doc.available ? `Book (${doc.slots})` : 'Full'}
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

  balanceCard: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  balanceLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500', marginBottom: 4 },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: COLORS.text, letterSpacing: -1 },
  addMoneyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: BORDER_RADIUS.md, gap: 6 },
  addMoneyText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  cardTabs: { flexDirection: 'row', backgroundColor: COLORS.cardAlt, borderRadius: BORDER_RADIUS.md, padding: 4 },
  cardTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: BORDER_RADIUS.sm },
  cardTabActive: { backgroundColor: COLORS.primary },
  cardTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  cardTabTextActive: { color: COLORS.white },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  newCardBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newCardText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  seeAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  cardsScroll: { marginHorizontal: -SPACING.lg, paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  healthCard: { width: width * 0.72, height: 170, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, justifyContent: 'space-between', overflow: 'hidden', ...SHADOWS.medium },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBalanceLabel: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  cardChip: { width: 32, height: 24, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 6 },
  cardNumber: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 2 },
  cardBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDetails: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  cardCircle: { position: 'absolute', backgroundColor: COLORS.white, borderRadius: 999 },

  transferAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: COLORS.border },
  transferAvatarAdd: { backgroundColor: COLORS.primaryLight },

  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  txIcon: { width: 44, height: 44, backgroundColor: COLORS.cardAlt, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  txTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  txSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700', color: COLORS.danger },

  doctorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  doctorAvatar: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.cardAlt, justifyContent: 'center', alignItems: 'center' },
  doctorName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  doctorSpec: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  bookBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BORDER_RADIUS.md },
  bookBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
});
