# TaskFlow 🚀

### Team Task Manager — Built with FastAPI & React

---

## 📌 Overview

**TaskFlow** is a full-stack team task management application that allows teams to organize projects, assign tasks, and track progress in real time. It features role-based access control with **Admin** and **Member** roles, a stunning Dark Glassmorphism UI, and a secure JWT-based authentication system.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & registration with token-based sessions
- 👥 **Role-Based Access** — Admin and Member roles with different permissions
- 📁 **Project Management** — Create, update, and delete projects with team members
- ✅ **Task Management** — Assign tasks to team members with priority and status tracking
- 🗄️ **Dual Database Support** — SQLite for development, PostgreSQL for production
- 🌐 **CORS Configured** — Ready for cross-origin frontend/backend separation
- 🎨 **Dark Glassmorphism UI** — Modern, responsive React frontend with Vite

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **SQLAlchemy** | ORM for database operations |
| **PostgreSQL / SQLite** | Production / Development database |
| **python-jose** | JWT token creation & verification |
| **passlib + bcrypt** | Password hashing |
| **Pydantic** | Data validation & schemas |
| **Uvicorn** | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client with JWT interceptors |

---

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── routes/
│   │   ├── auth.py            # Login & Registration endpoints
│   │   ├── projects.py        # Project CRUD endpoints
│   │   └── tasks.py           # Task CRUD + Dashboard endpoint
│   ├── auth.py                # JWT & password utilities
│   ├── database.py            # SQLAlchemy engine setup
│   ├── dependencies.py        # Auth middleware (get_current_user)
│   ├── main.py                # FastAPI app entry point
│   ├── models.py              # User, Project, Task, ProjectMember models
│   ├── schemas.py             # Pydantic validation schemas
│   ├── requirements.txt       # Pinned Python dependencies
│   ├── Procfile               # Railway start command
│   └── railway.toml           # Railway build & deploy config
│
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client & API call modules
│   │   ├── components/        # Reusable UI (Sidebar, Badge, GlassCard, etc.)
│   │   ├── context/           # AuthContext (login/logout state)
│   │   ├── pages/             # Dashboard, Projects, Tasks, Login, Register
│   │   ├── App.jsx            # Root component with routing
│   │   └── index.css          # Tailwind + Glassmorphism theme
│   ├── .env.example           # Environment variable template
│   ├── .env.production        # Production API URL config
│   └── package.json           # Frontend dependencies
│
├── DEPLOY.md                  # Full deployment guide
├── .gitignore                 # Protects secrets & build artifacts
└── README.md                  # ← You are here
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=sqlite:///./taskflow.db
SECRET_KEY=your-dev-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=development
```

Start the backend:
```bash
python -m uvicorn main:app --reload
```
API available at **http://localhost:8000** | Docs at **http://localhost:8000/docs**

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env` (optional — defaults to localhost:8000):
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```
App available at **http://localhost:5173**

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create a project (admin only) |
| GET | `/api/projects/:id` | Get project details + members |
| DELETE | `/api/projects/:id` | Delete a project (creator only) |
| POST | `/api/projects/:id/members` | Add member to project |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks?project_id=1` | List tasks for a project |
| POST | `/api/tasks` | Create a task (admin only) |
| PUT | `/api/tasks/:id` | Update task (members: status only) |
| DELETE | `/api/tasks/:id` | Delete a task (admin only) |
| GET | `/api/tasks/dashboard` | Get task stats for current user |

---

## 🌍 Deployment

See the full deployment guide in [DEPLOY.md](./DEPLOY.md) for step-by-step instructions to deploy on:
- **Railway** — Backend + PostgreSQL database
- **Vercel** — Frontend (React + Vite)

### Environment Variables Summary

**Backend (Railway):**
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key (use `python -c "import secrets; print(secrets.token_hex(32))"`) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
| `ENVIRONMENT` | `production` |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL |

**Frontend (Vercel):**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Your Railway backend URL |

---

## 👥 Roles & Permissions

| Action | Admin | Member |
|---|---|---|
| Create projects | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| Update task details | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## 📄 License

This project is for educational and portfolio purposes.
