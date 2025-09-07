# Expense Tracker Application

## 🚀 Features

### Core Functionality

- **Expense Management**: Add, edit, delete, and view expenses
- **User Management**: Support for multiple users with individual tracking
- **Category Management**: Organized expense categorization
- **Advanced Filtering**: Filter expenses by user, category, or date range
- **Real-time Dashboard**: Overview of spending patterns and key metrics

### Statistics & Analytics

1. **Top 3 Spending Days**: Find each user's top 3 days by total expenditure
2. **Monthly Spending Changes**: Calculate percentage change from previous month
3. **Spending Predictions**: Predict next month's spending based on last 3 months average

## 🛠️ Technology Stack

### Frontend

- **React.js 18**
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API communication
- **Lucide React** for icons
- **Date-fns** for date manipulation

### Backend

- **Node.js** with Express.js
- **MySQL2** for database connectivity
- **Joi** for data validation
- **CORS** for cross-origin requests
- **Dotenv** for environment configuration

### Database

- **MySQL 8.0+** with optimized schema
- **Foreign key constraints** for data integrity
- **Indexed queries** for performance

## 📋 Prerequisites

- Node.js (version 18.0.0 or higher)
- MySQL (version 8.0 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Database Setup

1. Install and start MySQL
2. Create database and run the SQL script from `database_setup.sql`
3. Verify data insertion

### 3. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

### 4. Frontend Setup

```bash
# In a new terminal
npm install
npm run dev
```

### 5. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

# Expense Tracker Backend API

A RESTful API built with Node.js, Express, and MySQL following the MVC (Model-View-Controller) architecture pattern.

## Architecture Overview

### MVC Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Business logic layer
├── middleware/      # Custom middleware functions
├── models/          # Data access layer
├── routes/          # Route definitions
├── database/        # Database schema and migrations
└── server.js        # Application entry point
```

### Design Patterns Used
- **MVC Pattern**: Separation of concerns with Models, Controllers, and Routes
- **Repository Pattern**: Models handle all database operations
- **Middleware Pattern**: Reusable middleware for validation, logging, and error handling
- **Factory Pattern**: Consistent object creation in models

## API Endpoints

### Expenses
- `GET /api/expenses` - Get expenses with filtering and pagination
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Statistics
- `GET /api/statistics/top-spending-days` - Top 3 spending days per user
- `GET /api/statistics/monthly-change` - Monthly spending changes
- `GET /api/statistics/spending-prediction` - Next month predictions

## Features

### Data Validation
- **Client-side**: React Hook Form with real-time validation
- **Server-side**: Joi validation schemas for all endpoints
- **Database**: Foreign key constraints and data integrity

### Error Handling
- Global error handling middleware
- Consistent error response format
- Detailed error logging
- Environment-specific error details

### Security
- Input sanitization and validation
- SQL injection prevention with parameterized queries
- CORS configuration
- Error message sanitization in production

### Performance
- Database connection pooling
- Optimized queries with proper indexing
- Pagination for large datasets
- Efficient JOIN operations

## Database Schema

### Tables
1. **users**: User information and status
2. **categories**: Expense categories
3. **expenses**: Main expense records with foreign keys

### Relationships
- `expenses.user_id` → `users.id` (CASCADE DELETE)
- `expenses.category_id` → `categories.id` (RESTRICT DELETE)

### Indexes
- `idx_user_date`: Optimizes user-specific date queries
- `idx_category`: Optimizes category filtering
- `idx_date`: Optimizes date range queries

## Statistics Implementation

### 1. Top Spending Days
Uses window functions (ROW_NUMBER) to rank daily spending per user and returns top 3 days.

### 2. Monthly Changes
Uses LAG window function to compare current month spending with previous month and calculate percentage change.

### 3. Spending Predictions
Calculates average spending over last 3 months to predict next month's expenditure.

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...],
  "error": "Detailed error message"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    status TINYINT DEFAULT 1 COMMENT '1=active, 2=inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1 for active and 2 for inactive users

### Categories Table

```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Expenses Table

```sql
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_user_date (user_id, date),
    INDEX idx_category (category_id),
    INDEX idx_date (date)
);
```

## 🔌 API Endpoints

### Expenses

- `GET /api/expenses` - Get all expenses with filters and pagination
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Statistics

- `GET /api/statistics/top-spending-days` - Get top 3 spending days per user
- `GET /api/statistics/monthly-change` - Get monthly spending changes
- `GET /api/statistics/spending-prediction` - Get spending predictions

### Users & Categories

- `GET /api/users` - Get all users
- `GET /api/categories` - Get all categories

## 🎨 User Interface

### Dashboard

- **Overview Cards**: Total expenses, monthly spending, active users, categories
- **Recent Expenses**: Latest expense entries with quick actions
- **Category Breakdown**: Visual representation of spending by category
- **Statistics Preview**: Quick access to key statistics

### Expense Management

- **Add/Edit Forms**: Intuitive forms with validation
- **Filter System**: Advanced filtering by user, category, and date range
- **Expense List**: Clean, responsive list with pagination
- **Quick Actions**: Edit and delete buttons for each expense

### Statistics Views

- **Top Spending Days**: User-wise breakdown with ranking
- **Monthly Changes**: Trend analysis with percentage indicators
- **Predictions**: AI-like predictions with historical context

## 🔒 Validation & Security

### Client-Side Validation

- Required field validation
- Data type validation
- Range validation for amounts
- Date validation
- Real-time error feedback

### Server-Side Validation

- Joi schema validation
- Database constraint validation
- Input sanitization
- Error handling and logging

## 🧪 Testing Data

The application includes comprehensive sample data:

- **6 Users**: Different spending patterns and behaviors
- **15 Categories**: Comprehensive expense categorization
- **50+ Expenses**: Multi-month data for statistics

## 🚀 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading for large datasets
- **Lazy Loading**: Component-based code splitting

## 📝 Development Guidelines

### Code Structure

```
src/
├── components/          # Reusable UI components
│   ├── Expenses/       # Expense-related components
│   ├── Statistics/     # Statistics components
│   ├── Layout/         # Layout components
│   └── UI/            # Generic UI components
├── pages/              # Page components
├── store/              # Redux store and slices
├── services/           # API services
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

### Backend Structure

```
backend/
├── controllers/        # Request handlers
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── config/            # Configuration files
```

## 🔧 Environment Configuration

### Backend (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
PORT=5000
NODE_ENV=development
```

### Frontend

- API base URL: `http://localhost:5000/api`
- Development server: `http://localhost:5173`

## 📊 Sample Statistics Screenshots

The application provides three key statistics:

1. **Top Spending Days**: Shows each user's highest spending days
2. **Monthly Changes**: Displays month-over-month spending trends
3. **Spending Predictions**: Predicts future spending based on historical data