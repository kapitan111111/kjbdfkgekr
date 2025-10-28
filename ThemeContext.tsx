// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  gray: string;
  grayLight: string;
  grayDark: string;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Светлая тема (оставляем как было)
const lightColors: ThemeColors = {
  primary: '#007AFF',
  primaryLight: '#4DA3FF',
  primaryDark: '#0056CC',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1C1C1E',
  textSecondary: '#3C3C4399',
  border: '#C6C6C8',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gray: '#8E8E93',
  grayLight: '#C7C7CC',
  grayDark: '#48484A',
};

// Тёмная тема Material Design (ИСПРАВЛЕНА)
const darkColors: ThemeColors = {
  primary: '#007AFF',        // Голубые кнопки остаются
  primaryLight: '#4DA3FF',   // Светло-голубой
  primaryDark: '#0056CC',    // Тёмно-голубой

  // Основные цвета тёмной темы
  background: '#121212',     // Тёмно-серый фон
  card: '#1E1E1E',          // Карточки немного светлее фона
  text: '#FFFFFF',          // Белый текст
  textSecondary: '#B0B0B0', // Светло-серый второстепенный текст

  border: '#383838',        // Тёмно-серая граница
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gray: '#8E8E93',
  grayLight: '#48484A',
  grayDark: '#1C1C1E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('app_theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isDark = theme === 'auto' ? systemColorScheme === 'dark' : theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};