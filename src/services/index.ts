import apiClient from './apiClient';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  CreateExpenseRequest,
  CreateExpenseResponse,
  Expense,
} from '../types';
import { authStorage } from '../utils/authStorage';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      {
        email,
        hashedPassword: password,
      } as LoginRequest
    );
    
    // Store token and userId in localStorage
    const { accessToken, userId } = response.data.data;
    authStorage.setToken(accessToken);
    authStorage.setUserId(userId);
    
    return response.data.data;
  },

  logout: (): void => {
    authStorage.clearAuth();
  },
};

export const expenseService = {
  createExpense: async (
    expenseData: Omit<CreateExpenseRequest, 'userId'>
  ): Promise<CreateExpenseResponse> => {
    const userId = authStorage.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await apiClient.post<ApiResponse<CreateExpenseResponse>>(
      '/expense/personal',
      {
        userId,
        ...expenseData,
      }
    );
    
    return response.data.data;
  },

  getExpenses: async (userId: number): Promise<Expense[]> => {
    const response = await apiClient.get<ApiResponse<Expense[]>>(
      `/expense/personal/${userId}`
    );
    
    return response.data.data;
  },
};
