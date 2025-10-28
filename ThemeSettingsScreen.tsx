import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

const ThemeSettingsScreen: React.FC = () => {
  const { theme, colors, isDark, setTheme, toggleTheme } = useTheme();

  const themes = [
    { value: 'auto' as const, label: 'Авто', icon: 'phone-portrait-outline' },
    { value: 'light' as const, label: 'Светлая', icon: 'sunny-outline' },
    { value: 'dark' as const, label: 'Тёмная', icon: 'moon-outline' },
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  const handleReset = () => {
    Alert.alert(
      'Сброс настроек',
      'Вернуть настройки темы по умолчанию?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: () => setTheme('auto')
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <AppText variant="bold" style={[styles.title, { color: colors.text }]}>Настройки темы</AppText>

      {/* Текущая тема */}
      <View style={[styles.currentTheme, { backgroundColor: colors.card }]}>
        <View style={styles.themeInfo}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={24}
            color={colors.primary}
          />
          <View style={styles.themeText}>
            <AppText variant="bold" style={{ color: colors.text }}>Текущая тема</AppText>
            <AppText style={[styles.themeSubtitle, { color: colors.textSecondary }]}>
              {themes.find(t => t.value === theme)?.label}
              {theme === 'auto' && ` (${isDark ? 'Тёмная' : 'Светлая'})`}
            </AppText>
          </View>
        </View>
      </View>

      {/* Выбор темы */}
      <View style={styles.section}>
        <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>Выбор темы</AppText>
        <View style={styles.themesList}>
          {themes.map((themeOption) => (
            <Button
              key={themeOption.value}
              title={themeOption.label}
              onPress={() => handleThemeChange(themeOption.value)}
              variant={theme === themeOption.value ? 'primary' : 'secondary'}
              icon={<Ionicons
                name={themeOption.icon as any}
                size={20}
                color={theme === themeOption.value ? '#FFFFFF' : colors.text}
              />}
              style={styles.themeButton}
            />
          ))}
        </View>
      </View>

      {/* Предпросмотр */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>Предпросмотр</AppText>
        <View style={styles.preview}>
          <View style={[styles.previewCard, { backgroundColor: colors.background }]}>
            <AppText variant="bold" style={{ color: colors.text }}>Пример карточки</AppText>
            <AppText style={[styles.previewText, { color: colors.textSecondary }]}>
              Это пример текста в выбранной теме
            </AppText>
            <View style={styles.previewActions}>
              <Button
                title="Основная"
                variant="primary"
                size="small"
                onPress={() => {}}
              />
              <Button
                title="Вторичная"
                variant="secondary"
                size="small"
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Действия */}
      <View style={styles.actions}>
        <Button
          title="Сбросить настройки"
          variant="outline"
          onPress={handleReset}
          icon={<Ionicons name="refresh-outline" size={16} color={colors.primary} />}
        />
      </View>

      {/* Информация */}
      <View style={[styles.info, { backgroundColor: colors.card }]}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <AppText style={[styles.infoText, { color: colors.textSecondary }]}>
          В режиме «Авто» тема будет автоматически меняться в зависимости от настроек вашего устройства
        </AppText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  currentTheme: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    gap: 2,
  },
  themeSubtitle: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  themesList: {
    gap: 12,
  },
  themeButton: {
    justifyContent: 'flex-start',
  },
  preview: {
    alignItems: 'center',
  },
  previewCard: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  previewText: {
    fontSize: 14,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actions: {
    marginBottom: 20,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});

export default ThemeSettingsScreen;