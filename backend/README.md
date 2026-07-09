# Strath-Caf Backend

This is the Django REST Framework backend for the Strath-Caf project.

## Setup Instructions

1. **Install PostgreSQL** and create a database named `strath_caf`.
2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Linux use `source venv/bin/activate`
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables**:
   Copy `.env.example` to `.env` and update the values with your local configuration.
5. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```
6. **Start the server**:
   ```bash
   python manage.py runserver
   ```

## Documentation

API documentation is available automatically via Swagger UI. Start the server and navigate to:
- Swagger: `http://localhost:8000/api/schema/swagger-ui/`
- Redoc: `http://localhost:8000/api/schema/redoc/`
