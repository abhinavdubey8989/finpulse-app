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
  month: number;
  category: string;
  categoryId?: string;
  categoryName?: string;
  amount: number;
  description?: string;
  tag?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseRequest {
  userId: string;
  year: number;
  month: number;
  categoryId: string;
  amount: number;
  description?: string;
  tagId?: string;
}

export interface CreateExpenseResponse {
  id: number;
}

export interface UpdateExpenseRequest {
  categoryId: string;
  amount: number;
  description?: string;
  tagId?: string;
}

export interface UpdateExpenseResponse {
  id: string;
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

// User Settings types
export interface Tag {
  id: string;
  name: string;
}

export interface ExpenseCategoryItem {
  id: string;
  category: string;
  description: string;
  monthlyUpperLimit: number;
  tags: Tag[];
}

export interface UserSettingsResponse {
  expenseCategories: ExpenseCategoryItem[];
  userId: string;
}

export interface CreateExpenseCategoryRequest {
  category: string;
  description: string;
  monthlyUpperLimit: number;
  addTags?: string[];
}

export interface CreateExpenseCategoryResponse {
  id: string;
  failedAddTags: string[];
}

export interface UpdateExpenseCategoryRequest {
  categoryName: string;
  description: string;
  monthlyUpperLimit: number;
  addTags?: string[];
  updateTags?: {
    id: string;
    newName: string;
  }[];
}

export interface UpdateExpenseCategoryResponse {
  id: string;
  failedAddTags: string[];
  failedUpdateTags: string[];
}

// Expense Summary types
export interface ExpenseSummaryRequest {
  year: number;
  month: number;
}

export interface TagBreakup {
  id: string;
  name: string;
  expenseAmount: number;
}

export interface ExpenseSummaryElement {
  category: string;
  categoryDescription: string;
  categoryId: string;
  monthlyExpenseDone: number;
  monthlyUpperLimit: number;
  tagBreakup: TagBreakup[];
}

export interface ExpenseSummaryResponse {
  elements: ExpenseSummaryElement[];
  month: number;
  numberOfExpenses: number;
  totalExpenseAmount: number;
  userId: string;
  year: number;
}
