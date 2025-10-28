import { ScheduleItem } from '../types';
import { apiService } from './api';

export const scheduleService = {
  async getAllSchedules(): Promise<ScheduleItem[]> {
    return await apiService.getSchedule();
  },

  async getStudentSchedule(studentId: string): Promise<ScheduleItem[]> {
    // В реальном приложении нужно сначала получить группу студента
    // Пока используем заглушку - все расписание
    return await apiService.getSchedule();
  },

  async getTeacherSchedule(teacherId: string): Promise<ScheduleItem[]> {
    return await apiService.getSchedule({ teacherId });
  },

  async createSchedule(newSchedule: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
    return await apiService.createSchedule(newSchedule);
  },

  async updateSchedule(id: string, updatedSchedule: Partial<ScheduleItem>): Promise<ScheduleItem | null> {
    try {
      return await apiService.updateSchedule(id, updatedSchedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      return null;
    }
  },

  async deleteSchedule(id: string): Promise<boolean> {
    try {
      await apiService.deleteSchedule(id);
      return true;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return false;
    }
  },

  async getCurrentWeekSchedule(): Promise<ScheduleItem[]> {
    const today = new Date().toISOString().split('T')[0];
    return await apiService.getSchedule({ date: today });
  },

  async getScheduleByDate(date: string): Promise<ScheduleItem[]> {
    return await apiService.getSchedule({ date });
  },

  async getScheduleByWeekDay(dayIndex: number): Promise<ScheduleItem[]> {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + dayIndex);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    return await this.getScheduleByDate(targetDateStr);
  }
};