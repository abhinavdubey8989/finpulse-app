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
    
    console.log('Login API full response:', response);
    console.log('Login API response.data:', response.data);
    
    // Get data from response.data.apiData
    const loginData = response.data.apiData;
    
    console.log('Extracted login data:', loginData);
    
    if (!loginData) {
      console.error('No login data found in response');
      throw new Error('Invalid API response structure');
    }
    
    const { accessToken, userId } = loginData;
    
    console.log('Extracted accessToken:', accessToken);
    console.log('Extracted userId:', userId, 'type:', typeof userId);
    
    if (!accessToken || !userId) {
      console.error('Invalid response: missing accessToken or userId', loginData);
      throw new Error('Invalid response: missing accessToken or userId');
    }
    
    // Store userId as string
    authStorage.setToken(accessToken);
    authStorage.setUserId(String(userId));
    
    // Verify storage immediately
    const storedToken = authStorage.getToken();
    const storedUserId = authStorage.getUserId();
    console.log('Verification after storage:');
    console.log('  - stored token:', storedToken);
    console.log('  - stored userId:', storedUserId);
    
    if (!storedToken || !storedUserId) {
      console.error('Failed to store auth data in localStorage');
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
    console.log('Creating expense - userId from storage:', userId);
    
    if (!userId) {
      console.error('User not authenticated - no userId in localStorage');
      throw new Error('User not authenticated');
    }

    const payload = {
      userId,
      ...expenseData,
    };
    console.log('Sending create expense request:', payload);

    const response = await apiClient.post<ApiResponse<CreateExpenseResponse>>(
      '/expense/personal',
      payload
    );
    
    console.log('Create expense response:', response.data);
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
};

