// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoginScreen from '../screens/auth/LoginScreen';
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';
import AdminNavigator from './AdminNavigator';
import Loader from '../components/common/Loader';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { colors, isDark } = useTheme();

  if (isLoading) {
    return <Loader />;
  }

  const navigatorTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.notification,
    },
  };

  return (
    <NavigationContainer theme={navigatorTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
        ) : user.role === 'student' ? (
          <Stack.Screen name="Student" component={StudentNavigator} />
        ) : user.role === 'teacher' ? (
          <Stack.Screen name="Teacher" component={TeacherNavigator} />
        ) : user.role === 'admin' ? (
          <Stack.Screen name="Admin" component={AdminNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;