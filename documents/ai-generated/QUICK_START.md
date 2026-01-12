# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- Backend API running at `http://localhost:8055`
- npm

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
The `.env` file is already configured:
```env
VITE_API_BASE_URL=http://localhost:8055/api/v1
```

If your backend runs on a different URL, update this file.

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

## 🎯 Testing the Application

### Step 1: Login
1. Open http://localhost:5173
2. You'll see the **Login Page** with a light purple background
3. Enter credentials:
   - **Email**: `test@example.com`
   - **Password**: `63a9f0ea7bb98050796b649e85481845`
4. Click **Login**
5. You'll be redirected to the **Expense List Page**

### Step 2: View Expenses
- The **Expense List Page** displays all your expenses as cards
- Each card shows:
  - Category badge (color-coded)
  - Amount
  - Description
  - Month/Year
  - Creation date
- Total expenses shown at the top
- Empty state if no expenses exist

### Step 3: Add New Expense
1. Click the **"+ Add Expense"** button
2. You'll see the **Create Expense Form**
3. Fill in the details:
   - **Category**: Select from dropdown (rent, shopping, eat-out, travel, etc.)
   - **Amount**: Enter amount (decimals allowed, e.g., 99.99)
   - **Description**: Enter 3-40 characters
4. Click **"Create Expense"**
5. You'll be redirected back to the **Expense List Page**
6. Your new expense will appear in the list

### Step 4: Logout
1. Click the **"Logout"** button on the Expense List Page
2. You'll be redirected to the Login Page
3. Your session will be cleared

## 📁 Project Structure

```
finpulse-app/
├── src/
│   ├── pages/                    # 3 Main Pages
│   │   ├── LoginPage.tsx         # Page 1: Login
│   │   ├── CreateExpensePage.tsx # Page 2: Add Expense
│   │   └── ExpenseListPage.tsx   # Page 3: View Expenses
│   │
│   ├── components/               # Reusable Components
│   │   └── ProtectedRoute.tsx    # Route Protection
│   │
│   ├── services/                 # API Layer
│   │   ├── apiClient.ts          # Axios Configuration
│   │   └── index.ts              # API Services
│   │
│   ├── types/                    # TypeScript Types
│   │   └── index.ts
│   │
│   ├── utils/                    # Utilities
│   │   └── authStorage.ts        # LocalStorage Management
│   │
│   ├── config/                   # Configuration
│   │   └── index.ts
│   │
│   └── App.tsx                   # Main App with Routing
│
├── .env                          # Environment Variables
└── package.json
```

## 🔧 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at http://localhost:5173

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder

### Preview
```bash
npm run preview
```
Preview the production build locally

### Lint
```bash
npm run lint
```
Run ESLint to check code quality

## 🌐 API Endpoints Used

### 1. Login
**POST** `/auth/login`
```json
{
  "email": "test@example.com",
  "hashedPassword": "63a9f0ea7bb98050796b649e85481845"
}
```
**Response**: `{ accessToken, userId, personalExpenseSettings }`

### 2. Create Expense
**POST** `/expense/personal`
```json
{
  "userId": 1,
  "year": 2026,
  "month": "january",
  "category": "travel",
  "amount": 100,
  "description": "Taxi fare"
}
```
**Response**: `{ id: 6 }`

### 3. Get Expenses
**GET** `/expense/personal/:userId`

**Response**: Array of expenses
```json
[
  {
    "id": 1,
    "amount": 100,
    "category": "travel",
    "description": "Goto some place",
    "month": "january",
    "year": 2026,
    "createdAt": "2026-01-08T15:19:55.716735Z"
  }
]
```

## 🔐 Authentication

### How It Works
1. Login with email/password
2. Backend returns JWT token + userId
3. Token stored in localStorage
4. All subsequent API requests include `Authorization: Bearer <token>` header
5. Logout clears localStorage

### Protected Routes
- `/expenses` - Requires authentication
- `/create-expense` - Requires authentication
- `/` (Login) - Redirects to expenses if already authenticated

## 🎨 Features

✅ **Authentication**: Secure login with JWT  
✅ **Protected Routes**: Automatic redirect if not authenticated  
✅ **Create Expense**: Form with validation  
✅ **View Expenses**: Card-based display  
✅ **Categories**: 8 expense categories with color coding  
✅ **Responsive Design**: Works on all screen sizes  
✅ **Error Handling**: User-friendly error messages  
✅ **Loading States**: Visual feedback during API calls  
✅ **Auto Logout**: On 401 unauthorized errors  

## 🐛 Troubleshooting

### Backend Not Running
**Error**: Network errors or API calls failing

**Solution**: Make sure your backend is running at `http://localhost:8055`

### Port Already in Use
**Error**: Port 5173 is already in use

**Solution**: 
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Login Fails
**Error**: Invalid credentials

**Solution**: 
- Verify backend is running
- Check credentials match what's in your backend database
- The password should be MD5 hashed: `63a9f0ea7bb98050796b649e85481845`

### CORS Errors
**Error**: CORS policy blocking requests

**Solution**: Configure CORS on your backend to allow `http://localhost:5173`

## 📚 Documentation

For more details, see:
- **PROJECT_README.md** - Comprehensive project documentation
- **API_INTEGRATION_GUIDE.md** - How CURL requests were converted
- **ARCHITECTURE_FLOW.md** - Visual architecture diagrams
- **IMPLEMENTATION_SUMMARY.md** - Complete feature list
- **REQUIREMENTS_CHECKLIST.md** - Requirements verification

## ✅ What's Included

✅ React 19 + TypeScript  
✅ Vite for fast development  
✅ Tailwind CSS for styling  
✅ React Router for navigation  
✅ Axios for API calls  
✅ Environment configuration  
✅ Type-safe API layer  
✅ Protected routes  
✅ LocalStorage management  
✅ Error handling  
✅ Form validation  
✅ Responsive design  
✅ Production build ready  

## 🎯 Next Steps

1. **Test Locally**: Follow the testing steps above
2. **Backend Setup**: Ensure backend API is running
3. **Customize**: Modify categories, add features, etc.
4. **Deploy**: Build for production and deploy

## 💡 Tips

- **Development**: Hot Module Replacement (HMR) is enabled - changes reflect instantly
- **Type Safety**: TypeScript catches errors at compile time
- **API Client**: Axios interceptors automatically handle authentication
- **Debugging**: Check browser console and Network tab for API calls
- **Environment**: Update `.env` for different API endpoints

---

## 🚀 You're Ready to Go!

Start the dev server and open http://localhost:5173 to see your expense tracking app in action!

```bash
npm run dev
```

**Happy Coding! 💜**
