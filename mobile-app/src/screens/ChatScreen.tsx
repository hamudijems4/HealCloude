import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {
  Bot,
  User,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowUp,
  Hospital,
  ChevronRight,
  Droplets,
  Bell,
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

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
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm TenaBot, your AI Health Guardian.\n\nDescribe your symptoms and I'll assess your risk level instantly. In emergencies, I can auto-book the nearest hospital slot for you.",
    },
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
      let reply = '';
      let triage: 'green' | 'yellow' | 'red' = 'green';
      let showBooking = false;

      if (q.includes('sharp') || q.includes('bleeding') || q.includes('fever') || q.includes('not moving')) {
        triage = 'red';
        reply = 'CRITICAL: Your symptoms match high-risk obstetric emergency indicators. Immediate medical attention is required.';
        showBooking = true;
      } else if (q.includes('dizzy') || q.includes('swelling') || q.includes('nausea') || q.includes('pain')) {
        triage = 'yellow';
        reply = 'MONITOR: Moderate-risk symptoms detected. Rest, stay hydrated, and monitor closely. Contact your doctor if symptoms worsen within 2 hours.';
      } else {
        triage = 'green';
        reply = 'NORMAL: Your symptoms align with typical maternal physiology. Continue your prenatal vitamins and scheduled appointments.';
      }

      setMessages(p => [
        ...p,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: reply, triage, showBooking },
      ]);
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
    }, 1500);
  };

  const confirmBooking = (id: string) => {
    setBookingId(id);
    setTimeout(() => {
      setMessages(p =>
        p.map(m => (m.id === id ? { ...m, bookingConfirmed: true, showBooking: false } : m))
      );
      setBookingId(null);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAi = item.sender === 'ai';
    const triageColor =
      item.triage === 'red' ? COLORS.danger :
      item.triage === 'yellow' ? COLORS.warning :
      COLORS.accent;
    const triageBg =
      item.triage === 'red' ? COLORS.dangerLight :
      item.triage === 'yellow' ? COLORS.warningLight :
      COLORS.successLight;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={[styles.row, isAi ? styles.rowAi : styles.rowUser]}
      >
        {isAi && (
          <View style={styles.aiBubbleIcon}>
            <Bot size={16} color={COLORS.primary} />
          </View>
        )}

        <View style={isAi ? styles.bubbleAiWrap : styles.bubbleUserWrap}>
          {/* Main bubble */}
          <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
            <Text style={[styles.bubbleText, isAi ? styles.textAi : styles.textUser]}>
              {item.text}
            </Text>
          </View>

          {/* Triage pill */}
          {item.triage != null && (
            <View style={[styles.triagePill, { backgroundColor: triageBg }]}>
              {item.triage === 'red' && <AlertTriangle size={11} color={COLORS.danger} />}
              {item.triage === 'yellow' && <Info size={11} color={COLORS.warning} />}
              {item.triage === 'green' && <CheckCircle2 size={11} color={COLORS.accent} />}
              <Text style={[styles.triageText, { color: triageColor }]}>
                {item.triage.toUpperCase()} RISK
              </Text>
            </View>
          )}

          {/* Emergency booking box */}
          {item.showBooking && (
            <View style={styles.bookingBox}>
              <View style={styles.bookingHeaderRow}>
                <Hospital size={16} color={COLORS.danger} />
                <Text style={styles.bookingTitle}>Emergency Auto-Booking</Text>
              </View>
              <Text style={styles.bookingDesc}>
                Tikur Anbessa Hospital — 1.8 km away. 1 emergency slot available. Authorize?
              </Text>
              <TouchableOpacity
                onPress={() => confirmBooking(item.id)}
                disabled={bookingId === item.id}
                style={styles.authBtn}
              >
                <LinearGradient
                  colors={[COLORS.danger, '#C53030']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.authBtnGradient}
                >
                  {bookingId === item.id ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Text style={styles.authBtnText}>Authorize Now</Text>
                      <ChevronRight size={15} color={COLORS.white} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Booking confirmed */}
          {item.bookingConfirmed && (
            <View style={styles.confirmedBox}>
              <CheckCircle2 size={15} color={COLORS.accent} />
              <Text style={styles.confirmedText}>SLOT CONFIRMED  •  Code: ET-EMERG-442</Text>
            </View>
          )}
        </View>

        {!isAi && (
          <View style={styles.userBubbleIcon}>
            <User size={16} color={COLORS.white} />
          </View>
        )}
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.botAvatar}>
              <Bot size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>TenaBot AI</Text>
              <Text style={styles.headerSub}>AI Health Guardian  •  Online</Text>
            </View>
          </View>
          <View style={styles.onlineDot} />
        </View>

        {/* Wellness reminder banner */}
        <View style={styles.reminderRow}>
          <Droplets size={13} color={COLORS.primary} />
          <Text style={styles.reminderText}>Hydration: 45%  •  Vitamin D due at 8:00 PM</Text>
          <Bell size={13} color={COLORS.textMuted} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Messages list */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={i => i.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={renderMessage}

            ListFooterComponent={
              loading ? (
                <View style={[styles.row, styles.rowAi]}>
                  <View style={styles.aiBubbleIcon}>
                    <Bot size={16} color={COLORS.primary} />
                  </View>
                  <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                </View>
              ) : null
            }
          />

          {/* Quick prompt chips */}
          <View style={styles.quickRow}>
            {QUICK_PROMPTS.map(p => (
              <TouchableOpacity key={p} onPress={() => send(p)} style={styles.quickChip}>
                <Text style={styles.quickChipText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input bar */}
          <View style={styles.inputArea}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Describe your symptoms..."
                placeholderTextColor={COLORS.textMuted}
                multiline
    
              />
              <TouchableOpacity
                onPress={() => send()}
                disabled={!input.trim() || loading}
                style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              >
                <LinearGradient
                  colors={(!input.trim() || loading) ? [COLORS.cardAlt, COLORS.cardAlt] : [COLORS.primary, COLORS.secondary]}
                  style={styles.sendGradient}
                >
                  {loading
                    ? <ActivityIndicator size="small" color={COLORS.white} />
                    : <ArrowUp size={19} color={COLORS.white} />}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 1,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },

  // Reminder
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reminderText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginHorizontal: 8,
  },

  // Messages
  list: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  rowAi: {
    justifyContent: 'flex-start',
    paddingRight: 48,
  },
  rowUser: {
    justifyContent: 'flex-end',
    paddingLeft: 48,
  },
  aiBubbleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    flexShrink: 0,
  },
  userBubbleIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },
  bubbleAiWrap: {
    flex: 1,
    alignItems: 'flex-start',
  },
  bubbleUserWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxWidth: '100%',
  },
  bubbleAi: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  typingBubble: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  textAi: {
    color: COLORS.text,
  },
  textUser: {
    color: COLORS.white,
  },

  // Triage
  triagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: 6,
  },
  triageText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },

  // Booking box
  bookingBox: {
    backgroundColor: COLORS.cardAlt,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    width: '100%',
  },
  bookingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
    marginLeft: 8,
  },
  bookingDesc: {
    fontSize: 12,
    color: COLORS.textSub,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  authBtn: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  authBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  authBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },

  // Confirmed
  confirmedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
    width: '100%',
  },
  confirmedText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '700',
    marginLeft: 6,
    flex: 1,
  },

  // Quick prompts
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 8,
    paddingTop: 4,
  },
  quickChip: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 6,
  },
  quickChipText: {
    fontSize: 12,
    color: COLORS.textSub,
    fontWeight: '600',
  },

  // Input
  inputArea: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.sm : SPACING.md,
    paddingTop: 4,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.card,
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: COLORS.text,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
