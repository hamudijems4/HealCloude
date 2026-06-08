import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { COLORS, BORDER_RADIUS } from './src/theme';
import { HealthBattery } from './src/components/HealthBattery';
import { Home, MessageSquare, ClipboardList } from 'lucide-react-native';
import {
  LoginScreen,
  DashboardScreen,
  ChatScreen,
  ProfileScreen,
  RecordsScreen,
} from './src/screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 34 : 24,
          left: 20,
          right: 20,
          backgroundColor: COLORS.card,
          borderRadius: 30,
          height: 76,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: COLORS.border,
          elevation: 10,
        },
      }}
    >
      <Tab.Screen
        name="Journey"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color }) => <Home size={24} color={color} /> }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.9}
              style={styles.chatTabButton}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.chatTabGradient}
              >
                <MessageSquare size={26} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Records"
        component={RecordsScreen}
        options={{ tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

// Stable inner navigator — reads auth state but never re-creates NavigationContainer
function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const [splashDone, setSplashDone] = useState(false);
  const onSplashComplete = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return <HealthBattery level={88} onComplete={onSplashComplete} />;
  }

  // NavigationContainer is rendered exactly once and never unmounted
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  chatTabButton: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  chatTabGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.background,
  },
});
