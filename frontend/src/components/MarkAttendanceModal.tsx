"use client";

import { useState, useEffect } from "react";
import { api, Employee } from "@/lib/api";

interface MarkAttendanceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function MarkAttendanceModal({ onClose, onSuccess }: MarkAttendanceModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "" as "Present" | "Absent" | "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getEmployees().then(setEmployees).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.employee_id || !form.status) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.markAttendance({
        employee_id: Number(form.employee_id),
        date: form.date,
        status: form.status as "Present" | "Absent",
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Mark Attendance</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
            <select
              required
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, status: "Present" })}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.status === "Present"
                    ? "bg-green-600 text-white border-green-600"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, status: "Absent" })}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.status === "Absent"
                    ? "bg-red-600 text-white border-red-600"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Absent
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
