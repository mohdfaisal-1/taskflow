# 🚀 TaskFlow — Production Deployment Guide

A complete step-by-step guide to deploy the TaskFlow Team Task Manager using **Railway** (backend + database) and **Vercel** (frontend).

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Generate a Secure SECRET_KEY](#-step-1-generate-a-secure-secret_key)
3. [Deploy PostgreSQL on Railway](#-step-2-deploy-postgresql-on-railway)
4. [Deploy FastAPI Backend on Railway](#-step-3-deploy-fastapi-backend-on-railway)
5. [Deploy React Frontend on Vercel](#-step-4-deploy-react-frontend-on-vercel)
6. [Connect Frontend ↔ Backend (CORS)](#-step-5-connect-frontend--backend-cors)
7. [Environment Variables Reference](#-environment-variables-reference)
8. [Verify Deployment](#-step-6-verify-deployment)
9. [Troubleshooting](#-troubleshooting)

---

## 🛠 Prerequisites

Before you begin, make sure you have:

- [ ] A **GitHub** repository with your TaskFlow project pushed
- [ ] A [Railway](https://railway.app/) account (free tier available)
- [ ] A [Vercel](https://vercel.com/) account (free tier available)
- [ ] Python installed locally (for generating the secret key)

Your project structure should look like:

```
taskflow/
├── backend/          ← FastAPI + SQLAlchemy
│   ├── main.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── railway.toml
│   └── ...
├── frontend/         ← React + Vite
│   ├── package.json
│   ├── .env.production
│   └── ...
└── DEPLOY.md
```

---

## 🔑 Step 1: Generate a Secure SECRET_KEY

Run this command in your terminal to generate a cryptographically secure key:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Example output:**

```
06e20e28ef5992e85a308dd4a40d50d98ed9e48661440d10020e871663a304f7
```

⚠️ **Save this key securely. You will need it in Step 3.**

---

## 🐘 Step 2: Deploy PostgreSQL on Railway

1. Log in to [Railway](https://railway.app/) and click **"New Project"**
2. Select **"Provision PostgreSQL"**
3. Once the database is created, click on the PostgreSQL service
4. Go to the **"Variables"** tab
5. Copy the value of **`DATABASE_URL`** — it will look like:

```
postgresql://postgres:AbCdEf123456@roundhouse.proxy.rlwy.net:12345/railway
```

⚠️ **Save this URL. You will need it in Step 3.**

---

## 🐍 Step 3: Deploy FastAPI Backend on Railway

### 3a. Add Backend Service

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select your TaskFlow repository
3. Railway will auto-detect the project. Set the **Root Directory** to:

```
backend
```

### 3b. Configure Environment Variables

Go to the backend service's **"Variables"** tab and add ALL of the following:

| Variable | Example Value | Required |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:AbCdEf123456@roundhouse.proxy.rlwy.net:12345/railway` | ✅ Yes |
| `SECRET_KEY` | `06e20e28ef5992e85a308dd4a40d50d98ed9e48661440d10020e871663a304f7` | ✅ Yes |
| `ALGORITHM` | `HS256` | ✅ Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | ✅ Yes |
| `ENVIRONMENT` | `production` | ✅ Yes |
| `ALLOWED_ORIGIN` | `https://taskflow.vercel.app` | ⏳ Set after Step 4 |

### 3c. How Railway Starts Your App

Railway reads your `railway.toml` and `Procfile` automatically:

**`railway.toml`** configures the build and deploy:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3
```

**`Procfile`** provides a fallback start command:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3d. Deploy

1. Click **"Deploy"** — Railway will install dependencies from `requirements.txt` and start the server
2. Once deployed, go to **"Settings"** → **"Networking"** → **"Generate Domain"**
3. Copy your backend URL, e.g.:

```
https://taskflow-backend-production.up.railway.app
```

### 3e. Verify Backend

Visit your backend URL in a browser. You should see:

```json
{
  "message": "TaskFlow API is running!",
  "version": "1.0.0",
  "docs": "/docs"
}
```

You can also visit `https://your-backend-url/docs` to see the interactive Swagger API docs.

---

## ⚛️ Step 4: Deploy React Frontend on Vercel

### 4a. Import Project

1. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**
2. Import your GitHub repository
3. Configure the project:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |

### 4b. Configure Environment Variables

In the Vercel project settings, add:

| Variable | Example Value | Required |
|---|---|---|
| `VITE_API_URL` | `https://taskflow-backend-production.up.railway.app` | ✅ Yes |

⚠️ **Use your actual Railway backend URL from Step 3d.**

### 4c. Deploy

1. Click **"Deploy"**
2. Vercel will build your React app with the production API URL baked in
3. Copy your frontend URL, e.g.:

```
https://taskflow.vercel.app
```

---

## 🔗 Step 5: Connect Frontend ↔ Backend (CORS)

Now that both services are live, you must link them:

1. Go back to your **Railway backend service**
2. Open the **"Variables"** tab
3. Update `ALLOWED_ORIGIN` to your Vercel frontend URL:

```
ALLOWED_ORIGIN=https://taskflow.vercel.app
```

4. Railway will auto-redeploy with the new CORS setting

This ensures your backend only accepts requests from your production frontend.

---

## 📊 Environment Variables Reference

### Backend (Railway)

| Variable | Description | Example Value |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string from Railway | `postgresql://postgres:pass@host:port/railway` |
| `SECRET_KEY` | JWT signing key (generate with `secrets.token_hex(32)`) | `06e20e28ef5992e85a308dd...` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes | `1440` |
| `ENVIRONMENT` | Enables production safety checks | `production` |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | `https://taskflow.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://taskflow-backend-production.up.railway.app` |

---

## ✅ Step 6: Verify Deployment

### Backend Health Check
```bash
curl https://your-backend-url.up.railway.app/
```
Expected: `{"message": "TaskFlow API is running!", ...}`

### API Docs
Visit: `https://your-backend-url.up.railway.app/docs`

### Frontend
Visit your Vercel URL and verify:
- [ ] Login page loads with glassmorphism styling
- [ ] Registration creates a new user
- [ ] Login returns a token and redirects to Dashboard
- [ ] Projects and Tasks pages load data from the API

---

## 🔧 Troubleshooting

### Backend won't start on Railway
- Check **"Deploy Logs"** in Railway for error messages
- Ensure `requirements.txt` has all dependencies with pinned versions
- Verify `DATABASE_URL` is correctly set (Railway provides it automatically if you link the PostgreSQL service)

### CORS errors in browser console
- Verify `ALLOWED_ORIGIN` in Railway matches your exact Vercel URL (no trailing slash)
- Example: `https://taskflow.vercel.app` ✅ not `https://taskflow.vercel.app/` ❌

### "SECRET_KEY must be properly configured" error
- Ensure `SECRET_KEY` is set in Railway variables
- Ensure `ENVIRONMENT` is set to `production`
- The app rejects the placeholder key `taskflow-super-secret-key-change-this` in production

### Frontend shows "Network Error" or blank data
- Verify `VITE_API_URL` is set correctly in Vercel environment variables
- Remember: Vite env vars are baked in at **build time** — after changing `VITE_API_URL`, you must **redeploy** the frontend

### bcrypt / passlib errors
- Ensure `bcrypt==4.0.1` and `passlib[bcrypt]==1.7.4` are pinned together in `requirements.txt`
- bcrypt 4.1+ breaks passlib's bcrypt backend

---

**🎉 Congratulations! Your TaskFlow app is now live in production.**
