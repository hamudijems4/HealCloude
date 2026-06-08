import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowUp,
  Hospital,
  ChevronRight,
  Droplets,
  Zap
} from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  triage?: 'green' | 'yellow' | 'red';
  showEmergencyBooking?: boolean;
  bookingConfirmed?: boolean;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm TenaBot, your National AI Health Guardian. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const query = userMessage.text.toLowerCase();
      let replyText = '';
      let triage: 'green' | 'yellow' | 'red' = 'green';
      let showEmergencyBooking = false;

      if (query.includes('bleeding') || query.includes('sharp pain') || query.includes('fever')) {
        triage = 'red';
        replyText = "⚠️ CRITICAL ALERT: Based on national obstetric guidelines, your symptoms indicate a high-risk emergency. Please seek immediate attention.";
        showEmergencyBooking = true;
      } else if (query.includes('dizzy') || query.includes('swelling') || query.includes('nausea')) {
        triage = 'yellow';
        replyText = "⚠️ MONITOR: Your symptoms are moderate-risk. We advise monitoring closely, resting, and keeping up hydration.";
      } else {
        triage = 'green';
        replyText = "✅ NORMAL: This aligns with typical maternal physiology. Maintain your scheduled appointments and continue taking your daily prenatal vitamins.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        triage,
        showEmergencyBooking
      };

      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);

    }, 1500);
  };

  const handleConfirmAutoBooking = (messageId: string) => {
    setActiveBookingId(messageId);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, bookingConfirmed: true, showEmergencyBooking: false } : m));
      setActiveBookingId(null);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[COLORS.primaryLight, COLORS.background]} 
        style={StyleSheet.absoluteFill}
      />

      {/* Wellness Reminders */}
      <MotiView 
        from={{ translateY: -50, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        style={styles.reminderBanner}
      >
        <View style={styles.reminderContent}>
          <Droplets size={16} color={COLORS.primary} />
          <Text style={styles.reminderText}>
            Hydration Goal: 45% complete • Vitamin due at 8:00 PM
          </Text>
        </View>
      </MotiView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isAi = item.sender === 'ai';
            return (
              <MotiView 
                from={{ opacity: 0, translateY: 20, scale: 0.95 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', delay: 100 }}
                style={[styles.messageRow, isAi ? styles.rowAi : styles.rowUser]}
              >
                {isAi && (
                  <View style={[styles.avatarCircle, { backgroundColor: COLORS.white }]}>
                    <Bot size={20} color={COLORS.primary} />
                  </View>
                )}
                
                <View style={styles.messageContent}>
                  <View style={[
                    styles.bubble, 
                    isAi ? styles.bubbleAi : styles.bubbleUser
                  ]}>
                    <Text style={[styles.messageText, isAi ? styles.textAi : styles.textUser]}>
                      {item.text}
                    </Text>

                    {item.triage && (
                      <View style={[
                        styles.triageBadge, 
                        { backgroundColor: item.triage === 'red' ? COLORS.dangerLight : 
                                         item.triage === 'yellow' ? COLORS.warningLight : 
                                         COLORS.successLight }
                      ]}>
                        {item.triage === 'red' ? <AlertTriangle size={12} color={COLORS.danger} /> :
                         item.triage === 'yellow' ? <Info size={12} color={COLORS.warning} /> :
                         <CheckCircle2 size={12} color={COLORS.accent} />}
                        <Text style={[
                          styles.triageText,
                          { color: item.triage === 'red' ? COLORS.danger : 
                                   item.triage === 'yellow' ? COLORS.warning : 
                                   COLORS.accent }
                        ]}>
                          {item.triage.toUpperCase()} STATUS
                        </Text>
                      </View>
                    )}
                  </View>

                  <AnimatePresence>
                    {item.showEmergencyBooking && (
                      <MotiView 
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={styles.bookingBox}
                      >
                        <View style={styles.bookingHeader}>
                          <Hospital size={20} color={COLORS.danger} />
                          <Text style={styles.bookingTitle}>Emergency Auto-Booking</Text>
                        </View>
                        <Text style={styles.bookingDesc}>
                          A critical slot is held at Tikur Anbessa Hospital (1.8 km). Authorize booking?
                        </Text>
                        <TouchableOpacity 
                          style={styles.confirmBtn}
                          onPress={() => handleConfirmAutoBooking(item.id)}
                          disabled={activeBookingId === item.id}
                        >
                          <LinearGradient
                            colors={[COLORS.danger, '#C53030']}
                            style={styles.confirmBtnGradient}
                          >
                            {activeBookingId === item.id ? (
                              <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                              <>
                                <Text style={styles.confirmBtnText}>Authorize Now</Text>
                                <ChevronRight size={18} color={COLORS.white} />
                              </>
                            )}
                          </LinearGradient>
                        </TouchableOpacity>
                      </MotiView>
                    )}

                    {item.bookingConfirmed && (
                      <MotiView 
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.bookingSuccessBox}
                      >
                        <CheckCircle2 size={20} color={COLORS.accent} />
                        <Text style={styles.bookingSuccessText}>
                          EMERGENCY SLOT CONFIRMED: Code ET-EMERG-442
                        </Text>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </View>

                {!isAi && (
                  <View style={[styles.avatarCircle, { backgroundColor: COLORS.primary }]}>
                    <User size={20} color={COLORS.white} />
                  </View>
                )}
              </MotiView>
            );
          }}
        />

        {/* Input Bar */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Report symptoms..."
              placeholderTextColor={COLORS.textMuted}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
            >
              <LinearGradient
                colors={!input.trim() ? [COLORS.textMuted, COLORS.textMuted] : [COLORS.primary, COLORS.secondary]}
                style={styles.sendBtnGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <ArrowUp size={22} color={COLORS.white} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  reminderBanner: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  reminderText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  chatList: { 
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  messageRow: { 
    flexDirection: 'row', 
    marginBottom: SPACING.lg,
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  rowAi: { 
    justifyContent: 'flex-start',
    paddingRight: 40,
  },
  rowUser: { 
    justifyContent: 'flex-end',
    paddingLeft: 40,
  },
  avatarCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    ...SHADOWS.light,
  },
  messageContent: {
    flex: 1,
    gap: SPACING.sm,
  },
  bubble: { 
    borderRadius: 20, 
    padding: SPACING.md,
    ...SHADOWS.light,
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
  messageText: { 
    fontSize: 15, 
    lineHeight: 22,
    fontWeight: '500',
  },
  textAi: { 
    color: COLORS.text 
  },
  textUser: { 
    color: COLORS.white 
  },
  triageBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    gap: 4,
  },
  triageText: { 
    fontSize: 10, 
    fontWeight: '800' 
  },
  bookingBox: { 
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.dangerLight,
    marginTop: SPACING.xs,
    ...SHADOWS.medium,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  bookingTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: COLORS.danger 
  },
  bookingDesc: { 
    fontSize: 13, 
    color: COLORS.text, 
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  confirmBtn: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  confirmBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  confirmBtnText: { 
    color: COLORS.white, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  bookingSuccessBox: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: SPACING.sm,
  },
  bookingSuccessText: { 
    fontSize: 12, 
    color: COLORS.accent, 
    fontWeight: '700',
    flex: 1,
  },
  inputArea: { 
    padding: SPACING.lg,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  input: { 
    flex: 1, 
    paddingHorizontal: SPACING.md, 
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: COLORS.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
