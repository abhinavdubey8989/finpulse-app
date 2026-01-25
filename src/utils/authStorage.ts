const TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';
const USER_NAME_KEY = 'userName';

export const authStorage = {
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
  },

  setUserId: (userId: string): void => {
    localStorage.setItem(USER_ID_KEY, userId);
  },

  getUserId: (): string | null => {
    const userId = localStorage.getItem(USER_ID_KEY);
    return userId;
  },

  setUserName: (userName: string): void => {
    localStorage.setItem(USER_NAME_KEY, userName);
  },

  getUserName: (): string | null => {
    const userName = localStorage.getItem(USER_NAME_KEY);
    return userName;
  },

  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
