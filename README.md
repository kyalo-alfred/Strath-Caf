# Strath Cafeteria Ordering System

A full-stack web application designed for a university cafeteria. Built with Django REST Framework (Backend) and React + TypeScript + Vite + Tailwind CSS (Frontend).

## Quick Start & Reproducibility

This repository is designed to be cloned and booted up in minutes. 

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up your environment variables:
```bash
cp .env.example .env
```

Run migrations and seed the database with sample data (users, categories, menu items):
```bash
python manage.py migrate
python seed_db.py
```

*The `seed_db.py` script automatically creates:*
* **Admin**: `admin@example.com` (Password: `Password123!`)
* **Server**: `server@example.com` (Password: `Password123!`)
* **Customer**: `customer@example.com` (Password: `Password123!`)
* *5 ready-to-test menu items across 5 categories.*

Start the backend server:
```bash
python manage.py runserver
```

### 2. Frontend Setup

Open a new terminal and navigate to the project root:

Install dependencies:
```bash
npm install
```

Set up your environment variables:
```bash
cp .env.example .env
```

Start the Vite development server:
```bash
npm run dev
```

## Architecture Notes
* **State Management**: React Query (TanStack)
* **Styling**: Tailwind CSS + Shadcn UI patterns
* **Authentication**: JWT (JSON Web Tokens) via Django SimpleJWT
* **Database**: SQLite (Development) / PostgreSQL ready
