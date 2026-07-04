# Strath-Caf Frontend Developer Documentation

Welcome to the Strath-Caf frontend documentation. This guide provides a comprehensive overview of the architecture, components, API integration, and database mappings to help developers maintain and connect the frontend to the Django REST Framework backend.

## 1. Project Folder Structure

The project is structured following modular React best practices:

```
src/
├── api/          # Isolated API layer utilizing Axios interceptors.
├── assets/       # Static assets (images, icons).
├── components/   # Reusable UI components used throughout the app.
│   └── ui/       # Fundamental design system elements (Button, Card, Input).
├── constants/    # Fixed data constants (e.g., demoAccounts.ts).
├── contexts/     # React Context providers (AuthContext, CartContext).
├── hooks/        # Custom React hooks (React Query integrations).
├── lib/          # Utilities and helper functions (e.g., classname mergers).
├── pages/        # Route-level components.
│   ├── admin/    # Administrator dashboards.
│   ├── customer/ # Student/Staff dashboards.
│   ├── public/   # Landing, Login, Registration.
│   └── staff/    # Cafeteria Staff workflows.
├── services/     # (Legacy/Mock data) Business logic services.
└── types/        # TypeScript interfaces mapped to Django serializers.
```

## 2. Routing Map

All routes are defined in `src/App.tsx`.

### Public Routes
- `/`: Landing Page
- `/login`: Unified Login (Select Role: Student, Staff, Admin)
- `/register`: Registration (Select Role: Student, Staff)

### Customer (Student/Staff) Routes
- `/dashboard`: Main Customer Dashboard
- `/menu`: Browse and search the food menu
- `/cart`: View selected items and total price
- `/checkout`: M-Pesa payment gateway flow
- `/orders`: Order history and tracking
- `/profile`: User settings and profile management

### Cafeteria Staff Routes
- `/staff/dashboard`: Staff Dashboard
- `/staff/queue`: Kitchen Order Ticket (KOT) queue management

### Administrator Routes
- `/admin/dashboard`: Admin overview and analytics
- `/admin/menu`: Menu management (CRUD)
- `/admin/users`: User management

## 3. Component Relationships

- **Layouts**: 
  - The `Navbar` component is shared across Customer routes.
  - The `Sidebar` component is utilized in Staff and Admin routes for deeper navigation.
- **Reusable UI**: 
  - `MealCard` is reused on the Menu, Dashboard, and Cart pages.
  - `OrderCard` is used in both Customer Order History and Staff Order Queue.

## 4. State Management

- **Context API**: 
  - `AuthContext`: Manages JWT tokens, user object mapping, and global authentication state.
  - `CartContext`: Manages local cart state before order submission.
- **React Query**: Used heavily for fetching, caching, and synchronizing data from the API endpoints (Menu, Orders, Notifications).

## 5. API Integration Guide

The frontend communicates with the backend via the `src/api/` layer. All Axios calls utilize JWT interceptors to securely attach `access_token` and handle `refresh_token` logic.

### Authentication (`src/api/authApi.ts`)
- **POST `/api/auth/student/login/`** - Logs in a student.
- **POST `/api/auth/staff/login/`** - Logs in a staff member.
- **POST `/api/auth/admin/login/`** - Logs in an admin.

### Menu (`src/api/menuApi.ts`)
- **GET `/api/menu/`** - Fetches all `MenuItem[]`.
- **POST `/api/menu/`** - (Admin) Creates a new `MenuItem`.

### Orders (`src/api/orderApi.ts`)
- **GET `/api/orders/`** - Fetches user-specific or staff-wide orders based on role.
- **POST `/api/orders/`** - Submits a new `Order`.

### Payments (`src/api/paymentApi.ts`)
- **POST `/api/payment/mpesa/`** - Initiates an STK Push for M-Pesa payment. Expects `{ phone, amount, order_id }`.

### Notifications (`src/api/notificationApi.ts`)
- **GET `/api/notifications/`** - Fetches recent alerts for the authenticated user.

## 6. Database Mapping

The frontend TypeScript interfaces in `src/types/index.ts` are strictly mapped (snake_case) to align with standard Django REST Framework Serializers and PostgreSQL Tables.

**Example Mapping:**
- `React Interface: User` -> `Django Serializer: UserSerializer` -> `PostgreSQL Table: users`
- `React Interface: MenuItem` -> `Django Serializer: MenuItemSerializer` -> `PostgreSQL Table: menu_items`
- `React Interface: Order` -> `Django Serializer: OrderSerializer` -> `PostgreSQL Table: orders`

**Key Mappings to note:**
- `isAvailable` (legacy) -> `is_available` (new)
- `imageUrl` (legacy) -> `image_url` (new)
- `estimatedReadyTime` (legacy) -> `estimated_ready_time` (new)
