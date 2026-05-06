<div align="center">
  <br />
  <h1>🚀 TaskFlow</h1>
  <p><strong>A Modern, High-Performance Team Task Management Platform</strong></p>
  <br />
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <br />
  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="#-api-reference">API Reference</a>
  </p>
</div>

---

## 📌 Overview

**TaskFlow** is an enterprise-grade, full-stack team task management application designed to streamline workflows and enhance team productivity. It provides a robust platform for teams to organize projects, assign tasks, and track progress in real-time. 

Built with scalability in mind, TaskFlow combines a blazing-fast **FastAPI backend** with a stunning, modern **Dark Glassmorphism React frontend**, creating an immersive and efficient user experience.

<div align="center">
  <!-- Place your screenshot here -->
  <img src="https://via.placeholder.com/1000x500.png?text=TaskFlow+Dashboard+Screenshot" alt="TaskFlow Dashboard" width="100%">
  <br/>
  <em>A sleek, responsive dark glassmorphism user interface.</em>
</div>

---

## ✨ Features

- **🔐 Secure Authentication:** End-to-end secure login and registration utilizing industry-standard JSON Web Tokens (JWT) and Bcrypt password hashing.
- **👥 Role-Based Access Control (RBAC):** Granular permissions ensuring users only access what they need. Distinct `Admin` and `Member` privileges.
- **📁 Advanced Project Management:** Intuitive workspaces. Create, update, manage, and delete projects seamlessly alongside your team.
- **✅ Real-Time Task Tracking:** Assign tasks with priority levels, update statuses, and monitor team velocity from a centralized dashboard.
- **🎨 Premium UI/UX:** A bespoke Dark Glassmorphism design system built with Tailwind CSS v4, delivering a modern, fluid, and responsive experience across all devices.
- **🚀 Unified Architecture (Mono-Deploy):** Streamlined deployment pipeline where the FastAPI backend serves a compiled React Single Page Application (SPA), drastically reducing operational overhead.

---

## 🛠️ Tech Stack

Our stack is carefully selected to ensure maximum performance, developer ergonomics, and production readiness.

### Backend Infrastructure
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | `FastAPI` | High-performance asynchronous REST API framework |
| **ORM & Database** | `SQLAlchemy` & `PostgreSQL` | Robust data modeling and production-ready storage |
| **Security** | `python-jose`, `passlib` | Industry-standard JWT creation and password hashing |
| **Validation** | `Pydantic` | Strict data validation and serialization schemas |
| **Server** | `Uvicorn` | Lightning-fast ASGI web server |

### Frontend Ecosystem
| Component | Technology | Description |
| :--- | :--- | :--- |
| **UI Framework** | `React 19` | Modern, declarative component-based UI |
| **Build Tooling** | `Vite` | Next-generation frontend tooling and dev server |
| **Styling** | `Tailwind CSS v4` | Utility-first framework tailored for our Glassmorphism design |
| **State & Routing** | `React Router v7` | Client-side routing and layout management |
| **Network Client** | `Axios` | Promise-based HTTP client with robust JWT interceptors |

---

## 🚀 Getting Started

Follow these instructions to set up a local development environment.

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Backend Setup
Initializes the virtual environment, installs dependencies, and starts the API server.

```bash
cd backend
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install requirements
pip install -r requirements.txt
```

Create a `backend/.env` file with the following configuration:
```env
DATABASE_URL=sqlite:///./taskflow.db
SECRET_KEY=generate_a_secure_random_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=development
```

Start the backend development server:
```bash
python -m uvicorn main:app --reload
```
> **Note:** The backend API will be available at `http://localhost:8000`. Interactive API documentation is auto-generated at `http://localhost:8000/docs`.

### 3. Frontend Setup
Installs NPM packages and starts the Vite development server.

```bash
cd frontend
npm install
```

Create a `frontend/.env` file (Optional — defaults to localhost:8000 in dev):
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend development server:
```bash
npm run dev
```
> **Note:** The frontend application will be available at `http://localhost:5173`.

---

## ☁️ Deployment

TaskFlow utilizes a **Mono-Deploy Architecture** optimized for Railway. This approach compiles the React SPA into static assets which are directly served by the FastAPI application, enabling a powerful single-service deployment.

1. **Connect to Railway:** Link your GitHub repository to a new Railway project.
2. **Auto-Build:** Railway automatically detects the root `Dockerfile` and builds the optimized multi-stage image.
3. **Database Provisioning:** Add a PostgreSQL database to your Railway project.
4. **Environment Variables:** Configure the necessary production secrets in Railway:

| Variable | Requirement | Description |
| :--- | :---: | :--- |
| `DATABASE_URL` | Required | PostgreSQL connection string (auto-provisioned by Railway) |
| `SECRET_KEY` | Required | Cryptographically secure random string for JWT |
| `ALGORITHM` | Required | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Required | Session duration (e.g., `1440` for 24h) |
| `ENVIRONMENT` | Required | Set to `production` |

---

## 🔑 API Reference

TaskFlow provides a comprehensive, RESTful API. Below is a high-level summary. For complete interactive documentation, visit `/docs` on your running backend server.

### Authentication
- `POST /api/auth/register` — Create a new user account.
- `POST /api/auth/login` — Authenticate and retrieve JWT payload.
- `GET /api/auth/me` — Retrieve the current authenticated user's profile.

### Projects & Workspaces
- `GET /api/projects` — List all projects accessible to the user.
- `POST /api/projects` — Create a new workspace (Admin).
- `GET /api/projects/:id` — Retrieve detailed project context and active members.
- `DELETE /api/projects/:id` — Archive/delete a workspace (Admin).

### Task Operations
- `GET /api/tasks?project_id={id}` — Fetch all tasks within a specific project context.
- `POST /api/tasks` — Instantiate a new task (Admin).
- `PUT /api/tasks/:id` — Update task status or details.
- `DELETE /api/tasks/:id` — Remove a task (Admin).
- `GET /api/tasks/dashboard` — Retrieve aggregate statistics for the user dashboard.

---

## 👥 Access Control Matrix

Security is deeply integrated via a Role-Based Access Control (RBAC) implementation.

| Operation | Administrator | Standard Member |
| :--- | :---: | :---: |
| Create new projects | ✅ | ❌ |
| Manage project members | ✅ | ❌ |
| Create & assign tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| Modify task descriptions | ✅ | ❌ |
| Delete tasks/projects | ✅ | ❌ |

---

## 🤝 Contributing

We welcome contributions to make TaskFlow even better! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  Built with ❤️ by the TaskFlow Team.
</div>
