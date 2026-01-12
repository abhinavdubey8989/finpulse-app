# Application Flow & Architecture

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Start                          │
│                   http://localhost:5173                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Check Auth    │
                    │ (localStorage) │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐          ┌─────────────┐
        │ Authenticated│          │    Not      │
        │     YES      │          │Authenticated│
        └──────┬───────┘          └──────┬──────┘
               │                         │
               ▼                         ▼
    ┌──────────────────┐       ┌─────────────────┐
    │ Redirect to      │       │  Login Page     │
    │ /expenses        │       │  (Page 1)       │
    └──────────────────┘       └────────┬────────┘
                                        │
                          ┌─────────────┴──────────┐
                          │  Enter Credentials     │
                          │  - Email               │
                          │  - Password (hashed)   │
                          └─────────────┬──────────┘
                                       │
                                       ▼
                          ┌──────────────────────┐
                          │  POST /auth/login    │
                          │  Store accessToken   │
                          │  Store userId        │
                          └─────────┬────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   Expense List Page      │
                    │      (Page 3)            │
                    │                          │
                    │  - Display all expenses  │
                    │  - Show total amount     │
                    │  - Add Expense button    │
                    │  - Logout button         │
                    └──────┬─────────┬─────────┘
                           │         │
                 ┌─────────┘         └────────┐
                 │                            │
                 ▼                            ▼
    ┌────────────────────┐        ┌────────────────┐
    │  Click "Add        │        │  Click "Logout"│
    │   Expense"         │        │                │
    └────────┬───────────┘        └────────┬───────┘
             │                              │
             ▼                              ▼
    ┌─────────────────┐         ┌──────────────────┐
    │ Create Expense  │         │  Clear Auth      │
    │    Page         │         │  Redirect to /   │
    │   (Page 2)      │         └──────────────────┘
    │                 │
    │ - Category      │
    │ - Amount        │
    │ - Description   │
    └────────┬────────┘
             │
             ▼
    ┌──────────────────────┐
    │ POST /expense/       │
    │      personal        │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Redirect to         │
    │  Expense List        │
    │  (Page 3)            │
    └──────────────────────┘
```

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Application                      │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │              React Router                           │ │  │
│  │  │  ┌────────────┐ ┌─────────────┐ ┌───────────────┐ │ │  │
│  │  │  │   /        │ │  /expenses  │ │ /create-      │ │ │  │
│  │  │  │  (Login)   │ │   (List)    │ │  expense      │ │ │  │
│  │  │  └────────────┘ └─────────────┘ └───────────────┘ │ │  │
│  │  └───────────────────────┬─────────────────────────────┘ │  │
│  │                          │                               │  │
│  │  ┌───────────────────────▼─────────────────────────────┐ │  │
│  │  │              React Components                       │ │  │
│  │  │  - LoginPage.tsx                                    │ │  │
│  │  │  - ExpenseListPage.tsx                              │ │  │
│  │  │  - CreateExpensePage.tsx                            │ │  │
│  │  │  - ProtectedRoute.tsx                               │ │  │
│  │  └───────────────────────┬─────────────────────────────┘ │  │
│  │                          │                               │  │
│  │  ┌───────────────────────▼─────────────────────────────┐ │  │
│  │  │              Service Layer                          │ │  │
│  │  │  - authService.login()                              │ │  │
│  │  │  - expenseService.createExpense()                   │ │  │
│  │  │  - expenseService.getExpenses()                     │ │  │
│  │  └───────────────────────┬─────────────────────────────┘ │  │
│  │                          │                               │  │
│  │  ┌───────────────────────▼─────────────────────────────┐ │  │
│  │  │            Axios Instance (apiClient)               │ │  │
│  │  │  - Request Interceptor: Add Bearer Token           │ │  │
│  │  │  - Response Interceptor: Handle 401                │ │  │
│  │  └───────────────────────┬─────────────────────────────┘ │  │
│  │                          │                               │  │
│  └──────────────────────────┼───────────────────────────────┘  │
│                             │                                  │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │              LocalStorage                                │  │
│  │  - accessToken: "jwt-token..."                          │  │
│  │  - userId: "123"                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTP Requests
                              │ (with Bearer token)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API Server                          │
│                  http://localhost:8055/api/v1                   │
│                                                                 │
│  POST   /auth/login                                             │
│  POST   /expense/personal                                       │
│  GET    /expense/personal/:userId                               │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure & Responsibilities

```
src/
│
├── main.tsx                      # Entry point - Renders <App />
│
├── App.tsx                       # Root component
│   └── Defines routes using React Router
│       ├── / → LoginPage (or redirect if authenticated)
│       ├── /expenses → ExpenseListPage (protected)
│       └── /create-expense → CreateExpensePage (protected)
│
├── components/
│   └── ProtectedRoute.tsx       # HOC for route protection
│       └── Checks authStorage.isAuthenticated()
│           ├── YES → Render children
│           └── NO  → Redirect to /
│
├── pages/
│   ├── LoginPage.tsx            # Page 1: Authentication
│   │   ├── Renders: Email & Password inputs
│   │   ├── Calls: authService.login()
│   │   └── On Success: Navigate to /expenses
│   │
│   ├── CreateExpensePage.tsx    # Page 2: Add Expense
│   │   ├── Renders: Category, Amount, Description inputs
│   │   ├── Validates: Description length, Amount > 0
│   │   ├── Calls: expenseService.createExpense()
│   │   └── On Success: Navigate to /expenses
│   │
│   └── ExpenseListPage.tsx      # Page 3: View All Expenses
│       ├── Fetches: expenseService.getExpenses()
│       ├── Renders: Expense cards with categories
│       ├── Shows: Total amount
│       └── Actions: Add Expense, Logout
│
├── services/
│   ├── apiClient.ts             # Axios instance configuration
│   │   ├── Base URL: from environment config
│   │   ├── Request Interceptor: Adds Authorization header
│   │   └── Response Interceptor: Handles 401 errors
│   │
│   └── index.ts                 # API service functions
│       ├── authService
│       │   └── login(email, password)
│       │       ├── POST /auth/login
│       │       ├── Stores token & userId
│       │       └── Returns LoginResponse
│       │
│       └── expenseService
│           ├── createExpense(expenseData)
│           │   ├── POST /expense/personal
│           │   └── Returns CreateExpenseResponse
│           │
│           └── getExpenses(userId)
│               ├── GET /expense/personal/:userId
│               └── Returns Expense[]
│
├── utils/
│   └── authStorage.ts           # LocalStorage wrapper
│       ├── setToken(token)
│       ├── getToken()
│       ├── setUserId(userId)
│       ├── getUserId()
│       ├── clearAuth()
│       └── isAuthenticated()
│
├── types/
│   └── index.ts                 # TypeScript interfaces
│       ├── ApiResponse<T>
│       ├── LoginRequest, LoginResponse
│       ├── CreateExpenseRequest, CreateExpenseResponse
│       ├── Expense
│       └── ExpenseCategory
│
└── config/
    └── index.ts                 # Environment configuration
        └── apiBaseUrl: from VITE_API_BASE_URL
```

## Data Flow Examples

### Example 1: Login Flow

```
User enters credentials
        │
        ▼
LoginPage.handleSubmit()
        │
        ▼
authService.login(email, password)
        │
        ▼
apiClient.post('/auth/login', { email, hashedPassword })
        │
        ▼
Backend returns: { accessToken, userId, ... }
        │
        ▼
authStorage.setToken(accessToken)
authStorage.setUserId(userId)
        │
        ▼
navigate('/expenses')
        │
        ▼
ExpenseListPage loads
```

### Example 2: Create Expense Flow

```
User fills form
        │
        ▼
CreateExpensePage.handleSubmit()
        │
        ▼
Validation checks
        │
        ▼
expenseService.createExpense({ category, amount, description, ... })
        │
        ▼
authStorage.getUserId() → Get userId
        │
        ▼
apiClient.post('/expense/personal', { userId, category, ... })
        │
        ├→ Request Interceptor: Adds Authorization: Bearer <token>
        │
        ▼
Backend returns: { id: 6 }
        │
        ▼
navigate('/expenses')
        │
        ▼
ExpenseListPage fetches updated list
```

### Example 3: Protected Route Access

```
User navigates to /expenses
        │
        ▼
ProtectedRoute component
        │
        ▼
authStorage.isAuthenticated()
        │
        ├─ YES → Render ExpenseListPage
        │         │
        │         ▼
        │    useEffect() runs
        │         │
        │         ▼
        │    expenseService.getExpenses(userId)
        │         │
        │         ▼
        │    apiClient.get('/expense/personal/123')
        │         │
        │         ├→ Request Interceptor: Adds Bearer token
        │         │
        │         ▼
        │    Backend returns expense array
        │         │
        │         ▼
        │    setExpenses(data) → UI updates
        │
        └─ NO → Navigate to '/'
                │
                ▼
           LoginPage shown
```

## State Management

### Component State
Each page manages its own state:
- **LoginPage**: email, password, error, isLoading
- **CreateExpensePage**: category, amount, description, error, isLoading
- **ExpenseListPage**: expenses[], isLoading, error

### Global State (via localStorage)
- `accessToken`: JWT token for authentication
- `userId`: Current user's ID

### Why No Redux/Context?
- Simple app with minimal shared state
- Authentication state in localStorage
- Each page fetches its own data
- No complex state updates across components
- Easier to understand and maintain

## Security Features

1. **Protected Routes**: Unauthenticated users redirected to login
2. **Token Storage**: JWT stored in localStorage
3. **Automatic Token Injection**: Axios interceptor adds Bearer token
4. **401 Handling**: Auto-logout and redirect on unauthorized
5. **No Token in URL**: Token never exposed in URL parameters
6. **Form Validation**: Client-side validation before API calls

## Performance Optimizations

1. **Code Splitting**: React Router lazy loading (can be added)
2. **Vite**: Fast HMR and optimized builds
3. **Tailwind CSS**: Purges unused styles in production
4. **Axios Interceptors**: Centralized request/response handling
5. **TypeScript**: Compile-time optimizations

## Error Handling Strategy

```
Component tries API call
        │
        ▼
   try { ... }
        │
        ├→ Success: Update state, navigate
        │
        └→ catch (err)
              │
              ▼
         Extract error message
              │
              ▼
         setError(message)
              │
              ▼
         Display to user in UI
```

Special case: 401 Unauthorized
```
API returns 401
        │
        ▼
Response Interceptor catches
        │
        ▼
authStorage.clearAuth()
        │
        ▼
window.location.href = '/'
```

---

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type-safe API calls
- ✅ Centralized authentication
- ✅ Reusable service layer
- ✅ Protected routes
- ✅ Consistent error handling
- ✅ Maintainable codebase
- ✅ Scalable structure
