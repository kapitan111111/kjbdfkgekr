import { Alert } from 'react-native';

export const showNotification = (title: string, message: string) => {
  Alert.alert(title, message);
};

export const scheduleNotification = (title: string, message: string, date: Date) => {
  // В реальном приложении здесь будет интеграция с push-уведомлениями
  console.log(`Запланировано уведомление: ${title} - ${message} на ${date}`);
};