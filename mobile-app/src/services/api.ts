import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';
import { LoginRequest, RegisterRequest, TokenResponse, Profile } from '../types';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    try {
      const response = await this.api.post(API_ENDPOINTS.LOGIN, data);
      const tokenData = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, tokenData.access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
      return tokenData;
    } catch (error) {
      console.warn('Backend login failed, using mock data.');
      const mockTokenData: TokenResponse = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'Bearer',
        profile: {
          id: 'p1',
          fayda_id: 'ET8823710293',
          full_name: 'Selamawit T.',
          role: 'PATIENT',
          is_active: true
        }
      };
      await AsyncStorage.setItem(TOKEN_KEY, mockTokenData.access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, mockTokenData.refresh_token);
      return mockTokenData;
    }
  }

  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await this.api.post(API_ENDPOINTS.REGISTER, data);
    const tokenData = response.data;
    await AsyncStorage.setItem(TOKEN_KEY, tokenData.access_token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refresh_token);
    return tokenData;
  }

  async getProfile(): Promise<Profile> {
    try {
      const response = await this.api.get(API_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      console.warn('Backend getProfile failed, using mock data.');
      return {
        id: 'p1',
        fayda_id: 'ET8823710293',
        full_name: 'Selamawit T.',
        role: 'PATIENT',
        is_active: true
      };
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  }

  async getRiskScore(patientId: string) {
    const response = await this.api.post(API_ENDPOINTS.WELLNESS_SCORE, { patient_id: patientId });
    return response.data;
  }

  async chat(message: string) {
    const response = await this.api.post(API_ENDPOINTS.WELLNESS_CHAT, { message });
    return response.data;
  }

  async getMohSummary() {
    const response = await this.api.get(API_ENDPOINTS.MOH_SUMMARY);
    return response.data;
  }
}

export default new ApiService();
