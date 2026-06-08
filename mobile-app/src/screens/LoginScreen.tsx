import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Shield, Lock, Smartphone, ChevronRight, Info } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../theme';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [faydaId, setFaydaId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!faydaId || !pin) {
      // Small validation
      return;
    }
    setLoading(true);
    try {
      await login(faydaId, pin);
    } catch (error: any) {
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[COLORS.primaryLight, COLORS.background]} 
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Header Section */}
          <MotiView 
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 1000 }}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.logoGradient}
              >
                <Shield size={40} color={COLORS.white} />
              </LinearGradient>
              <MotiView
                from={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 500, type: 'spring' }}
                style={styles.logoBadge}
              >
                <Lock size={12} color={COLORS.white} />
              </MotiView>
            </View>
            <MotiText 
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 300 }}
              style={styles.title}
            >
              TenaLink
            </MotiText>
            <MotiText 
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 400 }}
              style={styles.subtitle}
            >
              National Health Portal • Fayda ID
            </MotiText>
          </MotiView>

          {/* Login Card */}
          <MotiView 
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 500 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Sign In to Your Profile</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ethiopian National ID (Fayda)</Text>
              <View style={styles.inputWrapper}>
                <Smartphone size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={faydaId}
                  onChangeText={setFaydaId}
                  placeholder="ET-8823710-29"
                  placeholderTextColor={COLORS.textMuted}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secure PIN / Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={pin}
                  onChangeText={setPin}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.loginBtn, (!faydaId || !pin || loading) && styles.loginBtnDisabled]} 
              onPress={handleLogin} 
              disabled={loading || !faydaId || !pin}
            >
              <LinearGradient 
                colors={loading ? [COLORS.textMuted, COLORS.textMuted] : [COLORS.primary, COLORS.secondary]} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }} 
                style={styles.btnGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.loginBtnText}>Secure Sign In</Text>
                    <ChevronRight size={20} color={COLORS.white} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.infoBox}>
              <Info size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Your medical data is encrypted under Ethiopian Federal Health privacy protocols.
              </Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1000 }}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Need help with Fayda ID?</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact Support</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scrollContainer: { 
    flexGrow: 1, 
    padding: SPACING.lg, 
    justifyContent: 'center',
    paddingBottom: 40 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: SPACING.xxl 
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.accent,
    padding: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: COLORS.text,
    letterSpacing: -0.5
  },
  subtitle: { 
    fontSize: 14, 
    color: COLORS.textMuted, 
    marginTop: SPACING.xs, 
    fontWeight: '500' 
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center'
  },
  inputGroup: { 
    marginBottom: SPACING.lg 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: COLORS.text, 
    marginBottom: SPACING.sm,
    marginLeft: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardAlt,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: { 
    flex: 1,
    fontSize: 16, 
    color: COLORS.text,
    fontWeight: '500'
  },
  loginBtn: { 
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: SPACING.sm,
  },
  loginBtnText: { 
    color: COLORS.white, 
    fontSize: 16, 
    fontWeight: '700' 
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    lineHeight: 18
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.xs
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  }
});
