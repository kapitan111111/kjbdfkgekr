// src/screens/admin/SystemReportsScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import Button from '../../components/common/Button';

const SystemReportsScreen: React.FC = () => {
  const { colors } = useTheme();

  const reports = [
    { title: 'Отчет по посещаемости', description: 'Статистика посещаемости за месяц' },
    { title: 'Академическая успеваемость', description: 'Результаты тестов и экзаменов' },
    { title: 'Финансовый отчет', description: 'Доходы и расходы школы' },
    { title: 'Отчет по нагрузке преподавателей', description: 'Распределение часов' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
        Системные отчеты
      </AppText>

      <View style={styles.reportsGrid}>
        {reports.map((report, index) => (
          <View key={index} style={[styles.reportCard, { backgroundColor: colors.card }]}>
            <AppText variant="bold" style={[styles.reportTitle, { color: colors.text }]}>
              {report.title}
            </AppText>
            <AppText style={[styles.reportDescription, { color: colors.textSecondary }]}>
              {report.description}
            </AppText>
            <Button
              title="Сгенерировать"
              onPress={() => {}}
              variant="secondary"
              size="small"
            />
          </View>
        ))}
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
  reportsGrid: {
    gap: 16,
  },
  reportCard: {
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  reportTitle: {
    fontSize: 18,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SystemReportsScreen;