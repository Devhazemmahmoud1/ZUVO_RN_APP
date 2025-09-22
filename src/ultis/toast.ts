import Toast from 'react-native-toast-message';

export const showToast = {
  success: (title: string, msg?: string) =>
    Toast.show({ type: 'success', text1: title, text2: msg, visibilityTime: 2500 }),
  error: (title: string, msg?: string) =>
    Toast.show({ type: 'error', text1: title, text2: msg, visibilityTime: 3000 }),
  info: (title: string, msg?: string) =>
    Toast.show({ type: 'info', text1: title, text2: msg, visibilityTime: 2500 }),
};