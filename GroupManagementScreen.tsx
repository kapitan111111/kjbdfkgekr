// src/screens/admin/GroupManagementScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import Button from '../../components/common/Button';

const GroupManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const [groups, setGroups] = useState(['Frontend-2024', 'Backend-2024', 'Design-2024', 'Mobile-2024']);
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Ошибка', 'Введите название группы');
      return;
    }

    if (groups.includes(newGroupName)) {
      Alert.alert('Ошибка', 'Группа с таким названием уже существует');
      return;
    }

    setGroups(prev => [...prev, newGroupName]);
    setNewGroupName('');
    Alert.alert('Успех', 'Группа добавлена');
  };

  const handleDeleteGroup = (groupName: string) => {
    Alert.alert(
      'Удаление группы',
      `Вы уверены, что хотите удалить группу ${groupName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setGroups(prev => prev.filter(group => group !== groupName));
            Alert.alert('Успех', 'Группа удалена');
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
        Управление группами
      </AppText>

      {/* Добавление новой группы */}
      <View style={[styles.addSection, { backgroundColor: colors.card }]}>
        <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>
          Добавить группу
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            placeholder="Название группы..."
            placeholderTextColor={colors.textSecondary}
            value={newGroupName}
            onChangeText={setNewGroupName}
          />
          <Button
            title="Добавить"
            onPress={handleAddGroup}
            disabled={!newGroupName.trim()}
          />
        </View>
      </View>

      {/* Список групп */}
      <View style={[styles.groupsSection, { backgroundColor: colors.card }]}>
        <AppText variant="medium" style={[styles.sectionTitle, { color: colors.text }]}>
          Список групп ({groups.length})
        </AppText>
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={[styles.groupItem, { borderBottomColor: colors.border }]}>
              <AppText style={{ color: colors.text }}>{item}</AppText>
              <Button
                title="Удалить"
                onPress={() => handleDeleteGroup(item)}
                variant="secondary"
                size="small"
              />
            </View>
          )}
        />
      </View>
    </View>
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
  addSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  groupsSection: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
});

export default GroupManagementScreen;