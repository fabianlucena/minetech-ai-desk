import logger from '../logger.js';

export async function sendMessage({ token, message, deactivateDevice }) {
  const response = await fetch(
    'https://exp.host/--/api/v2/push/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        title: 'Nuevo ticket',
        body: message.text,
        data: message.data || {},
      }),
    }
  );

  const result = await response.json();
  if (result.data && result.data.status === 'ok') {
    logger.debug(`Message sent to ${token} successfully`);
  } else {
    logger.error(`Failed to send message to ${token}:`, result);
  }

  if (result.data && result.data.status === 'error') {
    logger.error(`Error sending message to ${token}:`, result.data?.message || result.data?.details?.error || result.errors?.join(', ') || 'Unknown error');
    if (result.data?.details?.error === 'DeviceNotRegistered') {
      if (deactivateDevice) {
        logger.warn(`Device for token ${token} is not registered. Deactivating device.`);
        await deactivateDevice();
      } else {
        logger.warn(`Device for token ${token} is not registered, but no deactivateDevice function was provided.`);
      }
    }
  }

  return result;
}