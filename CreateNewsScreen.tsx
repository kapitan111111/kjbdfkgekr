import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const CreateNewsScreen: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [targetGroups, setTargetGroups] = useState('');

  const handlePublish = () => {
    if (!title || !content) {
      Alert.alert('Ошибка', 'Заполните заголовок и содержание');
      return;
    }

    Alert.alert('Успех', 'Новость опубликована!');
    // Очистка формы
    setTitle('');
    setContent('');
    setImportance('medium');
    setTargetGroups('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Создание новости</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Заголовок *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Введите заголовок новости"
        />

        <Text style={styles.label}>Содержание *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Введите содержание новости"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Важность</Text>
        <View style={styles.importanceButtons}>
          <Button
            title="Низкая"
            onPress={() => setImportance('low')}
            variant={importance === 'low' ? 'primary' : 'secondary'}
          />
          <Button
            title="Средняя"
            onPress={() => setImportance('medium')}
            variant={importance === 'medium' ? 'primary' : 'secondary'}
          />
          <Button
            title="Высокая"
            onPress={() => setImportance('high')}
            variant={importance === 'high' ? 'primary' : 'secondary'}
          />
        </View>

        <Text style={styles.label}>Группы (через запятую)</Text>
        <TextInput
          style={styles.input}
          value={targetGroups}
          onChangeText={setTargetGroups}
          placeholder="Frontend-2024, Backend-2024"
        />

        <Button
          title="Опубликовать новость"
          onPress={handlePublish}
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
  },
  textArea: {
    minHeight: 120,
  },
  importanceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default CreateNewsScreen;