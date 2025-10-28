import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/common/Button';
import { scheduleService } from '../../services/scheduleService';
import { ScheduleItem } from '../../types';

const CreateScheduleScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    subject: '',
    teacher: '',
    teacherId: '',
    group: '',
    classroom: '',
    type: 'lecture' as 'lecture' | 'practice' | 'lab'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.date || !formData.startTime || !formData.subject || !formData.teacher || !formData.group) {
      Alert.alert('Ошибка', 'Заполните обязательные поля');
      return;
    }

    setIsLoading(true);
    try {
      await scheduleService.createSchedule(formData);
      Alert.alert('Успех', 'Занятие добавлено в расписание');
      // Очистка формы
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        subject: '',
        teacher: '',
        teacherId: '',
        group: '',
        classroom: '',
        type: 'lecture'
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить занятие');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Добавить занятие в расписание</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Дата *</Text>
        <TextInput
          style={styles.input}
          value={formData.date}
          onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
          placeholder="2024-01-15"
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Время начала *</Text>
            <TextInput
              style={styles.input}
              value={formData.startTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
              placeholder="10:00"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Время окончания</Text>
            <TextInput
              style={styles.input}
              value={formData.endTime}
              onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
              placeholder="11:30"
            />
          </View>
        </View>

        <Text style={styles.label}>Предмет *</Text>
        <TextInput
          style={styles.input}
          value={formData.subject}
          onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
          placeholder="React Native"
        />

        <Text style={styles.label}>Преподаватель *</Text>
        <TextInput
          style={styles.input}
          value={formData.teacher}
          onChangeText={(text) => setFormData(prev => ({ ...prev, teacher: text }))}
          placeholder="Петр Петров"
        />

        <Text style={styles.label}>ID преподавателя</Text>
        <TextInput
          style={styles.input}
          value={formData.teacherId}
          onChangeText={(text) => setFormData(prev => ({ ...prev, teacherId: text }))}
          placeholder="2"
        />

        <Text style={styles.label}>Группа *</Text>
        <TextInput
          style={styles.input}
          value={formData.group}
          onChangeText={(text) => setFormData(prev => ({ ...prev, group: text }))}
          placeholder="Frontend-2024"
        />

        <Text style={styles.label}>Аудитория</Text>
        <TextInput
          style={styles.input}
          value={formData.classroom}
          onChangeText={(text) => setFormData(prev => ({ ...prev, classroom: text }))}
          placeholder="Аудитория 101"
        />

        <Text style={styles.label}>Тип занятия</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <Picker.Item label="Лекция" value="lecture" />
            <Picker.Item label="Практика" value="practice" />
            <Picker.Item label="Лабораторная" value="lab" />
          </Picker>
        </View>

        <Button
          title="Добавить занятие"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default CreateScheduleScreen;