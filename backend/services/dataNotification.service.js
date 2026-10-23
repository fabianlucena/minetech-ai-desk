export default class DataNotificationService {
  static listeners = [];

  addListener(listener) {
    DataNotificationService.listeners.push(listener);
  }
  
  removeListener(listener) {
    DataNotificationService.listeners = DataNotificationService.listeners.filter(l => l !== listener);
  }

  notify(notification) {
    for (const listener of DataNotificationService.listeners) {
      try {
        listener(notification);
      } catch (err) {
        console.error('Error notifying listener:', err);
      }
    }
  }
}