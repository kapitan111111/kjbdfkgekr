import { User } from '../types';
import { apiService } from './api';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('🔐 Attempting login for:', email);

    const response = await apiService.login(email, password);
    console.log('✅ Login successful in authService');

    return response.user;
  } catch (error: any) {
    console.error('❌ Login error in authService:', error);

    if (error.message === 'Network request failed') {
      throw new Error('Не удалось подключиться к серверу. Проверьте:\n• Запущен ли бэкенд (npm run dev в папке backend)\n• Правильный ли URL API');
    }

    if (error.message.includes('401')) {
      throw new Error('Неверный email или пароль');
    }

    throw new Error(error.message || 'Ошибка авторизации');
  }
};

export const logout = async (): Promise<void> => {
  try {
    apiService.setToken('');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const setAuthToken = (token: string): void => {
  apiService.setToken(token);
};