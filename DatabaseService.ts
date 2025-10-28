// src/database/DatabaseService.ts
import SQLite from 'react-native-sqlite-storage';

class DatabaseService {
  private db: any = null;

  async initialize() {
    try {
      this.db = await SQLite.openDatabase({
        name: 'SchoolApp.db',
        location: 'default',
      });
      await this.createTables();
      await this.seedInitialData();
      console.log('✅ База данных инициализирована');
    } catch (error) {
      console.error('❌ Ошибка инициализации БД:', error);
    }
  }

  private async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        // Пользователи
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
            group_name TEXT,
            avatar TEXT,
            created_at INTEGER DEFAULT (strftime('%s', 'now'))
          )
        `);

        // Расписание
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS schedule_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            subject TEXT NOT NULL,
            teacher_id INTEGER NOT NULL,
            teacher_name TEXT NOT NULL,
            group_name TEXT NOT NULL,
            classroom TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('lecture', 'practice', 'lab')),
            created_at INTEGER DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (teacher_id) REFERENCES users (id)
          )
        `);

        // Посещаемость
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS attendance_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            schedule_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late')),
            notes TEXT,
            created_at INTEGER DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (student_id) REFERENCES users (id),
            FOREIGN KEY (schedule_id) REFERENCES schedule_items (id),
            UNIQUE(student_id, schedule_id, date)
          )
        `);

        // Новости
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS news_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            author_name TEXT NOT NULL,
            importance TEXT NOT NULL CHECK(importance IN ('low', 'medium', 'high')),
            target_groups TEXT NOT NULL, -- JSON массив групп
            created_at INTEGER DEFAULT (strftime('%s', 'now')),
            FOREIGN KEY (author_id) REFERENCES users (id)
          )
        `);
      }, reject, resolve);
    });
  }
}