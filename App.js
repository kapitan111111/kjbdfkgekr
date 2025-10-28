import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import StudentTabs from './navigation/StudentTabs';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Student" component={StudentTabs} />
          {/* Добавить Teacher и Admin */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}