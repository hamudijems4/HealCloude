import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme';
import { HeartPulse, ShieldCheck, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface HealthBatteryProps {
  level: number; // 0 to 100
  onComplete?: () => void;
}

export const HealthBattery = ({ level, onComplete }: HealthBatteryProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = () => {
    if (level > 70) return COLORS.accent;
    if (level > 30) return COLORS.warning;
    return COLORS.danger;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={StyleSheet.absoluteFill}
      />

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 1000 }}
        style={styles.content}
      >
        <MotiView
          animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 10000, loop: true, repeatReverse: false }}
          style={styles.glowRing}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'transparent', 'rgba(255,255,255,0.2)']}
            style={styles.ringGradient}
          />
        </MotiView>

        <View style={styles.batteryContainer}>
          <View style={styles.batteryCap} />
          <View style={styles.batteryBody}>
            <MotiView
              from={{ height: '0%' }}
              animate={{ height: `${level}%` }}
              transition={{ type: 'timing', duration: 2500, delay: 500 }}
              style={[styles.batteryFill, { backgroundColor: getStatusColor() }]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <MotiView
                from={{ translateY: 0 }}
                animate={{ translateY: -15 }}
                transition={{
                  type: 'timing',
                  duration: 2000,
                  loop: true,
                  repeatReverse: true,
                }}
                style={styles.wave}
              />
            </MotiView>
            
            <View style={styles.overlay}>
              <MotiView
                from={{ scale: 0, rotate: '-45deg' }}
                animate={{ scale: 1, rotate: '0deg' }}
                transition={{ delay: 1000, type: 'spring' }}
              >
                <HeartPulse size={56} color={COLORS.white} />
              </MotiView>
              <MotiText
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 1500 }}
                style={styles.levelText}
              >
                {level}%
              </MotiText>
            </View>
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 2000 }}
          style={styles.statusContainer}
        >
          <View style={styles.statusBadge}>
            <ShieldCheck size={16} color={COLORS.white} />
            <Text style={styles.statusBadgeText}>Secured by Fayda ID</Text>
          </View>
          <MotiText style={styles.vitalityTitle}>Health Vitality</MotiText>
          <Text style={styles.vitalityDesc}>System analyzing physiological ecosystem...</Text>
        </MotiView>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3000 }}
        style={styles.footer}
      >
        <View style={styles.footerBrand}>
          <Zap size={20} color={COLORS.white} />
          <Text style={styles.brandName}>TenaLink AI</Text>
        </View>
        <Text style={styles.copyright}>Ethiopian National Health Portal</Text>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
  },
  batteryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 240,
  },
  batteryCap: {
    width: 40,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: 4,
  },
  batteryBody: {
    width: 140,
    height: 220,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    ...SHADOWS.medium,
  },
  batteryFill: {
    width: '100%',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    transform: [{ scaleX: 1.5 }],
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  levelText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  vitalityTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  vitalityDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  copyright: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
});
