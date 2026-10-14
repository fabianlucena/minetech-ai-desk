import { useMemo } from 'react';
import useApi from './useApi';

export default function useTechnician() {
  const api = useApi();

  return useMemo(() => ({
    registerDevice: (body, params) => api.postJson('v1/technicians/devices/register', { body, ...params }),
  }), [api]);
}