// src/screens/admin/StudentStatsScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import Button from '../../components/common/Button';

const StudentStatsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
        Статистика учеников
      </AppText>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <AppText variant="medium" style={{ color: colors.text }}>
          Функционал в разработке
        </AppText>
        <AppText style={[styles.description, { color: colors.textSecondary }]}>
          Здесь будет отображаться статистика посещаемости и успеваемости студентов
        </AppText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default StudentStatsScreen;