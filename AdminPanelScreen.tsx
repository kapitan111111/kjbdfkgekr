import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import AppText from '../../components/common/AppText';
import { Ionicons } from '@expo/vector-icons';

const AdminPanelScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const adminSections = [
    {
      title: 'Управление пользователями',
      description: 'Добавление, редактирование и удаление пользователей',
      icon: 'people',
      iconColor: '#007AFF',
      route: '/admin/user-management',
    },
    {
      title: 'Создание расписания',
      description: 'Создание и редактирование учебного расписания',
      icon: 'calendar',
      iconColor: '#34C759',
      route: '/admin/create-schedule',
    },
    {
      title: 'Создание новости',
      description: 'Публикация и управление школьными новостями',
      icon: 'newspaper',
      iconColor: '#FF9500',
      route: '/admin/create-news',
    },
    {
      title: 'Статистика учеников',
      description: 'Анализ успеваемости и посещаемости студентов',
      icon: 'bar-chart',
      iconColor: '#AF52DE',
      route: '/admin/student-stats',
    },
    {
      title: 'Управление группами',
      description: 'Создание и настройка учебных групп',
      icon: 'business',
      iconColor: '#FF3B30',
      route: '/admin/group-management',
    },
    {
      title: 'Системные отчёты',
      description: 'Общая статистика и аналитика системы',
      icon: 'document-text',
      iconColor: '#5856D6',
      route: '/admin/system-reports',
    },
  ];

  const quickStats = [
    { label: 'Всего студентов', value: '156', color: '#007AFF' },
    { label: 'Преподавателей', value: '24', color: '#34C759' },
    { label: 'Активных групп', value: '12', color: '#FF9500' },
    { label: 'Занятий сегодня', value: '18', color: '#AF52DE' },
  ];

  const handleSectionPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Заголовок и приветствие */}
      <View style={styles.header}>
        <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
          Админ-панель
        </AppText>
        <AppText style={[styles.welcome, { color: colors.textSecondary }]}>
          Добро пожаловать, {user?.name}!
        </AppText>
      </View>

      {/* Быстрая статистика */}
      <View style={styles.statsSection}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>
          Общая статистика
        </AppText>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <View
              key={index}
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderLeftColor: stat.color,
                  borderLeftWidth: 4,
                }
              ]}
            >
              <AppText variant="bold" style={[styles.statValue, { color: colors.text }]}>
                {stat.value}
              </AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Основные разделы админ-панели */}
      <View style={styles.sectionsContainer}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>
          Управление системой
        </AppText>
        <View style={styles.sectionsGrid}>
          {adminSections.map((section, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sectionCard, { backgroundColor: colors.card }]}
              onPress={() => handleSectionPress(section.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: section.iconColor + '20' }]}>
                <Ionicons
                  name={section.icon as any}
                  size={32}
                  color={section.iconColor}
                />
              </View>
              <View style={styles.sectionContent}>
                <AppText variant="bold" style={[styles.sectionTitleText, { color: colors.text }]}>
                  {section.title}
                </AppText>
                <AppText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                  {section.description}
                </AppText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 5,
  },
  welcome: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  statsSection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionsContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  sectionsGrid: {
    gap: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitleText: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default AdminPanelScreen;