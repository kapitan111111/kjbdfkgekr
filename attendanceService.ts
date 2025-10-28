import { AttendanceRecord } from '../types';
import { apiService } from './api';

export const attendanceService = {
  async getAttendanceBySchedule(scheduleId: string): Promise<AttendanceRecord[]> {
    return await apiService.getAttendanceBySchedule(scheduleId);
  },

  async markAttendance(records: Omit<AttendanceRecord, 'id'>[]): Promise<void> {
    await apiService.markAttendance(records);
  },

  async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    return await apiService.getStudentAttendance(studentId);
  }
};