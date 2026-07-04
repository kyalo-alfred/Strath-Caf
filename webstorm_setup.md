# WebStorm Setup Guide for Strath-Caf

This guide explains how to set up, run, and connect the Strath-Caf frontend using JetBrains WebStorm.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js LTS** (v18 or v20 recommended)
- **npm** (comes with Node.js)
- **WebStorm** IDE
- **Git**

## 1. Opening the Project
1. **Clone the repository** from GitHub or extract the project folder.
2. Open **WebStorm**.
3. Go to `File > Open` and select the `Strath-Caf` folder.

## 2. Installing Dependencies
1. Open the terminal inside WebStorm (`Alt + F12` on Windows).
2. Run the following command:
   ```bash
   npm install
   ```
3. Wait for npm to download all packages into the `node_modules` folder.

## 3. Running the Development Server
1. In the WebStorm terminal, run:
   ```bash
   npm run dev
   ```
2. WebStorm will display a local URL (usually `http://localhost:5173/`).
3. Click the link in the terminal or open it in your browser.
4. **Note:** WebStorm will automatically reload the browser when you save files.

## 4. Building for Production
To build the application for deployment:
1. Run:
   ```bash
   npm run build
   ```
2. This creates an optimized production build in the `dist` folder.
3. To preview the production build locally, run:
   ```bash
   npm run preview
   ```

## 5. Connecting the Django Backend
The frontend is architected to seamlessly connect with a Django REST Framework backend.

### Step 1: Environment Variables
Create a file named `.env` in the root directory and copy the contents of `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_APP_NAME=Strathmore Cafeteria
```

### Step 2: Enabling CORS in Django
Ensure your Django backend has `django-cors-headers` installed and configured to accept requests from `http://localhost:5173`.

### Step 3: API Layer
All external requests are routed through `src/api/axios.ts`. This file automatically attaches JWT tokens. Ensure your Django backend returns `access` and `refresh` tokens upon login.

## 6. Troubleshooting Common Issues

- **`npm install` errors / Node version mismatch**: Ensure you are running Node v18+. In WebStorm, go to `Settings > Languages & Frameworks > Node.js` and verify the path.
- **CORS Errors**: This means your frontend is reaching the backend, but Django is rejecting the origin. Add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS` in Django settings.
- **Axios Network Errors**: Check if your Django server is running on `localhost:8000`. Verify `VITE_API_BASE_URL` in your `.env` file.
- **React Router 404 on Refresh**: If deploying to production (Vercel/Netlify/Nginx), you must configure rewrites to serve `index.html` for all paths. In WebStorm development, Vite handles this automatically.
