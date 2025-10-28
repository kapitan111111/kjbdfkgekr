// Добавьте эти интерфейсы если их еще нет
export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  results?: number;
}

// Обновите User интерфейс если нужно
export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  group?: string;
  avatar?: string;
  token?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}