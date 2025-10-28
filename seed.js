const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Schedule = require('./models/Schedule');
const News = require('./models/News');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_app';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Очищаем существующие данные
    await User.deleteMany({});
    await Schedule.deleteMany({});
    await News.deleteMany({});
    console.log('Cleared existing data');

    // Создаем пользователей
    const users = await User.create([
      {
        email: 'student@school.ru',
        password: '123456',
        name: 'Иван Иванов',
        role: 'student',
        group: 'Frontend-2024'
      },
      {
        email: 'teacher@school.ru',
        password: '123456',
        name: 'Петр Петров',
        role: 'teacher'
      },
      {
        email: 'admin@school.ru',
        password: '123456',
        name: 'Администратор Системы',
        role: 'admin'
      },
      {
        email: 'student2@school.ru',
        password: '123456',
        name: 'Мария Сидорова',
        role: 'student',
        group: 'Frontend-2024'
      },
      {
        email: 'teacher2@school.ru',
        password: '123456',
        name: 'Анна Козлова',
        role: 'teacher'
      }
    ]);
    console.log('Created users');

    // Создаем расписание
    const schedules = await Schedule.create([
      {
        date: '2024-01-15',
        startTime: '10:00',
        endTime: '11:30',
        subject: 'React Native',
        teacher: 'Петр Петров',
        teacherId: users[1]._id,
        group: 'Frontend-2024',
        classroom: 'Аудитория 101',
        type: 'lecture'
      },
      {
        date: '2024-01-15',
        startTime: '12:00',
        endTime: '13:30',
        subject: 'JavaScript Advanced',
        teacher: 'Анна Козлова',
        teacherId: users[4]._id,
        group: 'Frontend-2024',
        classroom: 'Аудитория 102',
        type: 'practice'
      },
      {
        date: '2024-01-16',
        startTime: '09:00',
        endTime: '10:30',
        subject: 'TypeScript',
        teacher: 'Петр Петров',
        teacherId: users[1]._id,
        group: 'Frontend-2024',
        classroom: 'Аудитория 201',
        type: 'lecture'
      },
      {
        date: '2024-01-16',
        startTime: '11:00',
        endTime: '12:30',
        subject: 'Node.js',
        teacher: 'Анна Козлова',
        teacherId: users[4]._id,
        group: 'Backend-2024',
        classroom: 'Аудитория 103',
        type: 'lab'
      }
    ]);
    console.log('Created schedules');

    // Создаем новости
    const news = await News.create([
      {
        title: 'Добро пожаловать в новом учебном году!',
        content: 'Рады приветствовать всех студентов и преподавателей в новом учебном году! Желаем успехов в учебе и преподавании.',
        author: 'Администратор Системы',
        authorId: users[2]._id,
        importance: 'high',
        targetGroups: ['Frontend-2024', 'Backend-2024', 'Design-2024']
      },
      {
        title: 'Важное объявление о расписании',
        content: 'Обратите внимание: в пятницу занятия начнутся на час позже в связи с техническими работами.',
        author: 'Петр Петров',
        authorId: users[1]._id,
        importance: 'medium',
        targetGroups: ['Frontend-2024']
      },
      {
        title: 'Новый курс по мобильной разработке',
        content: 'Со следующей недели начинается новый курс по React Native. Все желающие могут записаться у администратора.',
        author: 'Анна Козлова',
        authorId: users[4]._id,
        importance: 'low',
        targetGroups: ['Frontend-2024', 'Backend-2024']
      }
    ]);
    console.log('Created news');

    console.log('🎉 Database seeded successfully!');
    console.log('📊 Created:');
    console.log(`   👥 ${users.length} users`);
    console.log(`   📅 ${schedules.length} schedule items`);
    console.log(`   📰 ${news.length} news items`);
    console.log('');
    console.log('🔑 Demo accounts:');
    console.log('   Student: student@school.ru / 123456');
    console.log('   Teacher: teacher@school.ru / 123456');
    console.log('   Admin: admin@school.ru / 123456');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedData();