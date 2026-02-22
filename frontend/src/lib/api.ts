const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  status: "Present" | "Absent";
}

export interface AttendanceResponse {
  employee: Employee;
  present_count: number;
  absent_count: number;
  records: AttendanceRecord[];
}

export interface DashboardData {
  total_employees: number;
  present_today: number;
  absent_today: number;
  departments: { name: string; count: number }[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data as T;
}

export const api = {
  getDashboard: () => request<DashboardData>("/api/dashboard"),

  getEmployees: () => request<Employee[]>("/api/employees"),

  addEmployee: (data: {
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
  }) =>
    request<Employee>("/api/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteEmployee: (id: number) =>
    request<{ message: string }>(`/api/employees/${id}`, {
      method: "DELETE",
    }),

  getAttendance: (empId: number, date?: string) => {
    const params = date ? `?date=${date}` : "";
    return request<AttendanceResponse>(`/api/attendance/${empId}${params}`);
  },

  markAttendance: (data: {
    employee_id: number;
    date: string;
    status: "Present" | "Absent";
  }) =>
    request<AttendanceRecord>("/api/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
