# InsureCorp - Insurance Policy Management Portal

An enterprise-grade insurance policy management portal built with React 18, TypeScript, and Redux Toolkit. Designed for managing policies, claims, customers, and generating analytics reports.

## Tech Stack

- **React 18** with functional components, Hooks, and Suspense
- **TypeScript 5** with strict mode enabled
- **Redux Toolkit** for state management (slices, async thunks)
- **React Router v6** with lazy loading and protected routes
- **React Hook Form** for form validation
- **Recharts** for data visualization
- **Axios** for HTTP client with interceptors
- **Jest + React Testing Library** for testing
- **CSS Variables** design system with responsive layouts

## Features

### Authentication & Authorization
- JWT-based login with role-based access (Admin, Agent, Customer)
- Protected routes with automatic session restoration
- Demo accounts for quick access

### Dashboard
- Key metric cards (policies, claims, premium, customers)
- Policy distribution donut chart
- Claims status bar chart
- Real-time activity feed

### Policy Management
- Searchable, sortable, filterable policy table with pagination
- Multi-step policy creation wizard with form validation
- Policy detail view with renewal and cancellation workflows
- Support for Auto, Home, Life, and Health policy types

### Claims Management
- Claims table with status filters and search
- File new claims against existing policies
- Claim detail with documents, notes, and status timeline
- Role-based status updates (admin/agent only)

### Customer Management
- Customer directory with avatar list view
- Customer profile with policy portfolio
- Search by name or email

### Reports & Analytics
- Premium collection by insurance type
- Claims ratio analysis
- Loss ratio calculation
- Exportable summary table

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm start
```

### Demo Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@insurecorp.com     | admin123    |
| Agent    | agent@insurecorp.com     | agent123    |
| Customer | customer@example.com     | customer123 |

### Available Scripts

```bash
npm start              # Start dev server on port 3000
npm test               # Run tests
npm run test:coverage  # Run tests with coverage report
npm run build          # Production build
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix lint issues
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking
```

## Project Structure

```
src/
├── assets/styles/       # Global CSS, variables, design tokens
├── components/
│   ├── ui/              # Reusable UI library (Button, Input, Table, Modal...)
│   ├── layout/          # App shell (Sidebar, Header, AppLayout)
│   └── feedback/        # Error boundaries, loading spinners
├── features/
│   ├── auth/            # Login, protected routes
│   ├── dashboard/       # Metrics, charts, activity feed
│   ├── policies/        # Policy CRUD, detail, wizard
│   ├── claims/          # Claims CRUD, status management
│   ├── customers/       # Customer directory and profiles
│   └── reports/         # Analytics and reporting
├── hooks/               # Custom hooks (useDebounce, useLocalStorage...)
├── mocks/               # Mock data for development
├── services/            # API service layer
├── store/               # Redux store, slices, typed hooks
├── types/               # TypeScript type definitions
└── utils/               # Formatters, validators, constants
```

## Architecture Decisions

- **Feature-based structure**: Each feature is self-contained with its own components, styles, and logic
- **Mock services**: API calls use simulated delays for realistic development without a backend
- **CSS Variables design system**: Consistent theming without CSS-in-JS runtime overhead
- **Code splitting**: All feature pages lazy-loaded via React.lazy + Suspense
- **Role-based access**: Three user roles with different permissions and views
- **Typed Redux**: Full TypeScript coverage with typed hooks and action payloads

## CI/CD

GitHub Actions pipeline runs on push to `main`/`develop`:
- TypeScript type checking
- ESLint linting
- Prettier format check
- Jest test suite with coverage
- Production build verification
- Security audit

## Browser Support

- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (last 1 version)
