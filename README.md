HRMS Lite

A simple HR management app where an admin can add/delete employees and mark their daily attendance.

Built with Next.js on the frontend and Flask on the backend, using PostgreSQL (Supabase) for the database.
Frontend is deployed on Vercel, backend on Render using Docker.


Live URLs:

Frontend  - https://hr-project-frontend-vert.vercel.app
Backend   - https://hr-project-backend-bmwt.onrender.com

Backend is on Render free tier so it might take 30s to wake up if idle.


How to run locally:

You need Python 3.10+, Node 18+, and a Postgres database.

Backend:

  cd backend
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt

  Create a .env file in backend/ with:

  DATABASE_URL=postgresql://postgres.sppqdirpdrbqaoyhwheq:1%403%235aA%26cC%40zx@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres

  Then run:
  python run.py

  Server starts at http://localhost:5000

Frontend:

  cd frontend
  npm install

  Create a .env.local file in frontend/ with:

  NEXT_PUBLIC_API_URL=http://localhost:5000

  Then run:
  npm run dev

  App starts at http://localhost:3000


API routes:

  GET    /api/health              - health check
  GET    /api/employees           - list all employees
  POST   /api/employees           - add employee
  DELETE /api/employees/<id>      - delete employee
  GET    /api/attendance/<emp_id> - get attendance records
  POST   /api/attendance          - mark attendance
  GET    /api/dashboard           - summary stats


Assumptions:

  No authentication since the assignment said single admin user.
  Departments are a fixed dropdown, not user-created.
  If you mark attendance for the same employee + date again, it updates the existing record.
  No pagination, didn't feel necessary for this scale.
