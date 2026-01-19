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
    
    const loginData = response.data.apiData;
    
    if (!loginData) {
      throw new Error('Invalid API response structure');
    }
    
    const { accessToken, userId, userName } = loginData;
    
    if (!accessToken || !userId) {
      throw new Error('Invalid response: missing accessToken or userId');
    }
    
    authStorage.setToken(accessToken);
    authStorage.setUserId(String(userId));
    if (userName) {
      authStorage.setUserName(userName);
    }
    
    const storedToken = authStorage.getToken();
    const storedUserId = authStorage.getUserId();
    
    if (!storedToken || !storedUserId) {
      throw new Error('Failed to store authentication data');
    }
    
    return loginData;
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

    const payload = {
      userId,
      ...expenseData,
    };

    const response = await apiClient.post<ApiResponse<CreateExpenseResponse>>(
      '/expense/personal',
      payload
    );
    
    return response.data.apiData;
  },

  getExpenses: async (userId: string): Promise<Expense[]> => {
    const response = await apiClient.get<ApiResponse<Expense[]>>(
      `/expense/personal/${userId}`
    );
    
    return response.data.apiData;
  },

  updateExpense: async (
    expenseId: string,
    expenseData: import('../types').UpdateExpenseRequest
  ) => {
    const response = await apiClient.put<ApiResponse<import('../types').UpdateExpenseResponse>>(
      `/expense/personal/${expenseId}`,
      expenseData
    );
    
    return response.data.apiData;
  },

  getExpenseSummary: async (
    userId: string,
    summaryRequest: import('../types').ExpenseSummaryRequest
  ) => {
    const response = await apiClient.post<ApiResponse<import('../types').ExpenseSummaryResponse>>(
      `/expense/personal/${userId}/summary`,
      summaryRequest
    );
    
    return response.data.apiData;
  },
};

export const userSettingsService = {
  getUserSettings: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<import('../types').UserSettingsResponse>>(
      `/user/${userId}/settings`
    );
    
    return response.data.apiData;
  },

  createExpenseCategory: async (
    userId: string,
    categoryData: import('../types').CreateExpenseCategoryRequest
  ) => {
    const response = await apiClient.post<ApiResponse<import('../types').CreateExpenseCategoryResponse>>(
      `/user/${userId}/expense-category`,
      categoryData
    );
    
    return response.data.apiData;
  },

  updateExpenseCategory: async (
    userId: string,
    categoryId: string,
    categoryData: import('../types').UpdateExpenseCategoryRequest
  ) => {
    const response = await apiClient.put<ApiResponse<import('../types').UpdateExpenseCategoryResponse>>(
      `/user/${userId}/expense-category/${categoryId}`,
      categoryData
    );
    
    return response.data.apiData;
  },
};

export const groupService = {
  getGroupConfiguration: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<import('../types').ConfigureGroupResponse>>(
      `/group/configure/${userId}`
    );
    
    return response.data.apiData;
  },

  createGroup: async (groupData: import('../types').CreateGroupRequest) => {
    const response = await apiClient.post<ApiResponse<import('../types').CreateGroupResponse>>(
      '/group',
      groupData
    );
    
    return response.data.apiData;
  },

  createGroupExpense: async (groupId: string, expenseData: import('../types').CreateGroupExpenseRequest) => {
    const response = await apiClient.post<ApiResponse<import('../types').CreateGroupExpenseResponse>>(
      `/group/${groupId}/expense`,
      expenseData
    );
    
    return response.data.apiData;
  },

  createGroupExpenseCategory: async (groupId: string, categoryData: import('../types').CreateGroupExpenseCategoryRequest) => {
    const response = await apiClient.post<ApiResponse<import('../types').CreateGroupExpenseCategoryResponse>>(
      `/group/${groupId}/expense-category`,
      categoryData
    );
    
    return response.data.apiData;
  },

  getGroupSummary: async (groupId: string, summaryRequest: import('../types').GroupSummaryRequest) => {
    const response = await apiClient.post<ApiResponse<import('../types').GroupSummaryResponse>>(
      `/group/${groupId}/summary`,
      summaryRequest
    );
    
    return response.data.apiData;
  },
};

