const TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';

export const authStorage = {
  setToken: (token: string): void => {
    console.log('Setting token in localStorage');
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
  },

  setUserId: (userId: string): void => {
    console.log('Setting userId in localStorage:', userId);
    localStorage.setItem(USER_ID_KEY, userId);
  },

  getUserId: (): string | null => {
    const userId = localStorage.getItem(USER_ID_KEY);
    return userId;
  },

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
