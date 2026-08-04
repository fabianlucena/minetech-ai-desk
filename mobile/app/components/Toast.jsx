import RNToast from 'react-native-toast-message';

export function success(text1, text2) {
  RNToast.show({ type: 'success', text1, text2 });
}

export function info(text1, text2) {
  RNToast.show({ type: 'info', text1, text2 });
}

export function warning(text1, text2) {
  RNToast.show({ type: 'warning', text1, text2 });
}

export function error(text1, text2) {
  RNToast.show({ type: 'error', text1, text2 });
}