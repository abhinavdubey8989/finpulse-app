# API Integration Reference

## Overview
This document shows how the CURL requests from the requirements were converted to maintainable TypeScript/React code.

## 1. Login API

### Original CURL
```bash
curl --location 'http://localhost:8055/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@example.com",
    "hashedPassword": "63a9f0ea7bb98050796b649e85481845"
}'
```

### TypeScript Implementation

**Service Layer** (`src/services/index.ts`):
```typescript
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
};
```

**React Component** (`src/pages/LoginPage.tsx`):
```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    await authService.login(email, password);
    navigate('/expenses');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Login failed.');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 2. Create Expense API

### Original CURL
```bash
curl --location 'http://localhost:8055/api/v1/expense/personal' \
--header 'Authorization: Bearer jwt-token-save-above' \
--header 'Content-Type: application/json' \
--data '{
    "userId": 1,
    "year": 2026,
    "month": "january",
    "category": "travel",
    "amount": 100,
    "description": "test"
}'
```

### TypeScript Implementation

**Service Layer** (`src/services/index.ts`):
```typescript
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
};
```

**React Component** (`src/pages/CreateExpensePage.tsx`):
```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ... validation logic ...
  
  setIsLoading(true);
  try {
    const currentDate = new Date();
    const currentMonth = MONTHS[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    await expenseService.createExpense({
      category,
      amount: amountValue,
      description,
      month: currentMonth,
      year: currentYear,
    });

    navigate('/expenses');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to create expense.');
  } finally {
    setIsLoading(false);
  }
};
```

**Note**: The Authorization header is automatically added by the Axios interceptor in `src/services/apiClient.ts`:
```typescript
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

---

## 3. Get Expenses API

### Original CURL
```bash
curl --location 'http://localhost:8055/api/v1/expense/personal/1' \
--header 'Authorization: Bearer access-token' \
--data ''
```

### TypeScript Implementation

**Service Layer** (`src/services/index.ts`):
```typescript
export const expenseService = {
  getExpenses: async (userId: number): Promise<Expense[]> => {
    const response = await apiClient.get<ApiResponse<Expense[]>>(
      `/expense/personal/${userId}`
    );
    
    return response.data.data;
  },
};
```

**React Component** (`src/pages/ExpenseListPage.tsx`):
```typescript
const fetchExpenses = async () => {
  try {
    const userId = authStorage.getUserId();
    if (!userId) {
      navigate('/');
      return;
    }

    const data = await expenseService.getExpenses(userId);
    setExpenses(data);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to load expenses');
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchExpenses();
}, []);
```

---

## Key Architecture Decisions

### 1. Axios Instance with Interceptors
**File**: `src/services/apiClient.ts`

Benefits:
- Single source of truth for API base URL
- Automatic token injection for all requests
- Centralized error handling
- Consistent headers across all requests
- 401 auto-redirect to login

### 2. Service Layer Pattern
**File**: `src/services/index.ts`

Benefits:
- Separates API logic from UI components
- Easy to test
- Reusable across multiple components
- Type-safe with TypeScript interfaces
- Single place to update API endpoints

### 3. LocalStorage Utilities
**File**: `src/utils/authStorage.ts`

Benefits:
- Encapsulates localStorage logic
- Type-safe getter/setter methods
- Easy to switch storage mechanism if needed
- Prevents typos in localStorage keys

### 4. TypeScript Types
**File**: `src/types/index.ts`

Benefits:
- Compile-time type checking
- Auto-completion in IDE
- Self-documenting API contracts
- Prevents runtime errors

### 5. Environment Configuration
**Files**: `.env`, `src/config/index.ts`

Benefits:
- No hardcoded URLs or secrets
- Easy to switch environments (dev, staging, prod)
- Type-safe configuration access
- Single place to manage environment variables

---

## Testing the APIs

### Prerequisites
1. Backend server running at `http://localhost:8055`
2. Valid user credentials

### Testing Flow

1. **Test Login**:
   - Open http://localhost:5173
   - Enter email: test@example.com
   - Enter password: 63a9f0ea7bb98050796b649e85481845
   - Check localStorage for `accessToken` and `userId`

2. **Test Create Expense**:
   - After login, click "Add Expense"
   - Fill in the form
   - Submit and verify redirect
   - Check network tab for Authorization header

3. **Test Get Expenses**:
   - View expenses list
   - Check network tab for GET request
   - Verify Authorization header is present
   - Verify data is displayed in cards

---

## Error Handling

### Network Errors
All API errors are caught and displayed to the user with friendly messages.

### 401 Unauthorized
Automatically handled by the response interceptor:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clearAuth();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

### Form Validation
Client-side validation prevents invalid API calls:
- Email format validation
- Password required
- Amount must be positive number
- Description length 3-40 characters

---

## Maintainability Features

1. **Centralized API Client**: One place to configure base URL, headers, interceptors
2. **Type Safety**: TypeScript prevents many runtime errors
3. **Environment Variables**: Easy to change API endpoints
4. **Service Layer**: API logic separated from UI
5. **Consistent Error Handling**: Uniform error messages across the app
6. **Reusable Utilities**: Auth storage can be used anywhere
7. **Protected Routes**: Security is enforced at routing level

---

## Future Enhancements

If you need to add more API endpoints:

1. Add TypeScript types in `src/types/index.ts`
2. Add service method in `src/services/index.ts`
3. Use the service method in your component
4. Axios interceptor automatically handles authentication

Example:
```typescript
// types/index.ts
export interface UpdateExpenseRequest { ... }

// services/index.ts
export const expenseService = {
  updateExpense: async (id: number, data: UpdateExpenseRequest) => {
    const response = await apiClient.put(`/expense/personal/${id}`, data);
    return response.data.data;
  },
  
  deleteExpense: async (id: number) => {
    await apiClient.delete(`/expense/personal/${id}`);
  },
};
```

No need to manually add Authorization headers - the interceptor handles it!
