import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import Button from '../../components/common/Button';
import { attendanceService } from '../../services/attendanceService';
import { scheduleService } from '../../services/scheduleService';
import { ScheduleItem, AttendanceRecord } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface Student {
  id: string;
  name: string;
  group: string;
  avatar?: string;
}

const AttendanceScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: 'present' | 'absent' | 'late' }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Загрузка расписания преподавателя
  useEffect(() => {
    loadTeacherSchedules();
  }, [user]);

  // Загрузка студентов при выборе занятия
  useEffect(() => {
    if (selectedSchedule) {
      loadStudentsForGroup(selectedSchedule.group);
      loadAttendanceForSchedule(selectedSchedule.id);
    }
  }, [selectedSchedule]);

  const loadTeacherSchedules = async () => {
    if (!user?.id) return;

    try {
      const teacherSchedules = await scheduleService.getTeacherSchedule(user.id);
      // Фильтруем расписание на сегодня и будущие даты
      const today = new Date().toISOString().split('T')[0];
      const upcomingSchedules = teacherSchedules.filter(schedule => 
        schedule.date >= today
      ).sort((a, b) => a.date.localeCompare(b.date));
      
      setSchedules(upcomingSchedules);
      
      // Автоматически выбираем первое занятие на сегодня
      const todaysSchedule = upcomingSchedules.find(schedule => schedule.date === today);
      if (todaysSchedule) {
        setSelectedSchedule(todaysSchedule);
      } else if (upcomingSchedules.length > 0) {
        setSelectedSchedule(upcomingSchedules[0]);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const loadStudentsForGroup = async (group: string) => {
    // Временная заглушка - в реальном приложении здесь будет запрос к API
    const mockStudents: Student[] = [
      { id: '1', name: 'Иван Иванов', group },
      { id: '2', name: 'Петр Петров', group },
      { id: '3', name: 'Мария Сидорова', group },
      { id: '4', name: 'Анна Козлова', group },
      { id: '5', name: 'Сергей Смирнов', group },
      { id: '6', name: 'Елена Волкова', group },
    ];
    setStudents(mockStudents);
  };

  const loadAttendanceForSchedule = async (scheduleId: string) => {
    try {
      const records = await attendanceService.getAttendanceBySchedule(scheduleId);
      const attendanceMap: { [key: string]: 'present' | 'absent' | 'late' } = {};
      records.forEach(record => {
        attendanceMap[record.studentId] = record.status;
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSchedule) {
      Alert.alert('Ошибка', 'Выберите занятие');
      return;
    }

    setIsLoading(true);
    try {
      const records = students.map(student => ({
        studentId: student.id,
        scheduleId: selectedSchedule.id,
        date: selectedSchedule.date,
        status: attendance[student.id] || 'absent',
      }));

      await attendanceService.markAttendance(records);

      const presentCount = Object.values(attendance).filter(status => status === 'present').length;
      const lateCount = Object.values(attendance).filter(status => status === 'late').length;
      const absentCount = students.length - presentCount - lateCount;

      Alert.alert(
        'Успех',
        `Посещаемость сохранена!\n\n📊 Статистика:\n• Присутствуют: ${presentCount}\n• Опоздали: ${lateCount}\n• Отсутствуют: ${absentCount}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить посещаемость');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelectAll = (status: 'present' | 'absent') => {
    const newAttendance: { [key: string]: 'present' | 'absent' | 'late' } = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeacherSchedules();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return colors.success;
      case 'absent': return colors.error;
      case 'late': return colors.warning;
      default: return colors.gray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return 'checkmark-circle';
      case 'absent': return 'close-circle';
      case 'late': return 'time';
      default: return 'help-circle';
    }
  };

  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    absent: students.length - Object.values(attendance).filter(s => s === 'present' || s === 'late').length,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Заголовок и статистика */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
          Отметка посещаемости
        </AppText>
        
        {selectedSchedule && (
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: colors.success }]} />
              <AppText style={[styles.statText, { color: colors.text }]}>{stats.present}</AppText>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: colors.warning }]} />
              <AppText style={[styles.statText, { color: colors.text }]}>{stats.late}</AppText>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: colors.error }]} />
              <AppText style={[styles.statText, { color: colors.text }]}>{stats.absent}</AppText>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Выбор занятия */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>
            Выберите занятие
          </AppText>
          
          {schedules.length === 0 ? (
            <AppText style={[styles.noDataText, { color: colors.textSecondary }]}>
              Нет предстоящих занятий
            </AppText>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.schedulesScroll}>
              {schedules.map((schedule) => (
                <Button
                  key={schedule.id}
                  title={`${schedule.subject}\n${schedule.date} ${schedule.startTime}`}
                  onPress={() => setSelectedSchedule(schedule)}
                  variant={selectedSchedule?.id === schedule.id ? 'primary' : 'secondary'}
                  size="small"
                  style={styles.scheduleButton}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Информация о выбранном занятии */}
        {selectedSchedule && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <AppText variant="bold" style={[styles.scheduleTitle, { color: colors.text }]}>
              {selectedSchedule.subject}
            </AppText>
            <View style={styles.scheduleDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <AppText style={[styles.detailText, { color: colors.textSecondary }]}>
                  {new Date(selectedSchedule.date).toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </AppText>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <AppText style={[styles.detailText, { color: colors.textSecondary }]}>
                  {selectedSchedule.startTime} - {selectedSchedule.endTime}
                </AppText>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                <AppText style={[styles.detailText, { color: colors.textSecondary }]}>
                  {selectedSchedule.classroom}
                </AppText>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                <AppText style={[styles.detailText, { color: colors.textSecondary }]}>
                  Группа: {selectedSchedule.group}
                </AppText>
              </View>
            </View>
          </View>
        )}

        {/* Быстрый выбор для всех */}
        {students.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>
              Быстрый выбор
            </AppText>
            <View style={styles.quickActions}>
              <Button
                title="Все присутствуют"
                onPress={() => handleQuickSelectAll('present')}
                variant="secondary"
                size="small"
                icon={<Ionicons name="checkmark-circle" size={16} color={colors.success} />}
              />
              <Button
                title="Все отсутствуют"
                onPress={() => handleQuickSelectAll('absent')}
                variant="secondary"
                size="small"
                icon={<Ionicons name="close-circle" size={16} color={colors.error} />}
              />
            </View>
          </View>
        )}

        {/* Список студентов */}
        {selectedSchedule && students.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>
              Список студентов ({students.length})
            </AppText>
            
            {students.map((student) => {
              const status = attendance[student.id] || 'absent';
              return (
                <View key={student.id} style={[styles.studentItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.studentInfo}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                      <AppText style={[styles.avatarText, { color: colors.primary }]}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AppText>
                    </View>
                    <View style={styles.studentDetails}>
                      <AppText variant="medium" style={[styles.studentName, { color: colors.text }]}>
                        {student.name}
                      </AppText>
                      <AppText style={[styles.studentGroup, { color: colors.textSecondary }]}>
                        {student.group}
                      </AppText>
                    </View>
                  </View>
                  
                  <View style={styles.statusButtons}>
                    <Button
                      title="Присут."
                      onPress={() => handleStatusChange(student.id, 'present')}
                      variant={status === 'present' ? 'primary' : 'secondary'}
                      size="small"
                    />
                    <Button
                      title="Опоздал"
                      onPress={() => handleStatusChange(student.id, 'late')}
                      variant={status === 'late' ? 'primary' : 'secondary'}
                      size="small"
                    />
                    <Button
                      title="Отсут."
                      onPress={() => handleStatusChange(student.id, 'absent')}
                      variant={status === 'absent' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Сообщение если нет студентов */}
        {selectedSchedule && students.length === 0 && (
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <AppText style={[styles.noDataText, { color: colors.textSecondary }]}>
              Нет студентов в группе {selectedSchedule.group}
            </AppText>
          </View>
        )}
      </ScrollView>

      {/* Кнопка сохранения */}
      {selectedSchedule && students.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Button
            title={`Сохранить посещаемость (${stats.present + stats.late}/${students.length})`}
            onPress={handleSaveAttendance}
            loading={isLoading}
            disabled={isLoading}
            style={styles.saveButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  schedulesScroll: {
    marginHorizontal: -4,
  },
  scheduleButton: {
    marginHorizontal: 4,
    minWidth: 140,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  scheduleTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  scheduleDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    marginBottom: 2,
  },
  studentGroup: {
    fontSize: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    width: '100%',
  },
});

export default AttendanceScreen;