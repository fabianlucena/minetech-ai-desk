export const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
export const apiUrl = baseUrl + '/api';
export const wsUrl = baseUrl + '/ws';
export const pingTimeout = 5000;
export const pongTimeout = 10000;
export const reconnectDelays = [1000, 1000, 2000, 3000, 5000, 8000, 10000];

export default {
  baseUrl,
  apiUrl,
  wsUrl,
  pingTimeout,
  pongTimeout,
  reconnectDelays,
};