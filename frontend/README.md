# TaskFlow 🚀
### Team Task Manager — Built with FastAPI & React


## 📌 Overview

**TaskFlow** is a full-stack team task management application that allows teams to organize projects, assign tasks, and track progress in real time. It features role-based access control with **Admin** and **Member** roles, a beautiful Dark Glassmorphism UI, and a secure JWT-based authentication system.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & registration with token-based sessions
- 👥 **Role-Based Access** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create, update, and delete projects
- ✅ **Task Management** — Assign tasks to team members with status tracking
- 🗄️ **Dual Database Support** — SQLite for development, PostgreSQL for production
- 🌐 **CORS Configured** — Ready for cross-origin frontend/backend separation
- 🎨 **Dark Glassmorphism UI** — Modern, responsive React frontend built with Vite

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.111.0 | REST API framework |
| SQLAlchemy | 2.0.30 | ORM & database management |
| python-jose | 3.3.0 | JWT token handling |
| passlib + bcrypt | 1.7.4 + 4.0.1 | Password hashing |
| uvicorn | 0.29.0 | ASGI server |
| python-dotenv | 1.0.1 | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Axios | HTTP client |
| Dark Glassmorphism CSS | Custom UI design system |

---

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # DB connection (SQLite/PostgreSQL)
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT auth utilities
│   ├── routes/
│   │   ├── auth.py          # /api/auth endpoints
│   │   ├── projects.py      # /api/projects endpoints
│   │   └── tasks.py         # /api/tasks endpoints
│   ├── requirements.txt     # Pinned Python dependencies
│   ├── Procfile             # Railway start command
│   └── railway.toml         # Railway deployment config
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios client with auth token
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── components/      # Reusable UI components
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── .env.production      # Production env vars
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Python 3.12+
- Node.js 18+
- pip

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
DATABASE_URL=sqlite:///./taskflow.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=development
ALLOWED_ORIGIN=http://localhost:5173
```

Start the backend:
```bash
python -m uvicorn main:app --reload
```
Backend runs at → **http://localhost:8000**
API docs available at → **http://localhost:8000/docs**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at → **http://localhost:5173**

---

## 🌍 Deployment

### Backend → Railway
1. Go to [railway.app](https://railway.app) → New Project
2. Provision a **PostgreSQL** database
3. Add your GitHub repo as a new service
4. Set **Root Directory** to `backend`
5. Add these environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | PostgreSQL URL from Railway |
| `SECRET_KEY` | Run `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
| `ENVIRONMENT` | `production` |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL |

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Railway backend URL |

---

## 🔐 Environment Variables

### Backend `.env`
```env
DATABASE_URL=sqlite:///./taskflow.db      # Use PostgreSQL URL in production
SECRET_KEY=your-super-secret-key          # Generate with secrets.token_hex(32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=development                   # Set to "production" on Railway
ALLOWED_ORIGIN=http://localhost:5173      # Set to Vercel URL in production
```

### Frontend `.env.production`
```env
VITE_API_URL=https://your-backend.up.railway.app
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/{id}` | Update project |
| DELETE | `/api/projects/{id}` | Delete project |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |

---

## 👤 User Roles

| Role | Permissions |
|---|---|
| **Admin** ⚡ | Create/delete projects, assign tasks, manage members |
| **Member** 👤 | View projects, update assigned tasks |

---

## 🧪 Testing the API

Once running, visit **http://localhost:8000/docs** for the interactive Swagger UI where you can test all endpoints directly.

---

## ⚠️ Known Gotchas

- Always run backend from inside the `backend/` directory
- Use `bcrypt==4.0.1` with `passlib==1.7.4` — newer bcrypt versions break passlib
- Set `ALLOWED_ORIGIN` in Railway **after** getting your Vercel URL to avoid CORS errors

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋 Author

Built with ❤️ by **Faisal**

> If you found this useful, give it a ⭐ on GitHub!