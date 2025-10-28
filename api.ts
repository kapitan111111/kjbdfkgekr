import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ScheduleItem, NewsItem, AttendanceRecord } from '../types';

// Для Android эмулятора используем 10.0.2.2 вместо localhost
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';  // Для Android эмулятора
    } else {
      return 'http://localhost:5000/api'; // Для iOS симулятора
    }
  }
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadTokenFromStorage();
  }

  private async loadTokenFromStorage() {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        this.token = storedToken;
        console.log('✅ Token loaded from storage');
      }
    } catch (error) {
      console.error('❌ Error loading token from storage:', error);
    }
  }

  setToken(token: string) {
    this.token = token;
    // Сохраняем токен в AsyncStorage
    AsyncStorage.setItem('token', token).catch(error => {
      console.error('Error saving token to storage:', error);
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`🌐 Making request to: ${url}`);
    console.log(`🔐 Token exists: ${!!this.token}`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен в заголовки, если он есть
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log('🔑 Adding Authorization header with token');
    }

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = 'Network error';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `API Error: ${response.status}`;
          console.log('❌ API Error message:', errorMessage);
        } catch (parseError) {
          errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Request successful');
      return data.data || data;

    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  // Аутентификация
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    console.log('🔐 Starting login process...');

    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Сохраняем токен после успешного логина
    this.setToken(response.token);
    console.log('✅ Login successful, token saved');

    return response;
  }

  async register(userData: Omit<User, 'id'> & { password: string }): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Расписание
  async getSchedule(params?: { group?: string; teacherId?: string; date?: string }): Promise<ScheduleItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.group) queryParams.append('group', params.group);
    if (params?.teacherId) queryParams.append('teacherId', params.teacherId);
    if (params?.date) queryParams.append('date', params.date);

    const response = await this.request<{ schedules: ScheduleItem[] }>(`/schedule?${queryParams.toString()}`);
    return response.schedules;
  }

  async createSchedule(item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
    const response = await this.request<{ schedule: ScheduleItem }>('/schedule', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.schedule;
  }

  async updateSchedule(id: string, item: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const response = await this.request<{ schedule: ScheduleItem }>(`/schedule/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return response.schedule;
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.request(`/schedule/${id}`, {
      method: 'DELETE',
    });
  }

  // Посещаемость
  async getStudentAttendance(studentId: string, date?: string): Promise<AttendanceRecord[]> {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);

    const response = await this.request<{ attendance: AttendanceRecord[] }>(
      `/attendance/student/${studentId}?${queryParams.toString()}`
    );
    return response.attendance;
  }

  async getAttendanceBySchedule(scheduleId: string): Promise<AttendanceRecord[]> {
    const response = await this.request<{ attendance: AttendanceRecord[] }>(
      `/attendance/schedule/${scheduleId}`
    );
    return response.attendance;
  }

  async markAttendance(records: Omit<AttendanceRecord, 'id'>[]): Promise<AttendanceRecord[]> {
    const response = await this.request<{ attendance: AttendanceRecord[] }>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ records }),
    });
    return response.attendance;
  }

  // Новости
  async getNews(): Promise<NewsItem[]> {
    const response = await this.request<{ news: NewsItem[] }>('/news');
    return response.news;
  }

  async getNewsForGroup(group: string): Promise<NewsItem[]> {
    const response = await this.request<{ news: NewsItem[] }>(`/news/group/${group}`);
    return response.news;
  }

  async createNews(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    const response = await this.request<{ news: NewsItem }>('/news', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.news;
  }

  // Пользователи
  async getUsers(): Promise<User[]> {
    const response = await this.request<{ users: User[] }>('/users');
    return response.users;
  }

  async createUser(user: Omit<User, 'id'> & { password: string }): Promise<User> {
    const response = await this.request<{ user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.user;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await this.request<{ user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
    return response.user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Проверка соединения
  async testConnection(): Promise<boolean> {
    try {
      await this.getUsers();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();