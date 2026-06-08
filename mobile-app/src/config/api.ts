// For Android emulator use 10.0.2.2, for iOS simulator use localhost
// For physical device, use your computer's IP address
const API_BASE_URL = 'http://10.0.2.2:8000'; // Android emulator default
// const API_BASE_URL = 'http://localhost:8000'; // iOS simulator
// const API_BASE_URL = 'http://192.168.1.X:8000'; // Physical device (replace X with your IP)

export const API_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  PROFILE: '/api/v1/auth/profile',
  WELLNESS_SCORE: '/api/v1/wellness/risk-score',
  WELLNESS_CHAT: '/api/v1/wellness/chat',
  PATIENT_FHIR: (id: string) => `/api/v1/patients/${id}/fhir-bundle`,
  MOH_SUMMARY: '/api/v1/moh/summary',
  MOH_REGIONAL: '/api/v1/moh/regional-stats',
  MOH_ALERTS: '/api/v1/moh/disease-alerts',
};

export default API_BASE_URL;
