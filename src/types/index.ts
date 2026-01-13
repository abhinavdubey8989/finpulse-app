// API Response wrapper
export interface ApiResponse<T> {
  apiData: T;
  respId: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  hashedPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  personalExpenseSettings: unknown[];
}

// Expense types
export interface Expense {
  id: number;
  userId?: number;
  year: number;
  month: string;
  category: string;
  amount: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseRequest {
  userId: string;
  year: number;
  month: string;
  category: string;
  amount: number;
  description: string;
}

export interface CreateExpenseResponse {
  id: number;
}

export type ExpenseCategory = 
  | 'rent' 
  | 'shopping' 
  | 'eat-out' 
  | 'travel' 
  | 'utilities' 
  | 'entertainment' 
  | 'healthcare' 
  | 'other';
