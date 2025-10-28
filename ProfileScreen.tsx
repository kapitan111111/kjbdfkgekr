import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Switch
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import AppText from '../../components/common/AppText';
import { AttendanceRecord } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalClasses: 0,
    attended: 0,
    missed: 0,
    late: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (user?.role === 'student') {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = async () => {
    if (!user?.id) return;

    try {
      // Временно используем заглушку
      const mockRecords: AttendanceRecord[] = [
        {
          id: '1',
          studentId: user.id,
          scheduleId: '1',
          date: '2024-01-15',
          status: 'present'
        },
        {
          id: '2',
          studentId: user.id,
          scheduleId: '2',
          date: '2024-01-14',
          status: 'late'
        },
        {
          id: '3',
          studentId: user.id,
          scheduleId: '3',
          date: '2024-01-13',
          status: 'present'
        },
        {
          id: '4',
          studentId: user.id,
          scheduleId: '4',
          date: '2024-01-12',
          status: 'absent'
        },
      ];

      setAttendanceRecords(mockRecords);
      calculateStats(mockRecords);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const calculateStats = (records: AttendanceRecord[]) => {
    const totalClasses = records.length;
    const attended = records.filter(record => record.status === 'present').length;
    const late = records.filter(record => record.status === 'late').length;
    const missed = records.filter(record => record.status === 'absent').length;
    const attendanceRate = totalClasses ? Math.round((attended / totalClasses) * 100) : 0;

    setStats({
      totalClasses,
      attended,
      missed,
      late,
      attendanceRate
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendance();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'Студент';
      case 'teacher': return 'Преподаватель';
      case 'admin': return 'Администратор';
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#4CAF50';
      case 'absent': return '#F44336';
      case 'late': return '#FF9800';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Присутствовал';
      case 'absent': return 'Отсутствовал';
      case 'late': return 'Опоздал';
      default: return status;
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppText variant="bold">Пользователь не найден</AppText>
      </View>
    );
  }

  const recentClasses = attendanceRecords.slice(0, 4).map(record => ({
    id: record.id,
    name: 'React Native',
    date: new Date(record.date).toLocaleDateString('ru-RU'),
    status: record.status
  }));

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Заголовок профиля */}
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <AppText variant="bold" style={styles.avatarText}>
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AppText>
        </View>
        <AppText variant="bold" style={[styles.name, { color: colors.text }]}>{user.name}</AppText>
        <AppText style={[styles.email, { color: colors.textSecondary }]}>{user.email}</AppText>
        <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
          <AppText style={styles.roleText}>{getRoleText(user.role)}</AppText>
        </View>
        {user.group && (
          <AppText style={[styles.group, { color: colors.textSecondary }]}>Группа: {user.group}</AppText>
        )}
      </View>

      {/* Статистика посещаемости */}
      {user.role === 'student' && (
        <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
          <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>Статистика посещаемости</AppText>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <AppText variant="bold" style={[styles.statNumber, { color: colors.primary }]}>{stats.totalClasses}</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Всего занятий</AppText>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <AppText variant="bold" style={[styles.statNumber, { color: colors.primary }]}>{stats.attended}</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Посещено</AppText>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <AppText variant="bold" style={[styles.statNumber, { color: colors.primary }]}>{stats.missed}</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Пропущено</AppText>
            </View>
            <View style={[styles.statItem, { backgroundColor: colors.background }]}>
              <AppText variant="bold" style={[styles.statNumber, { color: colors.primary }]}>{stats.attendanceRate}%</AppText>
              <AppText style={[styles.statLabel, { color: colors.textSecondary }]}>Посещаемость</AppText>
            </View>
          </View>

          {/* График посещаемости */}
          <View style={styles.attendanceChart}>
            <View style={[styles.chartBar, { backgroundColor: colors.grayLight }]}>
              <View
                style={[
                  styles.chartFill,
                  {
                    width: `${stats.attendanceRate}%`,
                    backgroundColor: stats.attendanceRate >= 80 ? '#4CAF50' :
                                   stats.attendanceRate >= 60 ? '#FF9800' : '#F44336'
                  }
                ]}
              />
            </View>
            <View style={styles.chartLabels}>
              <AppText style={[styles.chartLabel, { color: colors.textSecondary }]}>0%</AppText>
              <AppText style={[styles.chartLabel, { color: colors.textSecondary }]}>50%</AppText>
              <AppText style={[styles.chartLabel, { color: colors.textSecondary }]}>100%</AppText>
            </View>
          </View>
        </View>
      )}

      {/* История занятий */}
      {user.role === 'student' && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>Последние занятия</AppText>
          <View style={styles.classesList}>
            {recentClasses.map((classItem) => (
              <View key={classItem.id} style={styles.classItem}>
                <View style={styles.classInfo}>
                  <AppText variant="medium" style={[styles.className, { color: colors.text }]}>{classItem.name}</AppText>
                  <AppText style={[styles.classDate, { color: colors.textSecondary }]}>{classItem.date}</AppText>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(classItem.status)}20` }
                ]}>
                  <AppText style={[
                    styles.statusText,
                    { color: getStatusColor(classItem.status) }
                  ]}>
                    {getStatusText(classItem.status)}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Достижения (для студентов) */}
      {user.role === 'student' && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>Достижения</AppText>
          <View style={styles.achievements}>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FFD700' }]}>
                <AppText>🏆</AppText>
              </View>
              <AppText style={[styles.achievementText, { color: colors.textSecondary }]}>Отличная посещаемость</AppText>
            </View>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#C0C0C0' }]}>
                <AppText>⭐</AppText>
              </View>
              <AppText style={[styles.achievementText, { color: colors.textSecondary }]}>Активный студент</AppText>
            </View>
          </View>
        </View>
      )}

      {/* Действия преподавателя/админа */}
      {(user.role === 'teacher' || user.role === 'admin') && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>Быстрые действия</AppText>
          <View style={styles.actionsGrid}>
            {user.role === 'teacher' && (
              <>
                <Button
                  title="Отметить посещаемость"
                  onPress={() => Alert.alert('Переход к посещаемости')}
                  variant="secondary"
                />
                <Button
                  title="Мое расписание"
                  onPress={() => Alert.alert('Переход к расписанию')}
                  variant="secondary"
                />
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Button
                  title="Управление пользователями"
                  onPress={() => Alert.alert('Переход к управлению')}
                  variant="secondary"
                />
                <Button
                  title="Создать расписание"
                  onPress={() => Alert.alert('Создание расписания')}
                  variant="secondary"
                />
              </>
            )}
          </View>
        </View>
      )}

      {/* Внешний вид (НОВАЯ СЕКЦИЯ) */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>Внешний вид</AppText>

        {/* Быстрый переключатель */}
        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          <View style={styles.themeInfo}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={24}
              color={colors.primary}
            />
            <View style={styles.themeText}>
              <AppText variant="medium" style={{ color: colors.text }}>Тёмная тема</AppText>
              <AppText style={[styles.themeSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Включена' : 'Выключена'}
              </AppText>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.grayLight, true: colors.primaryLight }}
            thumbColor={isDark ? colors.primary : colors.gray}
          />
        </TouchableOpacity>

        {/* Детальные настройки */}
        <Button
          title="Все настройки темы"
          onPress={() => navigation.navigate('ThemeSettings' as never)}
          variant="secondary"
        />
      </View>

      {/* Настройки */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: colors.text }]}>Настройки</AppText>
        <Button
          title="Уведомления"
          onPress={() => Alert.alert('Уведомления', 'Настройки уведомлений')}
          variant="secondary"
        />
        <Button
          title="Сменить пароль"
          onPress={() => Alert.alert('Смена пароля', 'Функция в разработке')}
          variant="secondary"
        />
      </View>

      {/* Выход */}
      <View style={styles.logoutSection}>
        <Button
          title="Выйти из аккаунта"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
  },
  name: {
    fontSize: 28,
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  group: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  attendanceChart: {
    marginTop: 10,
  },
  chartBar: {
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  chartFill: {
    height: '100%',
    borderRadius: 10,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classesList: {
    gap: 12,
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    marginBottom: 4,
  },
  classDate: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievement: {
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionsGrid: {
    gap: 10,
  },
  logoutSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  // НОВЫЕ СТИЛИ ДЛЯ ПЕРЕКЛЮЧАТЕЛЯ ТЕМЫ
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 15,
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
});

export default ProfileScreen;