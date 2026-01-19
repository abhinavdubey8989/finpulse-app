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
  userName?: string;
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
  categoryName: string;
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

// Group types
export interface User {
  userId: string;
  name: string;
  emailId: string;
}

export interface GroupExpenseCategory {
  id: string;
  category: string;
  description: string;
  monthlyUpperLimit: number;
  tags: Tag[];
}

export interface GroupAndCategory {
  groupId: string;
  groupName: string;
  groupDescription: string;
  members: User[];
  expenseCategories: GroupExpenseCategory[];
}

export interface ConfigureGroupResponse {
  allUsers: User[];
  groupAndCategoryList: GroupAndCategory[];
}

export interface CreateGroupRequest {
  createdBy: string;
  name: string;
  description: string;
  memberUserIds: string[];
}

export interface CreateGroupResponse {
  id: string;
  failedMemberIds: string[];
}

export interface CreateGroupExpenseRequest {
  paidByUserId: string;
  categoryId: string;
  year: number;
  month: number;
  amount: number;
  description?: string;
  tagId?: string;
  splitType: 'EXACT' | 'PERCENT';
  splits: { [userId: string]: number };
}

export interface CreateGroupExpenseResponse {
  id: string;
}

export interface CreateGroupExpenseCategoryRequest {
  userId: string;
  categoryName: string;
  description: string;
  monthlyUpperLimit: number;
  addTags?: string[];
}

export interface CreateGroupExpenseCategoryResponse {
  id: string;
  failedAddTags: string[];
}

export interface GroupSummaryRequest {
  year: number;
  month: number;
}

export interface UserAmountBreakup {
  userId: string;
  expenseAmount: number;
}

export interface GroupUser {
  userId?: string;
  name: string;
  emailId: string;
  expenseCount: number;
  totalExpenseAmount: number;
  creditAmounts: { [userId: string]: number };
  debitAmounts: { [userId: string]: number };
}

export interface GroupSummaryElement extends ExpenseSummaryElement {
  userAmountBreakup: UserAmountBreakup[];
}

export interface GroupSummaryResponse {
  elements: GroupSummaryElement[];
  month: number;
  year: number;
  numberOfExpenses: number;
  totalExpenseAmount: number;
  users: { [userId: string]: GroupUser };
}
