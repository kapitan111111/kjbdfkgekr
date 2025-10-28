import { NewsItem } from '../types';
import { apiService } from './api';

export const newsService = {
  async getNews(): Promise<NewsItem[]> {
    return await apiService.getNews();
  },

  async getNewsForGroup(group: string): Promise<NewsItem[]> {
    return await apiService.getNewsForGroup(group);
  },

  async createNews(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    return await apiService.createNews(item);
  }
};