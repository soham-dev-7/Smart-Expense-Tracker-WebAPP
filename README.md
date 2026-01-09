# Smart Expense Tracker

A full-featured expense tracking web application built with React, React-Bootstrap, and Supabase. Track your expenses, set financial goals, manage recurring bills, and gain insights into your spending habits.

## Features

### Public Pages (No Login Required)
- **Home Page**: Beautiful hero section with app overview and features
- **About Us**: Information about the app's mission and values
- **Contact Us**: Contact form and business information
- **Login/SignUp**: User authentication with email and password

### Protected Pages (Login Required)
- **Dashboard**:
  - Monthly summary cards with spending analytics
  - Add/Edit/Delete expenses
  - Category-based filtering and search
  - Interactive charts (Pie chart for category spending, Line chart for monthly trends)
  - Real-time expense tracking

- **Transactions**:
  - View all transactions with filtering by date range and category
  - Export transactions to CSV
  - Total spending calculations

- **Goals**:
  - Create and track financial goals
  - Progress bars showing goal completion
  - Deadline tracking with day counters
  - Edit and delete goals

- **Bills**:
  - Manage recurring bills (weekly, monthly, yearly)
  - Due date tracking with overdue alerts
  - Total monthly bill calculations
  - Visual indicators for bills due soon

- **Profile**:
  - View account information
  - Change password functionality
  - Dark mode toggle

## Tech Stack

### Frontend
- React (JSX) - No TypeScript
- React-Bootstrap - Modern, responsive UI components
- React Router DOM - Client-side routing
- Chart.js & React-Chartjs-2 - Data visualization
- Custom CSS with blue & green finance theme

### Backend
- Supabase - PostgreSQL database
- Supabase Auth - Email/password authentication
- Row Level Security (RLS) - Secure data access

### Database Schema
- `profiles` - User profile information
- `expenses` - Expense tracking records
- `goals` - Financial goals
- `recurring_bills` - Recurring bill management

## Setup Instructions

1. The project is already configured with Supabase credentials in `.env`

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. The database schema has been created with:
   - All necessary tables (profiles, expenses, goals, recurring_bills)
   - Row Level Security enabled
   - Proper policies for authenticated users

4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

### First Time Users
1. Click "Sign Up" on the home page
2. Enter your name, email, and password
3. After registration, you'll be redirected to the dashboard
4. Start adding expenses, setting goals, and tracking bills!

### Returning Users
1. Click "Login" on the home page
2. Enter your email and password
3. Access your dashboard and all saved data

## Key Features Explained

### Dark Mode
- Toggle between light and dark themes
- Preference is saved to your profile
- Smooth transitions between themes

### Expense Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Other

### Data Visualization
- **Pie Chart**: Shows spending distribution across categories
- **Line Chart**: Displays monthly spending trends over the year
- **Summary Cards**: Quick overview of total expenses, monthly spending, and transaction counts

### Security
- All data is protected with Row Level Security
- Users can only access their own data
- Passwords are securely hashed
- JWT-based authentication

## File Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar with auth state
│   ├── Footer.jsx      # Site footer
│   └── ProtectedRoute.jsx  # Route guard for authenticated pages
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state management
│   └── ThemeContext.jsx # Dark mode state management
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── About.jsx       # About page
│   ├── Contact.jsx     # Contact page
│   ├── Login.jsx       # Login page
│   ├── SignUp.jsx      # Registration page
│   ├── Dashboard.jsx   # Main dashboard with expense tracking
│   ├── Profile.jsx     # User profile and settings
│   ├── Transactions.jsx # Transaction list and export
│   ├── Goals.jsx       # Financial goals management
│   └── Bills.jsx       # Recurring bills management
├── App.jsx             # Main app component with routing
├── main.jsx            # App entry point
├── index.css           # Global styles and theme
└── supabaseClient.js   # Supabase configuration
```

## Design Philosophy

- **Clean & Modern**: Professional UI with blue & green finance theme
- **Responsive**: Works seamlessly on mobile and desktop
- **User-Friendly**: Intuitive navigation and clear visual feedback
- **Performance**: Optimized rendering and efficient data fetching
- **Accessibility**: Semantic HTML and proper ARIA labels

## Notes

- This implementation uses Supabase (PostgreSQL) instead of MongoDB as it's the available database solution in this environment
- All the MERN stack functionality is preserved using Supabase's real-time database and authentication
- No TypeScript - all files are plain JavaScript (.jsx files)
- React-Bootstrap is used exclusively for UI components (no Tailwind CSS)

## Support

For issues or questions, visit the Contact Us page in the application.
