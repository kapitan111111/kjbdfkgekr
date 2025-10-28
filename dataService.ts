import { AttendanceRecord, ScheduleItem, NewsItem, User } from '../types';

// Имитация базы данных в памяти
class DataService {
  private attendance: AttendanceRecord[] = [
    {
      id: '1',
      studentId: '1',
      scheduleId: '1',
      date: '2024-01-15',
      status: 'present',
    }
  ];

  private schedule: ScheduleItem[] = [
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
    }
  ];

  private news: NewsItem[] = [
    {
      id: '1',
      title: 'Важное объявление',
      content: 'Завтра занятия по расписанию',
      author: 'Администратор',
      authorId: '3',
      createdAt: '2024-01-15T10:00:00',
      importance: 'high',
      targetGroups: ['Frontend-2024']
    }
  ];

  // Подписчики на обновления
  private subscribers: Map<string, Function[]> = new Map();

  // Посещаемость
  async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    return this.attendance.filter(record => record.studentId === studentId);
  }

  async getAttendanceBySchedule(scheduleId: string): Promise<AttendanceRecord[]> {
    return this.attendance.filter(record => record.scheduleId === scheduleId);
  }

  async markAttendance(records: Omit<AttendanceRecord, 'id'>[]): Promise<void> {
    // Удаляем старые записи
    if (records.length > 0) {
      this.attendance = this.attendance.filter(
        record => !(record.scheduleId === records[0].scheduleId && record.date === records[0].date)
      );
    }

    // Добавляем новые
    records.forEach(record => {
      this.attendance.push({
        ...record,
        id: Date.now().toString() + Math.random(),
      });
    });

    // Уведомляем подписчиков
    this.notifySubscribers('attendance');
  }

  // Расписание
  async getScheduleByGroup(group: string): Promise<ScheduleItem[]> {
    return this.schedule.filter(item => item.group === group);
  }

  async getScheduleByTeacher(teacherId: string): Promise<ScheduleItem[]> {
    return this.schedule.filter(item => item.teacherId === teacherId);
  }

  async createSchedule(item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
    };
    this.schedule.push(newItem);
    this.notifySubscribers('schedule');
    return newItem;
  }

  // Новости
  async getNewsForGroup(group: string): Promise<NewsItem[]> {
    return this.news.filter(item =>
      item.targetGroups.includes(group) || item.targetGroups.length === 0
    );
  }

  async createNews(item: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
    const newItem: NewsItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.news.push(newItem);
    this.notifySubscribers('news');
    return newItem;
  }

  // Подписка на обновления
  subscribe(type: string, callback: Function): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type)!.push(callback);

    // Возвращаем функцию отписки
    return () => {
      const callbacks = this.subscribers.get(type);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(type: string): void {
    const callbacks = this.subscribers.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }
}

export const dataService = new DataService();