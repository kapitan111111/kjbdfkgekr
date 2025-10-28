import React from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Platform 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import AppText from '../../components/common/AppText';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

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

  // Статистика посещаемости (заглушка)
  const stats = {
    totalClasses: 45,
    attended: 38,
    missed: 7,
    late: 3,
    attendanceRate: 84
  };

  // История занятий (заглушка)
  const recentClasses = [
    { id: '1', name: 'React Native', date: '15 января, 10:00', status: 'present' },
    { id: '2', name: 'JavaScript', date: '14 января, 14:00', status: 'late' },
    { id: '3', name: 'TypeScript', date: '13 января, 12:00', status: 'present' },
    { id: '4', name: 'HTML/CSS', date: '12 января, 09:00', status: 'absent' },
  ];

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
      <View style={styles.container}>
        <AppText variant="bold">Пользователь не найден</AppText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Заголовок профиля */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <AppText variant="bold" style={styles.avatarText}>
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AppText>
        </View>
        <AppText variant="bold" style={styles.name}>{user.name}</AppText>
        <AppText style={styles.email}>{user.email}</AppText>
        <View style={styles.roleBadge}>
          <AppText style={styles.roleText}>{getRoleText(user.role)}</AppText>
        </View>
        {user.group && (
          <AppText style={styles.group}>Группа: {user.group}</AppText>
        )}
      </View>

      {/* Статистика посещаемости */}
      <View style={styles.statsSection}>
        <AppText variant="bold" style={styles.sectionTitle}>Статистика посещаемости</AppText>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <AppText variant="bold" style={styles.statNumber}>{stats.totalClasses}</AppText>
            <AppText style={styles.statLabel}>Всего занятий</AppText>
          </View>
          <View style={styles.statItem}>
            <AppText variant="bold" style={styles.statNumber}>{stats.attended}</AppText>
            <AppText style={styles.statLabel}>Посещено</AppText>
          </View>
          <View style={styles.statItem}>
            <AppText variant="bold" style={styles.statNumber}>{stats.missed}</AppText>
            <AppText style={styles.statLabel}>Пропущено</AppText>
          </View>
          <View style={styles.statItem}>
            <AppText variant="bold" style={styles.statNumber}>{stats.attendanceRate}%</AppText>
            <AppText style={styles.statLabel}>Посещаемость</AppText>
          </View>
        </View>

        {/* График посещаемости (упрощенный) */}
        <View style={styles.attendanceChart}>
          <View style={styles.chartBar}>
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
            <AppText style={styles.chartLabel}>0%</AppText>
            <AppText style={styles.chartLabel}>50%</AppText>
            <AppText style={styles.chartLabel}>100%</AppText>
          </View>
        </View>
      </View>

      {/* История занятий */}
      <View style={styles.section}>
        <AppText variant="bold" style={styles.sectionTitle}>Последние занятия</AppText>
        <View style={styles.classesList}>
          {recentClasses.map((classItem) => (
            <View key={classItem.id} style={styles.classItem}>
              <View style={styles.classInfo}>
                <AppText variant="medium" style={styles.className}>{classItem.name}</AppText>
                <AppText style={styles.classDate}>{classItem.date}</AppText>
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

      {/* Достижения (для студентов) */}
      {user.role === 'student' && (
        <View style={styles.section}>
          <AppText variant="bold" style={styles.sectionTitle}>Достижения</AppText>
          <View style={styles.achievements}>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FFD700' }]}>
                <AppText>🏆</AppText>
              </View>
              <AppText style={styles.achievementText}>Отличная посещаемость</AppText>
            </View>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: '#C0C0C0' }]}>
                <AppText>⭐</AppText>
              </View>
              <AppText style={styles.achievementText}>Активный студент</AppText>
            </View>
          </View>
        </View>
      )}

      {/* Действия преподавателя/админа */}
      {(user.role === 'teacher' || user.role === 'admin') && (
        <View style={styles.section}>
          <AppText variant="bold" style={styles.sectionTitle}>Быстрые действия</AppText>
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

      {/* Настройки */}
      <View style={styles.section}>
        <AppText variant="bold" style={styles.sectionTitle}>Настройки</AppText>
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
        <Button
          title="Тема приложения"
          onPress={() => navigation.navigate('ThemeSettings' as never)}
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
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#007AFF',
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
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  roleBadge: {
    backgroundColor: '#007AFF',
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
    color: '#666',
    fontWeight: '500',
  },
  statsSection: {
    marginBottom: 25,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  attendanceChart: {
    marginTop: 10,
  },
  chartBar: {
    height: 20,
    backgroundColor: '#e9ecef',
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
    color: '#666',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  classDate: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
  },
  actionsGrid: {
    gap: 10,
  },
  logoutSection: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default ProfileScreen;