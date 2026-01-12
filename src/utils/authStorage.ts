const TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';

export const authStorage = {
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setUserId: (userId: number): void => {
    localStorage.setItem(USER_ID_KEY, userId.toString());
  },

  getUserId: (): number | null => {
    const userId = localStorage.getItem(USER_ID_KEY);
    return userId ? parseInt(userId, 10) : null;
  },

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
