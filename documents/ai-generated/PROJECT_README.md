# FinPulse - Personal Expense Tracking Application

A modern React application built with TypeScript and Tailwind CSS for tracking personal expenses.

## Features

- **User Authentication**: Secure login with JWT token-based authentication
- **Create Expenses**: Add expenses with category, amount, and description
- **View Expenses**: Display all expenses in a card-based layout
- **Categories**: Support for multiple expense categories (rent, shopping, eat-out, travel, utilities, entertainment, healthcare, other)
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/        # Reusable components
│   └── ProtectedRoute.tsx
├── config/           # Configuration files
│   └── index.ts
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── CreateExpensePage.tsx
│   └── ExpenseListPage.tsx
├── services/         # API services
│   ├── apiClient.ts
│   └── index.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   └── authStorage.ts
├── App.tsx           # Main app component with routing
└── main.tsx          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd finpulse-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8055/api/v1
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## API Endpoints

### Authentication
- **POST** `/auth/login` - User login

### Expenses
- **POST** `/expense/personal` - Create a new expense
- **GET** `/expense/personal/:userId` - Get all expenses for a user

## Usage

1. **Login**: Enter your email and password (MD5 hashed) to login
2. **View Expenses**: After login, you'll see all your expenses in a card layout
3. **Add Expense**: Click "Add Expense" button to create a new expense
4. **Logout**: Click "Logout" to end your session

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8055/api/v1` |

## Key Features

### Authentication
- JWT token stored in localStorage
- Automatic token injection in API requests via Axios interceptors
- Protected routes that redirect to login if not authenticated
- Automatic redirect to expenses page if already logged in

### Expense Management
- Category-based expense tracking
- Validation for description length (3-40 characters)
- Decimal amount support
- Automatic month/year assignment
- Color-coded category badges

### User Experience
- Clean, modern UI with Tailwind CSS
- Light purple themed login page
- Responsive design for all screen sizes
- Loading states for async operations
- Error handling with user-friendly messages

## Code Quality

- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Separated concerns (services, components, utilities)
- **Type-safe API Client**: Axios instance with TypeScript interfaces
- **Protected Routes**: Authentication-based route protection
- **Environment Configuration**: Centralized configuration management

## License

MIT

## Author

Built for personal expense tracking needs.
