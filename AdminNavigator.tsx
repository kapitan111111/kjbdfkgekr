// src/navigation/AdminNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import ScheduleScreen from '../screens/student/ScheduleScreen';
import NewsScreen from '../screens/student/NewsScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import AdminPanelScreen from '../screens/admin/AdminPanelScreen';
import CreateNewsScreen from '../screens/student/CreateNewsScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import StudentStatsScreen from '../screens/admin/StudentStatsScreen';
import GroupManagementScreen from '../screens/admin/GroupManagementScreen';
import SystemReportsScreen from '../screens/admin/SystemReportsScreen';
import CreateScheduleScreen from '../screens/student/CreateScheduleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Стек для админ-панели
const AdminStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="AdminMain"
        component={AdminPanelScreen}
        options={{
          headerShown: true,
          title: 'Админ-панель'
        }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: 'Управление пользователями' }}
      />
      <Stack.Screen
        name="CreateSchedule"
        component={CreateScheduleScreen}
        options={{ title: 'Создание расписания' }}
      />
      <Stack.Screen
        name="CreateNews"
        component={CreateNewsScreen}
        options={{ title: 'Управление новостями' }}
      />
      <Stack.Screen
        name="StudentStats"
        component={StudentStatsScreen}
        options={{ title: 'Статистика учеников' }}
      />
      <Stack.Screen
        name="GroupManagement"
        component={GroupManagementScreen}
        options={{ title: 'Управление группами' }}
      />
      <Stack.Screen
        name="SystemReports"
        component={SystemReportsScreen}
        options={{ title: 'Системные отчеты' }}
      />
    </Stack.Navigator>
  );
};

// Стек для профиля
const ProfileStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AdminNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'time';

          if (route.name === 'Schedule') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: colors.card,
          shadowColor: colors.border,
          elevation: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      })}
    >
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Расписание',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminStack}
        options={{
          title: 'Админ-панель',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: 'Новости',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'Профиль',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;