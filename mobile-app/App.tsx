import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen, DashboardScreen, ChatScreen, ProfileScreen, RecordsScreen } from './src/screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#5c59f0',
        tabBarInactiveTintColor: '#8492a6',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
          backgroundColor: '#ffffff'
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4
        }
      }}
    >
      <Tab.Screen name="Journey" component={DashboardScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>🤰</Text>, tabBarLabel: 'Journey' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>💬</Text>, tabBarLabel: 'TenaBot' }} />
      <Tab.Screen name="Records" component={RecordsScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>📋</Text>, tabBarLabel: 'Records' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 22 }}>👤</Text>, tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E6F4FE' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🏥</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E40AF' }}>TenaLink</Text>
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}
