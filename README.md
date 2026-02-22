# HRMS Lite

A lightweight Human Resource Management System built as a full-stack web application. It lets an admin manage employee records and track daily attendance through a clean, professional interface.

## Live Demo

- **Frontend:** https://hr-project-frontend-vert.vercel.app
- **Backend API:** https://hr-project-backend-bmwt.onrender.com

> Note: The backend is hosted on Render's free tier, so it may take ~30 seconds to wake up on the first request if it's been idle.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React), TypeScript, Tailwind CSS |
| Backend | Python, Flask, Flask-SQLAlchemy |
| Database | PostgreSQL (hosted on Supabase) |
| Deployment | Vercel (frontend), Render with Docker (backend) |

## Features

**Employee Management**
- Add new employees with ID, name, email, and department
- View all employees in a table
- Delete employees (with confirmation)

**Attendance Tracking**
- Mark attendance as Present or Absent for any date
- View attendance history per employee
- Filter records by date
- See total present/absent day counts

**Dashboard**
- Overview of total employees
- Today's attendance summary
- Department-wise employee breakdown

## Running Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- A PostgreSQL database (or a free Supabase project)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_db
```

Then run:

```bash
python run.py
```

The API will be available at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Add a new employee |
| DELETE | `/api/employees/:id` | Delete an employee |
| GET | `/api/attendance/:emp_id` | Get attendance for an employee |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/dashboard` | Dashboard summary |

## Project Structure

```
hr-project/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory, DB init
│   │   ├── config.py            # Database config
│   │   ├── models.py            # Employee & Attendance models
│   │   └── routes/
│   │       ├── employees.py     # Employee CRUD
│   │       ├── attendance.py    # Attendance endpoints
│   │       └── dashboard.py     # Dashboard stats
│   ├── run.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   ├── components/          # Reusable UI components
│   │   └── lib/api.ts           # API client
│   └── package.json
└── README.md
```

## Assumptions and Limitations

- Single admin user — no login or authentication is implemented since it wasn't in scope
- Departments are predefined in a dropdown (Engineering, Marketing, Sales, HR, Finance, Operations) rather than being dynamic
- Attendance for the same employee + date combination gets updated (upserted) instead of throwing an error
- The backend runs on Render's free tier which spins down after inactivity, so the first request after idle may be slow
- No pagination on employee list or attendance records — works fine for the expected scale but would need it for larger datasets
