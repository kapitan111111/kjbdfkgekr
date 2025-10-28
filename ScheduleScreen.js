// В ScheduleScreen.tsx добавим календарь
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ScheduleItem } from '../../types';
import CalendarView from '../../components/schedule/CalendarView';

const ScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

  const scheduleData: ScheduleItem[] = [
    {
      id: '1',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:30',
      subject: 'React Native',
      teacher: 'Петр Петров',
      teacherId: '2',
      group: 'Frontend-2024',
      classroom: 'Аудитория 101',
      type: 'lecture'
    },
    // ... другие занятия
  ];

  const markedDates = scheduleData.map(item => item.date);
  const filteredSchedule = scheduleData.filter(item => item.date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Расписание</Text>

      <CalendarView
        onDateSelect={setSelectedDate}
        markedDates={markedDates}
      />

      <Text style={styles.selectedDate}>
        {new Date(selectedDate).toLocaleDateString('ru-RU', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>

      <FlatList
        data={filteredSchedule}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.time}>{item.startTime} - {item.endTime}</Text>
            <Text style={styles.teacher}>{item.teacher}</Text>
            <Text style={styles.classroom}>{item.classroom}</Text>
            <Text style={styles.type}>
              {item.type === 'lecture' ? 'Лекция' : 'Практика'}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>На выбранную дату занятий нет</Text>
        }
      />
    </View>
  );
};