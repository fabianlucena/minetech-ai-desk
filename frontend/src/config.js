export const baseUrl = import.meta.env.VITE_API_URL ?? '';
export const apiUrl = baseUrl + '/api';
export const wsUrl = baseUrl + '/ws';

export default {
  baseUrl,
  apiUrl,
  wsUrl,
};