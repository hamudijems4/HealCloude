import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.cubic) })
    ]).start();

    // Floating background shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, { toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim1, { toValue: 0, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, { toValue: 1, duration: 5000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim2, { toValue: 0, duration: 5000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) })
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(identifier || 'ET8823710293', password || 'password123');
    } catch (error: any) {
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const translateY1 = floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const translateY2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#eef2ff', '#e0e7ff', '#c7d2fe']} style={StyleSheet.absoluteFill} />
      
      {/* Animated Background Orbs */}
      <Animated.View style={[styles.orb1, { transform: [{ translateY: translateY1 }] }]} />
      <Animated.View style={[styles.orb2, { transform: [{ translateY: translateY2 }] }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center', marginBottom: 40 }}>
            <View style={styles.logoWrapper}>
              <LinearGradient colors={['#5c59f0', '#8b5cf6']} style={styles.logoGradient}>
                <Text style={styles.logoIcon}>🤰</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>TenaLink</Text>
            <Text style={styles.subtitle}>The Future of Care</Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <BlurView intensity={70} tint="light" style={styles.glassCard}>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fayda ID / Email</Text>
                <TextInput
                  style={styles.input}
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="e.g. ET8823710293"
                  placeholderTextColor="#8492a6"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#8492a6"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={[styles.loginButton, loading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={loading}>
                <LinearGradient colors={['#5c59f0', '#4f46e5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>
                  <Text style={styles.loginButtonText}>{loading ? 'Authenticating...' : 'Sign In'}</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.demoBanner}>
                <Text style={styles.demoBannerIcon}>✨</Text>
                <Text style={styles.demoBannerText}>Demo mode: Tap Sign In directly to continue.</Text>
              </View>
            </BlurView>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  orb1: { position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: '#a78bfa', opacity: 0.3, filter: 'blur(40px)' },
  orb2: { position: 'absolute', bottom: 100, left: -100, width: 350, height: 350, borderRadius: 175, backgroundColor: '#818cf8', opacity: 0.2, filter: 'blur(50px)' },
  scrollContainer: { flexGrow: 1, padding: 24, paddingTop: 100, paddingBottom: 40, justifyContent: 'center' },
  logoWrapper: { width: 80, height: 80, borderRadius: 28, overflow: 'hidden', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, marginBottom: 20 },
  logoGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 42, fontWeight: '800', color: '#1e293b', fontFamily: 'Outfit', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#64748b', fontFamily: 'Inter', marginTop: 4, letterSpacing: 0.5 },
  glassCard: { borderRadius: 32, padding: 32, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.4)' },
  cardTitle: { fontSize: 28, fontWeight: '700', color: '#1e293b', fontFamily: 'Outfit', marginBottom: 24, letterSpacing: -0.5 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', fontFamily: 'Inter', marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, color: '#1e293b', fontFamily: 'Inter', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4 },
  loginButton: { marginTop: 12, borderRadius: 20, overflow: 'hidden', shadowColor: '#5c59f0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  buttonGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '700', fontFamily: 'Inter', letterSpacing: 0.5 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', padding: 16, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  demoBannerIcon: { fontSize: 18, marginRight: 12 },
  demoBannerText: { flex: 1, fontSize: 13, color: '#475569', fontFamily: 'Inter', lineHeight: 18 }
});
