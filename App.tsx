import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppFonts } from './src/hooks/useFonts';
import { AppText } from './src/components/common/AppText';

export default function Layout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <AppText>Загрузка шрифтов...</AppText>
      </View>
    );
  }

  return (
    // Ваша навигация и т.д.
  );
}