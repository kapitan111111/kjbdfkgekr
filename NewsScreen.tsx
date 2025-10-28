// src/screens/student/NewsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AppText from '../../components/common/AppText';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  importance: 'low' | 'medium' | 'high';
}

const NewsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Важное объявление',
      content: 'Завтра занятия по расписанию. Не опаздывайте!',
      author: 'Администратор',
      createdAt: '2024-01-15T10:00:00',
      importance: 'high'
    },
    {
      id: '2',
      title: 'Новый курс по React Native',
      content: 'Следующая неделя - начало нового курса по React Native.',
      author: 'Петр Петров',
      createdAt: '2024-01-14T15:30:00',
      importance: 'medium'
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray;
    }
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <View style={[styles.newsItem, { backgroundColor: colors.card }]}>
      <View style={styles.newsHeader}>
        <AppText variant="bold" style={[styles.newsTitle, { color: colors.text }]}>
          {item.title}
        </AppText>
        <View style={[
          styles.importanceBadge,
          { backgroundColor: getImportanceColor(item.importance) }
        ]}>
          <AppText style={styles.importanceText}>
            {item.importance === 'high' ? '❗' :
             item.importance === 'medium' ? '🔸' : '🔹'}
          </AppText>
        </View>
      </View>
      <AppText style={[styles.newsContent, { color: colors.textSecondary }]}>
        {item.content}
      </AppText>
      <View style={styles.newsFooter}>
        <AppText style={[styles.newsAuthor, { color: colors.textSecondary }]}>
          {item.author}
        </AppText>
        <AppText style={[styles.newsDate, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleDateString('ru-RU')}
        </AppText>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
        Новости
      </AppText>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingBottom: 20,
  },
  newsItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  importanceText: {
    fontSize: 12,
    color: '#fff',
  },
  newsContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsAuthor: {
    fontSize: 12,
    fontWeight: '500',
  },
  newsDate: {
    fontSize: 12,
  },
});

export default NewsScreen;