import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Bell, Globe, Fingerprint, Lock, HelpCircle, LogOut, ChevronRight, Edit3, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const settingsRows = [
  { icon: Bell, label: 'Push notification', type: 'toggle', key: 'notif' },
  { icon: Globe, label: 'Language', type: 'value', value: 'English >', key: 'lang' },
  { icon: Fingerprint, label: 'Face ID', type: 'toggle', key: 'faceId' },
  { icon: Lock, label: 'Change password', type: 'nav', key: 'pass' },
  { icon: HelpCircle, label: 'Help center', type: 'nav', key: 'help' },
];

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const { profile, logout } = useAuth();
  const [toggles, setToggles] = useState({ notif: true, faceId: false });

  const flip = (key: string) => setToggles(p => ({ ...p, [key]: !p[key as keyof typeof p] }));

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
        <MotiView from={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 200 }} style={styles.profileCard}>
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.avatarGradient}>
            <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'B'}</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.full_name || 'Beatrice Cox'}</Text>
            <Text style={styles.profileSub}>{profile?.phone || 'coc17@payments.me'}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={14} color={COLORS.accent} />
          </View>
        </MotiView>

        {/* Settings Rows */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }} style={styles.settingsCard}>
          {settingsRows.map((row, i) => (
            <View key={row.key}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => row.type === 'toggle' ? flip(row.key) : undefined}
                activeOpacity={row.type === 'nav' ? 0.6 : 1}
              >
                <View style={styles.settingIcon}>
                  <row.icon size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.settingLabel}>{row.label}</Text>
                {row.type === 'toggle' && (
                  <Switch
                    value={toggles[row.key as keyof typeof toggles]}
                    onValueChange={() => flip(row.key)}
                    trackColor={{ false: COLORS.cardAlt, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                )}
                {row.type === 'value' && (
                  <Text style={styles.settingValue}>{row.value}</Text>
                )}
                {row.type === 'nav' && (
                  <ChevronRight size={18} color={COLORS.textMuted} />
                )}
              </TouchableOpacity>
              {i < settingsRows.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </MotiView>

        {/* Sign Out */}
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 600 }}>
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

  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: 16 },
  avatarGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', ...SHADOWS.medium },
  avatarText: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  profileSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  verifiedBadge: { width: 32, height: 32, backgroundColor: COLORS.successLight, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  settingsCard: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.xl },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: 14 },
  settingIcon: { width: 36, height: 36, backgroundColor: COLORS.primaryLight, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  settingValue: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.lg },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.dangerLight, borderRadius: BORDER_RADIUS.xl, paddingVertical: SPACING.lg, gap: 10, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  logoutText: { fontSize: 16, fontWeight: '700', color: COLORS.danger },
});
