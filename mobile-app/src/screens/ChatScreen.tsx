import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { Bot, User, AlertTriangle, CheckCircle2, Info, ArrowUp, Hospital, ChevronRight, Droplets, Bell } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  triage?: 'green' | 'yellow' | 'red';
  showBooking?: boolean;
  bookingConfirmed?: boolean;
}

const QUICK_PROMPTS = ['I feel dizzy', 'Sharp abdominal pain', 'Baby not moving', 'I have a fever'];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm TenaBot 🤖, your AI Health Guardian.\n\nDescribe your symptoms and I'll assess your risk level instantly. In emergencies, I can auto-book the nearest hospital slot for you." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const send = (text: string = input) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const q = text.toLowerCase();
      let reply = '', triage: 'green' | 'yellow' | 'red' = 'green', showBooking = false;

      if (q.includes('sharp') || q.includes('bleeding') || q.includes('fever') || q.includes('not moving')) {
        triage = 'red';
        reply = '⚠️ CRITICAL: Your symptoms match high-risk obstetric emergency indicators. Immediate medical attention is required.';
        showBooking = true;
      } else if (q.includes('dizzy') || q.includes('swelling') || q.includes('nausea') || q.includes('pain')) {
        triage = 'yellow';
        reply = '⚠️ MONITOR: Moderate-risk symptoms detected. Rest, stay hydrated, and monitor closely. Contact your doctor if symptoms worsen within 2 hours.';
      } else {
        triage = 'green';
        reply = '✅ NORMAL: Your symptoms align with typical maternal physiology at this stage. Continue your prenatal vitamins and scheduled appointments.';
      }

      setMessages(p => [...p, { id: (Date.now() + 1).toString(), sender: 'ai', text: reply, triage, showBooking }]);
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
    }, 1500);
  };

  const confirmBooking = (id: string) => {
    setBookingId(id);
    setTimeout(() => {
      setMessages(p => p.map(m => m.id === id ? { ...m, bookingConfirmed: true, showBooking: false } : m));
      setBookingId(null);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Bot size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>TenaBot AI</Text>
            <Text style={styles.headerSub}>AI Health Guardian • Online</Text>
          </View>
        </View>
        <View style={styles.onlineDot} />
      </View>

      {/* Wellness Reminder */}
      <MotiView from={{ translateY: -20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} style={styles.reminderRow}>
        <Droplets size={14} color={COLORS.primary} />
        <Text style={styles.reminderText}>Hydration: 45% • Vitamin D due at 8:00 PM</Text>
        <Bell size={14} color={COLORS.textMuted} />
      </MotiView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isAi = item.sender === 'ai';
            return (
              <MotiView from={{ opacity: 0, translateY: 16, scale: 0.96 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'spring', delay: 50 }} style={[styles.row, isAi ? styles.rowAi : styles.rowUser]}>
                {isAi && <View style={styles.aiBubbleIcon}><Bot size={18} color={COLORS.primary} /></View>}
                <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
                  <Text style={[styles.bubbleText, isAi ? styles.textAi : styles.textUser]}>{item.text}</Text>
                  {item.triage && (
                    <View style={[styles.triagePill, { backgroundColor: item.triage === 'red' ? COLORS.dangerLight : item.triage === 'yellow' ? COLORS.warningLight : COLORS.successLight }]}>
                      {item.triage === 'red' ? <AlertTriangle size={11} color={COLORS.danger} /> : item.triage === 'yellow' ? <Info size={11} color={COLORS.warning} /> : <CheckCircle2 size={11} color={COLORS.accent} />}
                      <Text style={[styles.triageText, { color: item.triage === 'red' ? COLORS.danger : item.triage === 'yellow' ? COLORS.warning : COLORS.accent }]}>
                        {item.triage.toUpperCase()} RISK
                      </Text>
                    </View>
                  )}
                  {item.showBooking && (
                    <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={styles.bookingBox}>
                      <View style={styles.bookingHeaderRow}>
                        <Hospital size={18} color={COLORS.danger} />
                        <Text style={styles.bookingTitle}>Emergency Auto-Booking</Text>
                      </View>
                      <Text style={styles.bookingDesc}>Tikur Anbessa Hospital — 1.8 km away. 1 emergency slot available. Authorize booking?</Text>
                      <TouchableOpacity onPress={() => confirmBooking(item.id)} disabled={bookingId === item.id} style={styles.authBtn}>
                        <LinearGradient colors={[COLORS.danger, '#C53030']} style={styles.authBtnGradient}>
                          {bookingId === item.id ? <ActivityIndicator size="small" color={COLORS.white} /> : <><Text style={styles.authBtnText}>Authorize Now</Text><ChevronRight size={16} color={COLORS.white} /></>}
                        </LinearGradient>
                      </TouchableOpacity>
                    </MotiView>
                  )}
                  {item.bookingConfirmed && (
                    <View style={styles.confirmedBox}>
                      <CheckCircle2 size={16} color={COLORS.accent} />
                      <Text style={styles.confirmedText}>SLOT CONFIRMED • Code: ET-EMERG-442</Text>
                    </View>
                  )}
                </View>
                {!isAi && <View style={styles.userBubbleIcon}><User size={18} color={COLORS.white} /></View>}
              </MotiView>
            );
          }}
          ListFooterComponent={loading ? (
            <View style={[styles.row, styles.rowAi]}>
              <View style={styles.aiBubbleIcon}><Bot size={18} color={COLORS.primary} /></View>
              <View style={[styles.bubble, styles.bubbleAi]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            </View>
          ) : null}
        />

        {/* Quick Prompts */}
        <View style={styles.quickRow}>
          {QUICK_PROMPTS.map(p => (
            <TouchableOpacity key={p} onPress={() => send(p)} style={styles.quickChip}>
              <Text style={styles.quickChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Describe your symptoms..." placeholderTextColor={COLORS.textMuted} multiline />
            <TouchableOpacity onPress={() => send()} disabled={!input.trim() || loading} style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}>
              <LinearGradient colors={!input.trim() ? [COLORS.cardAlt, COLORS.cardAlt] : [COLORS.primary, COLORS.secondary]} style={styles.sendGradient}>
                {loading ? <ActivityIndicator size="small" color={COLORS.white} /> : <ArrowUp size={20} color={COLORS.white} />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  botAvatar: { width: 40, height: 40, backgroundColor: COLORS.primaryLight, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  headerSub: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accent },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, backgroundColor: COLORS.primaryLight, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  reminderText: { flex: 1, fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  list: { padding: SPACING.lg, paddingBottom: 16 },
  row: { flexDirection: 'row', marginBottom: SPACING.md, alignItems: 'flex-end', gap: 8 },
  rowAi: { justifyContent: 'flex-start', paddingRight: 40 },
  rowUser: { justifyContent: 'flex-end', paddingLeft: 40 },
  aiBubbleIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  userBubbleIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  bubble: { borderRadius: 18, padding: SPACING.md, maxWidth: '100%', gap: SPACING.sm },
  bubbleAi: { backgroundColor: COLORS.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 21, fontWeight: '500' },
  textAi: { color: COLORS.text },
  textUser: { color: COLORS.white },
  triagePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.full, gap: 5, marginTop: 4 },
  triageText: { fontSize: 10, fontWeight: '800' },
  bookingBox: { backgroundColor: COLORS.cardAlt, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginTop: SPACING.sm, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  bookingHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bookingTitle: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
  bookingDesc: { fontSize: 12, color: COLORS.textSub, lineHeight: 18, marginBottom: SPACING.md },
  authBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden' },
  authBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 4 },
  authBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  confirmedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successLight, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md, gap: 6, marginTop: 6 },
  confirmedText: { fontSize: 11, color: COLORS.accent, fontWeight: '700', flex: 1 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, paddingBottom: 6, gap: 8 },
  quickChip: { backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.full, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border },
  quickChipText: { fontSize: 12, color: COLORS.textSub, fontWeight: '600' },
  inputArea: { padding: SPACING.lg, paddingTop: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: COLORS.card, borderRadius: 28, padding: 6, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, paddingHorizontal: SPACING.md, paddingVertical: 10, maxHeight: 100, fontSize: 14, color: COLORS.text },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendBtnDisabled: { opacity: 0.5 },
  sendGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
});
