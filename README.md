# Strath Cafeteria Ordering System 🍔

A robust, full-stack web application built to streamline meal ordering and fulfillment in a university cafeteria setting. It provides distinct interfaces and workflows for Customers, Cafeteria Servers, and System Administrators.

---

## 🏗️ Project Overview

The system digitizes the traditional cafeteria queue by allowing students/staff to browse the menu, place orders, and pay digitally (via an M-Pesa STK push simulation). Orders are routed in real-time to the kitchen staff, who process them through distinct states (`Pending` -> `Preparing` -> `Ready` -> `Completed`). Administrators have access to powerful dashboards for managing the menu, users, and viewing analytics.

### Key Features
* **Role-Based Workflows**: Customer, Server, and Admin dashboards.
* **Real-time Order State Machine**: Strict backend validation for order progression.
* **M-Pesa Integration**: Simulated mobile money STK push checkout flow.
* **Robust API Integrity**: Decoupled Order and Payment lifecycle management.
* **Comprehensive Analytics**: Admin reports tracking daily revenue and order volume.

---

## 📁 Project Structure

```text
Strath-Caf/
│
├── backend/                  # Django REST Framework backend
│   ├── accounts/             # User authentication & permissions
│   ├── catalog/              # Menu items & categories
│   ├── notifications/        # System alerts
│   ├── orders/               # Order state machine & cart
│   ├── payments/             # M-Pesa & financial tracking
│   ├── strath_caf_backend/   # Core Django settings & routing
│   ├── manage.py             # Django entry point
│   └── seed_db.py            # Automated database seeder
│
├── src/                      # React frontend
│   ├── components/           # Reusable UI components (Tailwind/Lucide)
│   ├── contexts/             # Global state (Auth/Cart)
│   ├── pages/                # Role-specific dashboard views
│   ├── services/             # Axios API client setup
│   └── types/                # Strict TypeScript interfaces
│
├── package.json              # Frontend dependencies
└── README.md                 # Project documentation
```

---

## 🛠️ Technologies & Architecture

**Frontend** (React SPA)
* **Framework**: React 18 with TypeScript + Vite
* **Routing**: React Router DOM
* **State/Data Fetching**: TanStack Query (React Query), Context API
* **Styling**: Tailwind CSS + Framer Motion (Animations) + Lucide (Icons)

**Backend** (REST API)
* **Framework**: Django + Django REST Framework (DRF)
* **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
* **Database**: SQLite (Development) / PostgreSQL ready
* **API Documentation**: OpenAPI / Swagger (`drf-spectacular`)

---

## 🚀 Installation & Setup

This repository is designed for rapid reproducibility. Follow the steps below to boot up the entire stack locally.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Strath-Caf
```

### 2. Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
```

**Create and activate a virtual environment:**
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Install Dependencies:**
```bash
pip install -r requirements.txt
```

**Environment Variables:**
Copy `.env.example` to `.env` and fill in any required keys.

**Run Migrations & Seed Database:**
This step creates the database tables and populates it with ready-to-use dummy data (categories, menu items, and test users).
```bash
python manage.py migrate
python seed_db.py
```

*The `seed_db.py` script automatically creates:*
* **Admin**: `admin@example.com` (Password: `Password123!`)
* **Server**: `server@example.com` (Password: `Password123!`)
* **Customer**: `customer@example.com` (Password: `Password123!`)

**Create a Superuser (Optional):**
If you need direct access to the built-in Django Admin panel (`/admin`):
```bash
python manage.py createsuperuser
```

**Start the Backend Server:**
```bash
python manage.py runserver
```
*The backend now runs on `http://localhost:8000`*

---

### 3. Frontend Setup
Open a **new** terminal and stay in the root folder (`Strath-Caf`).

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**
Copy `.env.example` to `.env` (Ensure `VITE_API_URL` points to `http://localhost:8000/api/v1`).

**Start the Development Server:**
```bash
npm run dev
```
*The frontend now runs on `http://localhost:5173`*

---

## 🧪 Testing

The backend includes a comprehensive End-to-End (E2E) integration test script that validates the full system architecture (Order Creation -> M-Pesa Payment Callback -> Server Fulfillment -> Admin Reports) including negative/failure paths (400, 401, 403, 404 responses).

To run the full E2E test suite:
```bash
cd backend
# Make sure your virtual environment is active
python e2e_flow.py
```

---

## 📖 API Documentation

The backend dynamically generates OpenAPI specifications. While the Django server is running, you can explore and test the API directly from your browser:

* **Swagger UI**: [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)
* **ReDoc**: [http://localhost:8000/api/schema/redoc/](http://localhost:8000/api/schema/redoc/)
* **Raw Schema**: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
