# Smart Expense Tracker

A full-featured expense tracking web application built with the MERN stack (MongoDB, Express.js, React, Node.js). Track your expenses, set financial goals, manage recurring bills, and gain insights into your spending habits with beautiful data visualizations.

## Features

### Public Pages (No Login Required)
- **Home Page**: Beautiful hero section with app overview and features
- **About Us**: Information about the app's mission and values
- **Contact Us**: Contact form and business information
- **Sign In/Sign Up**: User authentication with email and password (unified Auth page)

### Protected Pages (Login Required)
- **Dashboard**:
  - Monthly summary cards with spending analytics
  - Add/Edit/Delete expenses with full CRUD operations
  - Category-based filtering and search functionality
  - Interactive charts (Pie chart for category spending, Line chart for monthly trends)
  - Real-time expense tracking and statistics

- **Transactions**:
  - View all transactions with advanced filtering (date range, category, amount range)
  - Export transactions to CSV format
  - Total spending calculations and summaries
  - Pagination support for large datasets

- **Goals**:
  - Create and track financial goals with target amounts
  - Progress bars showing goal completion percentage
  - Deadline tracking with day counters
  - Goal categories (savings, investment, purchase, emergency, etc.)
  - Status management (active, completed, paused, cancelled)
  - Edit and delete goals

- **Bills**:
  - Manage recurring bills (weekly, biweekly, monthly, quarterly, yearly, once)
  - Due date tracking with overdue alerts
  - Total monthly bill calculations
  - Visual indicators for bills due soon
  - Payment history tracking
  - Auto-payment reminders

- **Profile**:
  - View and update account information
  - Change password functionality
  - Dark mode toggle with persistent preferences
  - User profile management

## Tech Stack

### Frontend
- **React 18** - Modern UI library (JSX, no TypeScript)
- **Vite** - Fast build tool and development server
- **React-Bootstrap** - Modern, responsive UI components
- **React Router DOM** - Client-side routing and navigation
- **Chart.js & React-Chartjs-2** - Interactive data visualization
- **Bootstrap Icons & React Icons** - Icon libraries
- **Lucide React** - Additional icon components
- **Custom CSS** - Blue & green finance theme with dark mode support

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing and encryption
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database Schema (MongoDB Collections)

#### Users Collection
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `firstName`, `lastName` - User names
- `avatar` - Profile picture URL
- `isActive` - Account status
- `lastLogin` - Last login timestamp
- `createdAt`, `updatedAt` - Timestamps

#### Expenses Collection
- `userId` - Reference to User
- `title` - Expense title/description
- `amount` - Expense amount
- `category` - Expense category (food, transport, shopping, entertainment, utilities, healthcare, education, travel, other)
- `date` - Expense date
- `description` - Additional details
- `tags` - Array of tags
- `isRecurring` - Recurring expense flag
- `paymentMethod` - Payment method used
- `location` - Expense location
- `createdAt` - Timestamp

#### Goals Collection
- `userId` - Reference to User
- `title` - Goal title
- `description` - Goal description
- `targetAmount` - Target amount to save
- `currentAmount` - Current saved amount
- `deadline` - Goal deadline date
- `category` - Goal category (savings, investment, purchase, emergency, education, travel, retirement, other)
- `status` - Goal status (active, completed, paused, cancelled)
- `priority` - Priority level (low, medium, high, urgent)
- `milestones` - Array of milestone objects
- `tags` - Array of tags
- `completedAt` - Completion timestamp
- `createdAt` - Timestamp

#### Bills Collection
- `userId` - Reference to User
- `title` - Bill title
- `description` - Bill description
- `amount` - Bill amount
- `category` - Bill category (utilities, rent, insurance, subscription, loan, mortgage, credit_card, phone, internet, other)
- `dueDate` - Next due date
- `frequency` - Recurrence frequency (weekly, biweekly, monthly, quarterly, yearly, once)
- `isActive` - Active status
- `isAutoPaid` - Auto-payment flag
- `lastPaid` - Last payment date
- `nextDueDate` - Calculated next due date
- `paymentMethod` - Payment method
- `reminderDays` - Days before due date to remind
- `gracePeriod` - Grace period in days
- `lateFee` - Late fee amount
- `vendor` - Vendor/company name
- `accountNumber` - Account number
- `paymentHistory` - Array of payment records
- `tags` - Array of tags
- `createdAt` - Timestamp

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000` (or the PORT specified in .env)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (default Vite port)

### Running Both Servers

For development, you'll need to run both servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Expenses (`/api/expenses`)
- `GET /api/expenses` - Get all expenses with filtering and pagination (Protected)
- `POST /api/expenses` - Create a new expense (Protected)
- `GET /api/expenses/:id` - Get a specific expense (Protected)
- `PUT /api/expenses/:id` - Update an expense (Protected)
- `DELETE /api/expenses/:id` - Delete an expense (Protected)
- `GET /api/expenses/stats/summary` - Get expense statistics (Protected)

### Goals (`/api/goals`)
- `GET /api/goals` - Get all goals (Protected)
- `POST /api/goals` - Create a new goal (Protected)
- `GET /api/goals/:id` - Get a specific goal (Protected)
- `PUT /api/goals/:id` - Update a goal (Protected)
- `DELETE /api/goals/:id` - Delete a goal (Protected)

### Bills (`/api/bills`)
- `GET /api/bills` - Get all bills (Protected)
- `POST /api/bills` - Create a new bill (Protected)
- `GET /api/bills/:id` - Get a specific bill (Protected)
- `PUT /api/bills/:id` - Update a bill (Protected)
- `DELETE /api/bills/:id` - Delete a bill (Protected)
- `POST /api/bills/:id/pay` - Mark bill as paid (Protected)

## Usage

### First Time Users
1. Navigate to the application in your browser
2. Click "Sign Up" on the home page or navigate to `/signin`
3. Enter your username, email, and password
4. After successful registration, you'll be redirected to the dashboard
5. Start adding expenses, setting goals, and tracking bills!

### Returning Users
1. Click "Login" on the home page or navigate to `/signin`
2. Enter your email and password
3. Access your dashboard and all saved data
4. Your session will persist until you log out

## Key Features Explained

### Authentication & Security
- JWT-based authentication with 24-hour token expiration
- Password hashing using bcryptjs (salt rounds: 12)
- Protected routes using middleware authentication
- User-specific data isolation (users can only access their own data)
- Account activation/deactivation support

### Dark Mode
- Toggle between light and dark themes
- Preference is saved to user profile
- Smooth transitions between themes
- Theme persists across sessions

### Expense Categories
- **Food** - Food & Dining expenses
- **Transport** - Transportation costs
- **Shopping** - Shopping expenses
- **Entertainment** - Entertainment and leisure
- **Utilities** - Bills & Utilities
- **Healthcare** - Medical and health expenses
- **Education** - Educational expenses
- **Travel** - Travel and vacation costs
- **Other** - Miscellaneous expenses

### Goal Categories
- **Savings** - General savings goals
- **Investment** - Investment goals
- **Purchase** - Specific purchase goals
- **Emergency** - Emergency fund goals
- **Education** - Education-related goals
- **Travel** - Travel goals
- **Retirement** - Retirement planning
- **Other** - Other financial goals

### Bill Frequencies
- **Weekly** - Recurring weekly bills
- **Biweekly** - Every two weeks
- **Monthly** - Monthly recurring bills
- **Quarterly** - Every three months
- **Yearly** - Annual bills
- **Once** - One-time bills

### Data Visualization
- **Pie Chart**: Shows spending distribution across categories
- **Line Chart**: Displays monthly spending trends over time
- **Summary Cards**: Quick overview of total expenses, monthly spending, and transaction counts
- **Progress Bars**: Visual goal completion indicators

## Project Structure

```
Smart Expense Tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model schema
│   │   ├── Expense.js         # Expense model schema
│   │   ├── Goal.js            # Goal model schema
│   │   └── Bill.js            # Bill model schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── expenses.js        # Expense CRUD routes
│   │   ├── goals.js           # Goal CRUD routes
│   │   └── bills.js           # Bill CRUD routes
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js      # API client with token handling
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation bar component
│   │   │   ├── Navbar.css     # Navbar styles
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   └── ProtectedRoute.jsx  # Route guard component
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx     # Authentication context
│   │   │   └── ThemeContext.jsx    # Dark mode context
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── About.jsx      # About page
│   │   │   ├── Contact.jsx    # Contact page
│   │   │   ├── Signin.jsx     # Login/Signup page
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── Profile.jsx    # User profile page
│   │   │   ├── Transactions.jsx   # Transactions list page
│   │   │   ├── Goals.jsx      # Goals management page
│   │   │   └── Bills.jsx      # Bills management page
│   │   ├── assets/            # Images and static assets
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── .env                   # Frontend environment variables
│
└── README.md                  # Project documentation
```

## Design Philosophy

- **Clean & Modern**: Professional UI with blue & green finance theme
- **Responsive**: Works seamlessly on mobile, tablet, and desktop devices
- **User-Friendly**: Intuitive navigation and clear visual feedback
- **Performance**: Optimized rendering and efficient data fetching
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Scalable**: Modular architecture for easy feature additions

## Development Notes

- **MERN Stack**: Full-stack JavaScript application using MongoDB, Express, React, and Node.js
- **No TypeScript**: All files are plain JavaScript (.jsx files)
- **React-Bootstrap**: Used exclusively for UI components (no Tailwind CSS in use)
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **RESTful API**: RESTful API design with proper HTTP methods and status codes
- **Error Handling**: Comprehensive error handling on both frontend and backend

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes with authentication middleware
- User data isolation (users can only access their own data)
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Environment variables for sensitive data

## Future Enhancements

- Email notifications for bill reminders
- Receipt upload and storage
- Budget planning and tracking
- Multi-currency support
- Data export in multiple formats (PDF, Excel)
- Mobile app (React Native)
- Social features (share goals, compare spending)
- Recurring expense automation
- Advanced analytics and insights

## Support

For issues or questions, visit the Contact Us page in the application or open an issue on the project repository.

## License

This project is open source and available for educational purposes.
