import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatMessage, EmergencyHospital } from '../types';

const DANGER_SIGNS = ['headache', 'swelling', 'bleeding', 'fever', 'pain', 'dizzy'];
const mockHospital: EmergencyHospital = { id: 'h1', name: 'St. Paul\'s Hospital Millennium Medical College', distance: '2.4 km', specialistAvailable: true };

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: 'Hello! I\'m TenaBot, your AI Health Guardian. How are you feeling today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const emergencyPulse = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.cubic) }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(emergencyPulse, { toValue: 1, duration: 1500, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(emergencyPulse, { toValue: 0, duration: 1500, useNativeDriver: false, easing: Easing.inOut(Easing.ease) })
      ])
    ).start();
  }, []);

  const detectEmergency = (text: string) => DANGER_SIGNS.some(sign => text.toLowerCase().includes(sign));

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      setLoading(false);
      const isEmergency = detectEmergency(userText);
      if (isEmergency) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I noticed you mentioned a potential danger sign. Your health is our top priority. Please see a specialist immediately.', isEmergency: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Thank you for sharing. Remember to stay hydrated and rest well.' }]);
      }
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const renderEmergencyCard = () => (
    <Animated.View style={[styles.emergencyCard, { shadowColor: '#e11d48', shadowOpacity: emergencyPulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] }), shadowRadius: emergencyPulse.interpolate({ inputRange: [0, 1], outputRange: [8, 20] }) }]}>
      <LinearGradient colors={['#fff1f2', '#ffe4e6']} style={styles.emergencyGradient}>
        <View style={styles.emergencyHeader}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyTitle}>Action Required</Text>
        </View>
        <Text style={styles.emergencyDesc}>We found a nearby hospital with an available Obstetrics specialist.</Text>
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>{mockHospital.name}</Text>
          <View style={styles.hospitalMetaRow}>
            <Text style={styles.hospitalDistance}>📍 {mockHospital.distance} away</Text>
            <Text style={styles.hospitalSpecialist}>👩‍⚕️ Specialist Ready</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <LinearGradient colors={['#e11d48', '#be123c']} style={styles.bookButtonGradient}>
            <Text style={styles.bookButtonText}>Auto-Book Emergency Slot</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isBot = item.role === 'assistant';
    return (
      <View style={isBot ? styles.botMessageRow : styles.userMessageRow}>
        {isBot && <View style={styles.botAvatar}><Text style={styles.botAvatarText}>🤖</Text></View>}
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>{item.content}</Text>
          {item.isEmergency && renderEmergencyCard()}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#f8fafc', '#e2e8f0', '#cbd5e1']} style={StyleSheet.absoluteFill} />

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }], zIndex: 10, position: 'absolute', top: 0, left: 0, right: 0 }}>
        <LinearGradient colors={['rgba(92, 89, 240, 0.95)', 'rgba(139, 92, 246, 0.95)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <Text style={styles.headerTitle}>TenaBot</Text>
          <Text style={styles.headerSubtitle}>AI Health Guardian • Online</Text>
        </LinearGradient>
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator color="#5c59f0" size="small" />
          <Text style={styles.typingText}>TenaBot is typing...</Text>
        </View>
      )}

      <BlurView intensity={80} tint="light" style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type how you are feeling..."
            placeholderTextColor="#94a3b8"
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]} onPress={sendMessage} disabled={!input.trim() || loading}>
            <LinearGradient colors={['#5c59f0', '#4f46e5']} style={styles.sendButtonGradient}>
              <Text style={styles.sendButtonIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 60, paddingBottom: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#ffffff', fontFamily: 'Outfit', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: '#a7f3d0', marginTop: 4, fontFamily: 'Inter', fontWeight: '700' },
  messagesList: { padding: 20, paddingTop: 140, paddingBottom: 20 },
  botMessageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, maxWidth: '85%' },
  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  botAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  botAvatarText: { fontSize: 20 },
  messageBubble: { padding: 16, borderRadius: 24, maxWidth: '100%', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 3 },
  userBubble: { backgroundColor: '#5c59f0', borderBottomRightRadius: 6 },
  botBubble: { backgroundColor: 'rgba(255,255,255,0.8)', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: '#ffffff' },
  messageText: { fontSize: 16, fontFamily: 'Inter', lineHeight: 24, fontWeight: '500' },
  userText: { color: '#ffffff' },
  botText: { color: '#1e293b' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  typingText: { marginLeft: 12, fontSize: 14, color: '#64748b', fontFamily: 'Inter', fontWeight: '600' },
  inputWrapper: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 28, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, fontSize: 16, color: '#1e293b', marginRight: 12, maxHeight: 120, minHeight: 56, fontFamily: 'Inter', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sendButton: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  sendButtonGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonIcon: { color: '#ffffff', fontSize: 26, fontWeight: '900', marginTop: -2 },
  
  emergencyCard: { marginTop: 16, borderRadius: 24, overflow: 'hidden', elevation: 5 },
  emergencyGradient: { padding: 20 },
  emergencyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  emergencyIcon: { fontSize: 22, marginRight: 8 },
  emergencyTitle: { fontSize: 20, fontWeight: '900', color: '#e11d48', fontFamily: 'Outfit', letterSpacing: -0.5 },
  emergencyDesc: { fontSize: 15, color: '#be123c', fontFamily: 'Inter', lineHeight: 22, marginBottom: 16, fontWeight: '500' },
  hospitalInfo: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 16, marginBottom: 16 },
  hospitalName: { fontSize: 16, fontWeight: '800', color: '#1e293b', fontFamily: 'Outfit', marginBottom: 8 },
  hospitalMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  hospitalDistance: { fontSize: 13, color: '#475569', fontFamily: 'Inter', fontWeight: '700' },
  hospitalSpecialist: { fontSize: 13, color: '#16a34a', fontFamily: 'Inter', fontWeight: '800' },
  bookButton: { borderRadius: 16, overflow: 'hidden', shadowColor: '#e11d48', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 5 },
  bookButtonGradient: { paddingVertical: 16, alignItems: 'center' },
  bookButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800', fontFamily: 'Inter', letterSpacing: 0.5 }
});
