// src/services/UserService.ts
export const userService = {
  async authenticate(email: string, password: string): Promise<User | null> {
    // Для демо - пароль всегда '123456'
    return new Promise((resolve, reject) => {
      database.transaction((tx: any) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ?',
          [email],
          (_: any, results: any) => {
            if (results.rows.length > 0) {
              const user = results.rows.item(0);
              resolve({
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                group: user.group_name
              });
            } else {
              resolve(null);
            }
          },
          (error: any) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  async createUser(userData: Omit<User, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      database.transaction((tx: any) => {
        tx.executeSql(
          `INSERT INTO users (email, name, role, group_name)
           VALUES (?, ?, ?, ?)`,
          [userData.email, userData.name, userData.role, userData.group || null],
          (_: any, results: any) => {
            resolve(results.insertId);
          },
          (error: any) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
};