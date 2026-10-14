import { useEffect, useCallback, useMemo } from 'react';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import useApi from './useApi';
import useTechnician from './useTechnician';

export default function useNotification() {
  const api = useApi();
  const { registerDevice } = useTechnician();

  useEffect(() => {
    if (api?.authorization) {
      registerForPushNotifications();
    }
  }, [registerDevice]);

  const registerForPushNotifications = useCallback(async () => {
    if (!Device.isDevice) {
      console.log('Debe ejecutarse en un dispositivo físico');
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    try {
      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      if (!token)
        throw new Error('No se pudo obtener el token de notificación push');

      await registerDevice({ type: 'expo', token: token.data });

      return token.data;
    } catch (error) {
      console.log('Error al registrar el token de notificación push:', error);
      return null;
    }
  }, [registerDevice]);

  const value = useMemo(() => ({
    registerForPushNotifications,
  }), [registerForPushNotifications]);

  return value;
}