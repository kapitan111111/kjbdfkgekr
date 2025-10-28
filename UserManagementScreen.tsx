import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { User, UserRole } from '../../types';
import { apiService } from '../../services/api';

const UserManagementScreen: React.FC = () => {
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    password: '123456',
    name: '',
    role: 'student' as UserRole,
    group: ''
  });

  // Загрузка пользователей
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список пользователей');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'student': return 'school';
      case 'teacher': return 'person';
      case 'admin': return 'shield';
      default: return 'person';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'student': return '#007AFF';
      case 'teacher': return '#34C759';
      case 'admin': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    if (newUser.role === 'student' && !newUser.group) {
      Alert.alert('Ошибка', 'Для студента необходимо указать группу');
      return;
    }

    try {
      setIsLoading(true);
      const createdUser = await apiService.createUser(newUser);

      setUsers(prev => [...prev, createdUser]);
      setNewUser({
        email: '',
        password: '123456',
        name: '',
        role: 'student',
        group: ''
      });
      setShowAddForm(false);

      Alert.alert('Успех', 'Пользователь успешно создан');
    } catch (error: any) {
      console.error('Error creating user:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось создать пользователя');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Удаление пользователя',
      `Вы уверены, что хотите удалить пользователя ${userName}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => deleteUser(userId)
        },
      ]
    );
  };

  const deleteUser = async (userId: string) => {
    try {
      // В реальном приложении здесь будет вызов API для удаления
      // await apiService.deleteUser(userId);

      // Временно просто удаляем из локального состояния
      setUsers(prev => prev.filter(user => user.id !== userId));
      Alert.alert('Успех', 'Пользователь удален');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить пользователя');
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'student': return 'Студент';
      case 'teacher': return 'Преподаватель';
      case 'admin': return 'Администратор';
      default: return role;
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={[styles.userCard, { backgroundColor: colors.card }]}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.roleIcon, { backgroundColor: getRoleColor(item.role) + '20' }]}>
            <Ionicons
              name={getRoleIcon(item.role) as any}
              size={20}
              color={getRoleColor(item.role)}
            />
          </View>
          <View style={styles.userDetails}>
            <AppText variant="bold" style={[styles.userName, { color: colors.text }]}>
              {item.name}
            </AppText>
            <AppText style={[styles.userEmail, { color: colors.textSecondary }]}>
              {item.email}
            </AppText>
          </View>
        </View>
        <View style={styles.userActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => Alert.alert('Редактирование', 'Функция в разработке')}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
            onPress={() => handleDeleteUser(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.userMeta}>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
          <AppText style={styles.roleText}>
            {getRoleText(item.role)}
          </AppText>
        </View>
        {item.group && (
          <AppText style={[styles.userGroup, { color: colors.textSecondary }]}>
            Группа: {item.group}
          </AppText>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Заголовок и поиск */}
      <View style={styles.header}>
        <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
          Управление пользователями
        </AppText>

        <TextInput
          style={[styles.searchInput, {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Поиск пользователей..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Фильтры по ролям */}
        <View style={styles.filters}>
          {(['all', 'student', 'teacher', 'admin'] as const).map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterButton,
                { backgroundColor: colors.card },
                roleFilter === role && { backgroundColor: colors.primary }
              ]}
              onPress={() => setRoleFilter(role)}
            >
              <AppText style={[
                styles.filterText,
                { color: roleFilter === role ? '#fff' : colors.text }
              ]}>
                {role === 'all' ? 'Все' :
                 role === 'student' ? 'Студенты' :
                 role === 'teacher' ? 'Преподаватели' : 'Администраторы'}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={showAddForm ? "Отменить создание" : "Добавить пользователя"}
          onPress={() => setShowAddForm(!showAddForm)}
          icon={<Ionicons name={showAddForm ? "close" : "person-add"} size={16} color="#fff" />}
          variant={showAddForm ? "secondary" : "primary"}
        />
      </View>

      {/* Форма добавления пользователя */}
      {showAddForm && (
        <ScrollView style={[styles.addForm, { backgroundColor: colors.card }]}>
          <AppText variant="bold" style={[styles.formTitle, { color: colors.text }]}>
            Добавить нового пользователя
          </AppText>

          <AppText style={[styles.label, { color: colors.text }]}>Имя *</AppText>
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            placeholder="Введите полное имя"
            placeholderTextColor={colors.textSecondary}
            value={newUser.name}
            onChangeText={(text) => setNewUser(prev => ({ ...prev, name: text }))}
          />

          <AppText style={[styles.label, { color: colors.text }]}>Email *</AppText>
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            placeholder="email@school.ru"
            placeholderTextColor={colors.textSecondary}
            value={newUser.email}
            onChangeText={(text) => setNewUser(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppText style={[styles.label, { color: colors.text }]}>Пароль *</AppText>
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.text
            }]}
            placeholder="Пароль"
            placeholderTextColor={colors.textSecondary}
            value={newUser.password}
            onChangeText={(text) => setNewUser(prev => ({ ...prev, password: text }))}
            secureTextEntry
          />

          <AppText style={[styles.label, { color: colors.text }]}>Роль *</AppText>
          <View style={styles.roleButtons}>
            {(['student', 'teacher', 'admin'] as const).map(role => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleOption,
                  { backgroundColor: colors.background },
                  newUser.role === role && { backgroundColor: colors.primary }
                ]}
                onPress={() => setNewUser(prev => ({ ...prev, role }))}
              >
                <AppText style={[
                  styles.roleOptionText,
                  { color: newUser.role === role ? '#fff' : colors.text }
                ]}>
                  {getRoleText(role)}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {newUser.role === 'student' && (
            <>
              <AppText style={[styles.label, { color: colors.text }]}>Группа *</AppText>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                placeholder="Frontend-2024"
                placeholderTextColor={colors.textSecondary}
                value={newUser.group}
                onChangeText={(text) => setNewUser(prev => ({ ...prev, group: text }))}
              />
            </>
          )}

          <View style={styles.formActions}>
            <Button
              title="Отмена"
              onPress={() => setShowAddForm(false)}
              variant="secondary"
            />
            <Button
              title="Создать пользователя"
              onPress={handleAddUser}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      )}

      {/* Список пользователей */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <AppText style={[styles.emptyText, { color: colors.textSecondary }]}>
              {isLoading ? 'Загрузка...' : 'Пользователи не найдены'}
            </AppText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addForm: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 500,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  userCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  userGroup: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default UserManagementScreen;