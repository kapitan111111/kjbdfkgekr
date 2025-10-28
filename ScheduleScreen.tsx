import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SectionList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import { scheduleService } from '../../services/scheduleService';
import { ScheduleItem } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleItemSkeleton } from '../../components/common/SkeletonLoader';

const getTypeColor = (type: string, colors: any) => {
  switch (type) {
    case 'lecture': return colors.primary;
    case 'practice': return colors.success;
    case 'lab': return colors.warning;
    default: return colors.gray;
  }
};

const groupByDate = (schedule: ScheduleItem[]) => {
  const grouped: { [key: string]: ScheduleItem[] } = {};

  schedule.forEach(item => {
    if (!grouped[item.date]) {
      grouped[item.date] = [];
    }
    grouped[item.date].push(item);
  });

  return Object.entries(grouped).map(([date, items]) => ({
    title: date,
    data: items.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }));
};

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');

  const loadSchedule = async () => {
    try {
      let data: ScheduleItem[] = [];

      if (user?.role === 'student') {
        data = await scheduleService.getStudentSchedule(user.id);
      } else if (user?.role === 'teacher') {
        data = await scheduleService.getTeacherSchedule(user.id);
      } else {
        data = await scheduleService.getAllSchedules();
      }

      setSchedule(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchedule();
  };

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <View style={[styles.scheduleItem, { backgroundColor: colors.card }]}>
      {viewMode === 'week' && (
        <View style={[styles.dayHeader, { backgroundColor: colors.grayLight }]}>
          <AppText style={styles.dayText}>
            {new Date(item.date).toLocaleDateString('ru-RU', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
          </AppText>
        </View>
      )}

      <View style={[
        styles.timeBadge,
        { top: viewMode === 'week' ? 40 : 12, backgroundColor: colors.primary }
      ]}>
        <AppText style={styles.timeText}>
          {item.startTime}
        </AppText>
      </View>

      <View style={[
        styles.itemContent,
        { paddingLeft: viewMode === 'week' ? 16 : 60 }
      ]}>
        <View style={styles.itemHeader}>
          <AppText variant="bold" style={[styles.subject, { color: colors.text }]}>{item.subject}</AppText>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type, colors) }]}>
            <AppText style={styles.typeText}>
              {item.type === 'lecture' ? 'Лекция' : item.type === 'practice' ? 'Практика' : 'Лаб. работа'}
            </AppText>
          </View>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            <AppText style={[styles.detailText, { color: colors.textSecondary }]}>{item.teacher}</AppText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
            <AppText style={[styles.detailText, { color: colors.textSecondary }]}>{item.group}</AppText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
            <AppText style={[styles.detailText, { color: colors.textSecondary }]}>{item.classroom}</AppText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <AppText style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.startTime} - {item.endTime}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.card }]}>
      <AppText variant="bold" style={[styles.sectionHeaderText, { color: colors.text }]}>
        {new Date(section.title).toLocaleDateString('ru-RU', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </AppText>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
            Расписание
          </AppText>
          <View style={styles.viewModeSelector}>
            <View style={[styles.viewModeButton, { backgroundColor: colors.grayLight }]}>
              <AppText style={[styles.viewModeText, { color: colors.textSecondary }]}>
                День
              </AppText>
            </View>
            <View style={[styles.viewModeButton, { backgroundColor: colors.grayLight }]}>
              <AppText style={[styles.viewModeText, { color: colors.textSecondary }]}>
                Неделя
              </AppText>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scheduleList} contentContainerStyle={styles.listContent}>
          {[...Array(5)].map((_, index) => (
            <ScheduleItemSkeleton key={index} />
          ))}
        </ScrollView>
      </View>
    );
  }

  const sections = groupByDate(schedule);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
          Расписание
        </AppText>

        <View style={[styles.viewModeSelector, { backgroundColor: colors.grayLight }]}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'day' && [styles.viewModeButtonActive, { backgroundColor: colors.card }]
            ]}
            onPress={() => setViewMode('day')}
          >
            <AppText
              style={[
                styles.viewModeText,
                { color: colors.textSecondary },
                viewMode === 'day' && [styles.viewModeTextActive, { color: colors.primary }]
              ]}
            >
              День
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'week' && [styles.viewModeButtonActive, { backgroundColor: colors.card }]
            ]}
            onPress={() => setViewMode('week')}
          >
            <AppText
              style={[
                styles.viewModeText,
                { color: colors.textSecondary },
                viewMode === 'week' && [styles.viewModeTextActive, { color: colors.primary }]
              ]}
            >
              Неделя
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {schedule.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={colors.gray} />
          <AppText style={[styles.emptyStateText, { color: colors.textSecondary }]}>Нет занятий на эту неделю</AppText>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderScheduleItem}
          renderSectionHeader={renderSectionHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.scheduleList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  viewModeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewModeText: {
    fontSize: 14,
  },
  viewModeTextActive: {
    fontWeight: '600',
  },
  scheduleList: {
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeaderText: {
    fontSize: 16,
  },
  scheduleItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  dayHeader: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  timeBadge: {
    position: 'absolute',
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subject: {
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDetails: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
});