import { Stack } from 'expo-router';
import { useTheme } from '../../../src/contexts/ThemeContext';

export default function AdminLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Админ-панель',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="user-management" 
        options={{ 
          title: 'Управление пользователями',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="create-schedule" 
        options={{ 
          title: 'Создание расписания',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="create-news" 
        options={{ 
          title: 'Создание новости',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="student-stats" 
        options={{ 
          title: 'Статистика учеников',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="group-management" 
        options={{ 
          title: 'Управление группами',
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="system-reports" 
        options={{ 
          title: 'Системные отчеты',
          headerShown: true
        }} 
      />
    </Stack>
  );
}