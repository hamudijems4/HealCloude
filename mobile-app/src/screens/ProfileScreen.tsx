import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Bell, Globe, Fingerprint, Lock, HelpCircle, LogOut, Edit3, ShieldCheck, MapPin, Phone, CreditCard, MessageSquare, Minus, Plus } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { profile, logout } = useAuth();
  const [notif, setNotif] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [gps, setGps] = useState(true);
  const [radius, setRadius] = useState(10);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <MotiView from={{ opacity: 0, translateY: -12 }} animate={{ opacity: 1, translateY: 0 }} style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Edit3 size={18} color={COLORS.text} />
          </TouchableOpacity>
        </MotiView>

        {/* Profile Card */}
        <MotiView from={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 150 }} style={styles.profileCard}>
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'A'}</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.full_name || 'Almaz Tadesse'}</Text>
            <Text style={styles.profileSub}>{profile?.phone || '+251 911 234 567'}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={14} color={COLORS.accent} />
          </View>
        </MotiView>

        {/* Identity & Fayda */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 250 }} style={styles.card}>
          <Text style={styles.cardTitle}>Identity & Registration</Text>
          {[
            { icon: CreditCard, label: 'Fayda National ID', value: profile?.fayda_id || 'ET-8823710-29', color: COLORS.primary },
            { icon: ShieldCheck, label: 'Account Reference', value: 'LH-7729-10', color: COLORS.accent },
            { icon: Phone, label: 'Phone Number', value: profile?.phone || '+251 911 234 567', color: COLORS.warning },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.infoRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.infoIcon, { backgroundColor: `${item.color}20` }]}>
                <item.icon size={17} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </MotiView>

        {/* Clinic Finder */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 350 }} style={styles.card}>
          <Text style={styles.cardTitle}>Clinic Finder Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.infoIcon, { backgroundColor: COLORS.primaryLight }]}>
                <MapPin size={17} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Active Geolocation</Text>
                <Text style={styles.settingDesc}>Find clinics near your location</Text>
              </View>
            </View>
            <Switch value={gps} onValueChange={setGps} trackColor={{ false: COLORS.cardAlt, true: COLORS.primary }} thumbColor={COLORS.white} />
          </View>
          <View style={styles.divider} />
          <View style={styles.radiusRow}>
            <Text style={styles.settingLabel}>Search Radius</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setRadius(r => Math.max(2, r - 5))}>
                <Minus size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.radiusVal}>{radius} km</Text>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setRadius(r => Math.min(50, r + 5))}>
                <Plus size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>Found {gps ? 8 : 3} clinics within {radius} km of Bole, Addis Ababa</Text>
          </View>
        </MotiView>

        {/* App Settings */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 450 }} style={styles.card}>
          <Text style={styles.cardTitle}>App Settings</Text>
          {[
            { icon: Bell, label: 'Push Notifications', desc: 'Reminders & appointment alerts', toggle: true, value: notif, setter: setNotif },
            { icon: Fingerprint, label: 'Face ID / Biometric', desc: 'Secure login with biometrics', toggle: true, value: faceId, setter: setFaceId },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <View style={[styles.settingRow, i === arr.length - 1 && { marginBottom: 0 }]}>
                <View style={styles.settingLeft}>
                  <View style={[styles.infoIcon, { backgroundColor: COLORS.primaryLight }]}>
                    <item.icon size={17} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDesc}>{item.desc}</Text>
                  </View>
                </View>
                <Switch value={item.value} onValueChange={item.setter} trackColor={{ false: COLORS.cardAlt, true: COLORS.primary }} thumbColor={COLORS.white} />
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </MotiView>

        {/* USSD / SMS Accessibility */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 550 }}>
          <LinearGradient colors={['#3A59FF', '#6C63FF']} style={styles.ussdCard}>
            <View style={styles.ussdHeader}>
              <View style={styles.ussdIcon}>
                <MessageSquare size={20} color={COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ussdTitle}>USSD / SMS Mode</Text>
                <Text style={styles.ussdSub}>No internet required</Text>
              </View>
            </View>
            <Text style={styles.ussdDesc}>Dial *961# from any phone to receive appointment reminders, check slot counts, and report symptoms — works on 2G feature phones. Full Amharic support.</Text>
            <View style={styles.ussdCode}>
              <Text style={styles.ussdCodeText}>Dial *961#</Text>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Sign Out */}
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 650 }}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <LogOut size={20} color={COLORS.danger} />
            <Text style={styles.logoutText}>Sign Out Securely</Text>
          </TouchableOpacity>
        </MotiView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  editBtn: { width: 40, height: 40, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', ...SHADOWS.medium },
  avatarText: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  profileName: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  profileSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  verifiedBadge: { width: 32, height: 32, backgroundColor: COLORS.successLight, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted, marginBottom: SPACING.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 14 },
  infoIcon: { width: 38, height: 38, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  settingDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.md },
  radiusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardAlt, borderRadius: BORDER_RADIUS.md, padding: 4, gap: 4 },
  stepBtn: { width: 34, height: 34, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.sm, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  radiusVal: { fontSize: 15, fontWeight: '800', color: COLORS.primary, paddingHorizontal: SPACING.md },
  infoBox: { backgroundColor: COLORS.primaryLight, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)' },
  infoBoxText: { fontSize: 12, color: COLORS.primary, fontWeight: '600', textAlign: 'center' },
  ussdCard: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, overflow: 'hidden' },
  ussdHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: SPACING.md },
  ussdIcon: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  ussdTitle: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  ussdSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  ussdDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: SPACING.md },
  ussdCode: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  ussdCodeText: { fontSize: 18, fontWeight: '900', color: COLORS.white, letterSpacing: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.dangerLight, borderRadius: BORDER_RADIUS.xl, paddingVertical: SPACING.lg, gap: 10, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { fontSize: 16, fontWeight: '700', color: COLORS.danger },
});
