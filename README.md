# Budgetter - Your Daily Expenses Tracker

**Budgetter** is designed to help students and individuals track their daily expenses, analyze their spending habits, and manage their pocket money efficiently. This project was born out of the need for a better system to keep track of personal finances, beyond just noting down expenses without proper analytics.

## Table of Contents

1. [Features](#features)
2. [Screenshot of Project](#screenshot-of-project)
3. [Project Structure](#project-structure)
4. [Technology Stack](#technology-stack)
5. [How to Use Locally](#how-to-use-locally)
6. [Testing & Quality Gates](#testing--quality-gates)
7. [Contributing](#contributing)
8. [API Endpoints](#api-endpoints)
9. [Environment Variables](#environment-variables)
10. [Live Demo](#live-demo)

## Features

### User Features

#### 1. Dashboard

- Visualize your total pocket money, expenses, recent spending, and which categories consume the most money.
- Get a quick overview of your financial status at a glance.

#### 2. Profile Management

- Users can view and update personal details including name, email, date of birth, profession, and profile picture.
- Social media links (Instagram, Facebook) can be added to your profile.
- Secure password management with update functionality.

#### 3. Add Expense

- Users can add expenses with the following details: date, name, category, and amount.
- If you've already added an expense today, it will automatically show below in a table displaying today's added expenses.

#### 4. Show Expenses

- By default, this section shows today's expenses.
- It includes a date filter to view expenses based on specific days, displaying details such as ID, name, price, category, and the time the expense was added.

#### 5. Reports & Analytics

- The Reports section provides detailed insights into your spending:
  - Displays all expenses for the current month by default.
  - Includes filters such as:
    - Last 7 days' expenses.
    - Total expenses by category.
    - Date range input for expenses.
    - Select a specific month to view its expenses.

#### 6. Add Money (Wallet Management)

- Users can add the money they receive from any source (e.g., parents, salary) to their account.
- The wallet shows previous money entries with source and date, stored securely in the database.

#### 7. Add Lent Money

- Record money you lend with details (amount, recipient, date). The amount is deducted from your wallet and added back when you mark it as "Money Received".
- Track outstanding loans and money you've lent to others.

#### 8. Delete Account

- Users can permanently delete their account.
- Removes all data, including expenses, lent money, and records. Data is archived in deleted users collection for audit purposes.

#### 9. Authentication & Security

- **Email Verification**: New users receive a verification link after account creation.
- **Forgot Password**: Reset password through email with a secure reset link.
- **Change Password**: Update your password securely through the profile settings.
- **Session Management**: Active session tracking with token management.
- **Google OAuth**: Sign in with Google for faster authentication.
- **Local Authentication**: Traditional email/password login system.

### Admin Features

#### 10. User Management

- Admin dashboard to view all registered users.
- User details cards showing comprehensive information.
- Monitor user activity and account status.

#### 11. Newsletter Management

- Upload and manage newsletter content.
- Send updates and announcements to all users.

### Additional Features

#### 12. Responsive Design

- Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices.
- Adaptive layout with mobile-optimized navigation.

#### 13. Dark/Light Theme

- Toggle between dark and light mode for comfortable viewing.
- Theme preference is persisted across sessions.

#### 14. Error Tracking & Monitoring

- Integrated with Sentry for real-time error tracking and performance monitoring.
- Improved reliability through proactive issue detection.

#### 15. Animated UI

- Smooth animations and transitions for enhanced user experience.
- Interactive cursor effects on desktop.

---

## Screenshot of Project

### 1. Landing Page

![Landing Page Screenshot](https://res.cloudinary.com/budgettercloud/image/upload/v1772306125/uploads_that_mhel2k.png)

### 2. Dashboard

![Dashboard Page Screenshot](https://res.cloudinary.com/budgettercloud/image/upload/v1772306243/Screenshot_2_sulxay.png)

---

## Project Structure

```
Budgetter-Webapp/
├── client/                          # Frontend (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── admin/              # Admin-specific components
│   │   │   ├── animation/          # Animation components
│   │   │   ├── auth/               # Authentication components
│   │   │   ├── cards/              # Card components
│   │   │   ├── header/             # Header components
│   │   │   ├── home/               # Landing page components
│   │   │   ├── layout/             # Layout components
│   │   │   ├── navbar/             # Navigation components
│   │   │   ├── profile/            # Profile components
│   │   │   ├── seo/                # SEO components
│   │   │   ├── theme/              # Theme components
│   │   │   ├── ui/                 # Base UI components
│   │   │   └── user/               # User-specific components
│   │   ├── features/               # Redux state slices
│   │   │   ├── expenses/           # Expenses state management
│   │   │   ├── sideNavbar/         # Sidebar navigation state
│   │   │   ├── theme/              # Theme state management
│   │   │   ├── user/               # User state management
│   │   │   └── windowWidth/        # Window width state
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Library configurations
│   │   ├── pages/                  # Route page components
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── auth/               # Authentication pages
│   │   │   ├── home/               # Landing page
│   │   │   └── user/               # User pages
│   │   ├── routes/                 # React Router configuration
│   │   ├── schemas/                # Zod validation schemas
│   │   ├── services/               # API client services
│   │   ├── styles/                 # Global styles
│   │   ├── types/                  # TypeScript type definitions
│   │   └── utils/                  # Utility functions
│   └── public/                     # Static assets
│
├── server/                          # Backend (Express.js + MongoDB)
│   ├── src/
│   │   ├── controllers/            # Route controllers
│   │   ├── db/                     # Database configuration
│   │   ├── middleware/             # Express middleware
│   │   ├── models/                 # Mongoose models
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic services
│   │   └── utils/                  # Utility functions
│   └── public/                     # Email templates & uploads
│
├── .husky/                          # Git hooks configuration
├── .github/                         # GitHub configuration
├── AGENTS.md                        # AI agent instructions
└── CONTRIBUTING.md                  # Contribution guidelines
```

---

## Technology Stack

### Frontend

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/react_router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/redux_toolkit-%23764ABC.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Hot Toast](https://img.shields.io/badge/react--hot--toast-%23FF0000.svg?style=for-the-badge&logo=react&logoColor=white)
![Sentry](https://img.shields.io/badge/sentry-%23362D59.svg?style=for-the-badge&logo=sentry&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/mongodb-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/jwt-%23FF0000.svg?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/bcrypt-%23003554.svg?style=for-the-badge&logo=bcrypt&logoColor=white)

### Services & Integrations

![Cloudinary](https://img.shields.io/badge/cloudinary-%233776E6.svg?style=for-the-badge&logo=cloudinary&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)
![Google OAuth](https://img.shields.io/badge/google_oauth-%234285F4.svg?style=for-the-badge&logo=google&logoColor=white)

---

## How to Use Locally

**If you don't want to run server code then neglect server commands**

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas)
- Git

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/LokeshwarPrasad3/Budgetter-Webapp.git
   cd Budgetter-Webapp
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

3. Create a `.env` file in the `server` folder with the following content:

   ```
   PORT=5000

   MONGO_URL=mongodb://127.0.0.1:27017/budgetter

   ACCESS_TOKEN_SECRET_KEY=<your-access-token-secret>
   ACCESS_TOKEN_SECRET_EXPIRY=3d

   RESET_PASSWORD_TOKEN_SECRET=<your-reset-password-token-secret>
   RESET_PASSWORD_TOKEN_SECRET_EXPIRY=1d

   ACCOUNT_VERIFICATION_TOKEN_SECRET=<your-verification-token-secret>
   ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY=1d

   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

   ADMIN_GMAIL=<your-admin-gmail>
   GMAIL_PASSKEY=<your-gmail-app-password>

   FRONTEND_URL=http://localhost:5173
   SERVER_URL=http://localhost:5000
   ```

4. Create a `.env` file in the `client` folder (optional):

   ```
   VITE_SENTRY_DSN=<your-sentry-dsn>
   VITE_API_URL=http://localhost:5000
   ```

5. Run the backend server:

   ```bash
   cd server
   npm run dev
   ```

   The server will start on `http://localhost:5000`

6. Run the frontend development server:

   ```bash
   cd client
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

7. Open `http://localhost:5173` in your browser to access the application.

---

## Testing & Quality Gates

### Frontend

To test the application, use the following credentials:

```plaintext
Username: lokeshwardewangan
Password: 12345
```

### Available Scripts

#### Frontend (`client/`)

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Starts the Vite development server               |
| `npm run build`      | Runs TypeScript checks and creates production build |
| `npm run lint`       | Runs ESLint for `.ts` and `.tsx` files           |
| `npm run typecheck`  | Runs TypeScript compiler without emitting files  |
| `npm run format`     | Formats files with Prettier                      |

#### Backend (`server/`)

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Starts the server in development mode     |
| `npm run start` | Runs the server with Node.js              |
| `npm run format`| Formats files with Prettier               |

### Pre-commit Hooks

The project uses Husky git hooks to ensure code quality. Before each commit:
- Frontend build and linting are automatically run
- Both frontend and backend files are formatted
- Any formatting changes are automatically staged

## Contributing

Contributions are welcome! Please follow these guidelines:

### Reporting Issues

Create an issue for any:
- Bug reports
- Feature requests
- Documentation improvements
- Performance issues

### Making Contributions

1. Fork the repository
2. Create a feature or fix branch (see branch naming below)
3. Make your changes
4. Run linting and type checks (`npm run lint` and `npm run typecheck` in `client/`)
5. Format your code (`npm run format` in both `client/` and `server/`)
6. Submit a pull request

### Branch Naming Conventions

- `feature/feature-name` - For new features (e.g., `feature/add-budget-export`)
- `fix/bug-name` - For bug fixes (e.g., `fix/expense-date-validation`)
- `chore/task-name` - For maintenance tasks (e.g., `chore/update-dependencies`)

### Pull Request Guidelines

- Include a short description of changes
- Link related issue when applicable
- Add screenshots for visible frontend updates
- Ensure all quality gates pass (lint, typecheck, build)
- Follow existing code style and conventions

For detailed contribution guidelines, see **CONTRIBUTING.md**.

---

## API Endpoints

### Authentication

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/users/register`       | Register a new user          |
| POST   | `/api/users/login`          | Login with credentials       |
| POST   | `/api/users/google-login`   | Login with Google OAuth      |
| POST   | `/api/users/forgot-password`| Request password reset email |
| POST   | `/api/users/reset-password` | Reset password with token    |
| POST   | `/api/users/verify-account` | Verify account with token    |
| POST   | `/api/users/logout`         | Logout current session       |
| GET    | `/api/users/profile`        | Get user profile             |
| PUT    | `/api/users/profile`        | Update user profile          |
| DELETE | `/api/users/account`        | Delete user account          |

### Expenses

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/expenses`             | Create a new expense         |
| GET    | `/api/expenses`             | Get all user expenses        |
| GET    | `/api/expenses/today`       | Get today's expenses         |
| PUT    | `/api/expenses/:id`         | Update an expense            |
| DELETE | `/api/expenses/:id`         | Delete an expense            |

### Reports

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/api/reports/monthly`         | Get monthly expense report     |
| GET    | `/api/reports/category`        | Get expenses by category       |
| GET    | `/api/reports/date-range`      | Get expenses for date range    |

### Money Management

| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/api/users/add-money`           | Add money to wallet            |
| POST   | `/api/users/add-lent-money`      | Record lent money              |
| PUT    | `/api/users/receive-lent-money`  | Mark lent money as received    |

### Admin (Protected)

| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| GET    | `/api/users/admin/all`           | Get all users (admin only)     |
| POST   | `/api/users/admin/newsletter`    | Send newsletter to users       |

---

## Environment Variables

### Server (server/.env)

| Variable                                   | Description                                | Required |
| ------------------------------------------ | ------------------------------------------ | -------- |
| `PORT`                                     | Server port (default: 5000)                | Yes      |
| `MONGO_URL`                                | MongoDB connection string                  | Yes      |
| `ACCESS_TOKEN_SECRET_KEY`                  | Secret for JWT access tokens               | Yes      |
| `ACCESS_TOKEN_SECRET_EXPIRY`               | Access token expiration (e.g., `3d`)       | Yes      |
| `RESET_PASSWORD_TOKEN_SECRET`              | Secret for password reset tokens           | Yes      |
| `RESET_PASSWORD_TOKEN_SECRET_EXPIRY`       | Reset token expiration (e.g., `1d`)        | Yes      |
| `ACCOUNT_VERIFICATION_TOKEN_SECRET`        | Secret for account verification tokens     | Yes      |
| `ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY` | Verification token expiration              | Yes      |
| `CLOUDINARY_CLOUD_NAME`                    | Cloudinary cloud name                      | Yes      |
| `CLOUDINARY_API_KEY`                       | Cloudinary API key                         | Yes      |
| `CLOUDINARY_API_SECRET`                    | Cloudinary API secret                      | Yes      |
| `ADMIN_GMAIL`                              | Admin email for notifications              | Yes      |
| `GMAIL_PASSKEY`                            | Gmail app password for email service       | Yes      |
| `FRONTEND_URL`                             | Frontend URL (for CORS)                    | Yes      |
| `SERVER_URL`                               | Backend API URL                            | Yes      |

### Client (client/.env)

| Variable              | Description                           | Required |
| --------------------- | ------------------------------------- | -------- |
| `VITE_SENTRY_DSN`     | Sentry DSN for error tracking         | No       |
| `VITE_API_URL`        | Backend API URL                       | No       |

---

## Live Demo

[https://budgetter.lokeshwardewangan.in/](https://budgetter.lokeshwardewangan.in/)

## Maintainer

### Lokeshwar Dewangan

- **Role**: Full Stack Developer
- **Email**: [lokeshwar.prasad.cse@gmail.com](mailto:lokeshwar.prasad.cse@gmail.com)

---

For any questions, feedback, or contributions, feel free to reach out!
