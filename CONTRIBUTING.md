# Contributing to Budgetter - Your Daily Expenses Tracker

Thank you for your interest in contributing to **Budgetter**! Your support helps improve our app, allowing individuals and students to manage their daily expenses more effectively.

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Coding Standards](#2-coding-standards)
3. [Branch Naming Conventions](#3-branch-naming-conventions)
4. [Submitting a Pull Request](#4-submitting-a-pull-request)
5. [Commit Messages](#5-commit-messages)
6. [Development Workflow](#6-development-workflow)

---

## 1. Getting Started

1. **Fork the Repository**: First, fork this repository to your GitHub account.
2. **Clone Your Fork**: Clone the forked repository to your local machine.
   ```bash
   git clone https://github.com/your-username/Budgetter-Webapp.git
   cd Budgetter-Webapp
   ```
3. **Install Dependencies**: Install the required packages for both frontend and backend.
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```
4. **Set Up Environment Variables**: Create `.env` files for both server and client. See [README.md](README.md) for required environment variables.
5. **Run the App**: Start the development servers for both frontend and backend.
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```
6. **Verify Setup**: Open `http://localhost:5173` in your browser to ensure the app is running.

---

## 2. Coding Standards

### General Guidelines

- **Code Style**: Use Prettier for formatting. The project enforces formatting via pre-commit hooks.
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "tabWidth": 2
  }
  ```

- **Run Formatting**: Before committing, run the formatter to ensure consistent style.
  ```bash
  # Frontend
  cd client && npm run format

  # Backend
  cd server && npm run format
  ```

### TypeScript (Frontend)

- **Strict Typing**: Use TypeScript for strict type-safety. Avoid `any` unless absolutely necessary.
- **Type Definitions**: Place shared types in `client/src/types/`.
- **Component Structure**: Use React function components with explicit return types.

### JavaScript (Backend)

- **Module Pattern**: Use CommonJS (`require`/`module.exports`) consistently.
- **Error Handling**: Use async/await with try-catch blocks. Centralize error responses.

### Naming Conventions

- **Components**: PascalCase (e.g., `Dashboard.tsx`, `UserProfile.tsx`)
- **Variables and Functions**: camelCase (e.g., `fetchExpenses()`, `totalAmount`)
- **Custom Hooks**: Prefix with `use` (e.g., `useAuth()`, `useWindowSize()`)
- **Redux Slices**: End with `Slice` (e.g., `expensesSlice.ts`)
- **Backend Files**: Use domain-based naming (e.g., `user.routes.js`, `user.controllers.js`, `user.model.js`)

### File Organization

- **Frontend Components**: Keep components focused. Extract reusable UI to `client/src/components/`.
- **Frontend Pages**: Route pages live in `client/src/pages/`.
- **Backend Modules**: Group by domain (routes, controllers, models, middleware).

---

## 3. Branch Naming Conventions

Please use the following branch naming convention:

- **feature/feature-name**: For new features (e.g., `feature/add-auth`)
- **fix/bug-description**: For bug fixes (e.g., `fix/button-not-clickable`)
- **chore/description**: For maintenance tasks (e.g., `chore/update-dependencies`)

### Example Branch Naming

```
feature/add-login
fix/navbar-styling
chore/refactor-code
feat/add-expense-export
fix/expense-date-validation
```

---

## 4. Submitting a Pull Request

1. **Sync with Main Branch**: Before creating a PR, make sure your branch is up-to-date with the main branch.
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch-name
   git merge main
   ```

2. **Run Quality Checks**: Ensure your code passes all quality gates.
   ```bash
   # Frontend checks
   cd client && npm run lint
   cd client && npm run typecheck
   cd client && npm run build

   # Backend checks (formatting)
   cd server && npm run format
   ```

3. **Open a Pull Request**: Go to the original repository and create a pull request from your forked branch. Please include:
   - **Descriptive Title**: Summarize the changes using Conventional Commit format (e.g., `feat: add expense export`)
   - **Detailed Description**: Explain what the PR does and any relevant context
   - **Linked Issue**: Reference the related issue using `Closes #123` or `Fixes #123`
   - **Screenshots**: For visible frontend updates, include before/after screenshots

4. **PR Reviews**: All PRs must be reviewed and approved by at least one maintainer before merging. Address any feedback promptly.

---

## 5. Commit Messages

We follow Conventional Commit format. Write clear and concise commit messages using the following format:

```
<type>(<scope>): <description>

[optional body]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style updates (formatting, semicolons, etc.)
- **refactor**: Code restructuring without functionality change
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies, build config

### Example Commit Messages

```
feat: add expense export to CSV
fix: resolve navbar alignment issue on mobile
docs: update README with setup instructions
style: format code with Prettier
refactor: extract expense calculation logic to utility
test: add unit tests for expense validation
chore: update React to v18
```

### Commit Best Practices

- Keep commits atomic and focused on a single change
- Use imperative mood in descriptions ("add" not "added")
- Reference issue numbers when applicable (e.g., `fix: handle null expense amount (#45)`)

---

## 6. Development Workflow

### Pre-commit Hooks

This project uses Husky to run checks before each commit:
- Frontend TypeScript compilation
- Frontend ESLint checks
- Frontend and backend Prettier formatting
- Automatic staging of formatted files

You don't need to manually run format commands before committing - the hook handles it.

### Testing Your Changes

Before submitting a PR:
1. Test the feature or fix in the browser
2. Verify no TypeScript errors (`npm run typecheck`)
3. Verify no lint errors (`npm run lint`)
4. Ensure the build succeeds (`npm run build`)
5. Test on both desktop and mobile viewports

### Admin Access

If your changes affect admin functionality, ensure you test with admin credentials. Contact maintainers for admin access if needed.

---

**By following these guidelines, you help us maintain a high-quality, consistent codebase. Thank you for your contributions!**
