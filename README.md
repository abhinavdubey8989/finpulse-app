# FinPulse - Personal Expense Tracking Application

A modern React application built with TypeScript and Tailwind CSS for tracking personal expenses.

## Features

- **User Authentication**: Secure login with MD5 password hashing and JWT token-based authentication
- **Create Expenses**: Add expenses with category, amount, and description
- **View Expenses**: Display all expenses in a card-based layout
- **Categories**: Support for multiple expense categories
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **MD5** - Password hashing


### Development

Start the development server:
```bash
npm run dev
```

### Build

Create a production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components (ProtectedRoute)
├── config/           # Environment configuration
├── pages/            # 3 main pages (Login, CreateExpense, ExpenseList)
├── services/         # API client and services
├── types/            # TypeScript interfaces
├── utils/            # Utilities (authStorage)
└── App.tsx           # Main app with routing
```