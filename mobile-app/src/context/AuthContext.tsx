import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '../types';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await api.isAuthenticated();
      if (authenticated) {
        const profileData = await api.getProfile();
        setProfile(profileData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    const response = await api.login({ identifier, password });
    setProfile(response.profile);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await api.logout();
    setProfile(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
