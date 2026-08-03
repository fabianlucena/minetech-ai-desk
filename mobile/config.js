export const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
export const apiUrl = baseUrl + '/api';
export const wsUrl = baseUrl + '/ws';

export default {
  baseUrl,
  apiUrl,
  wsUrl,
};