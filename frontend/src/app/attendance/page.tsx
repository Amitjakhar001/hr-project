"use client";

import { useEffect, useState } from "react";
import { api, Employee, AttendanceResponse } from "@/lib/api";
import MarkAttendanceModal from "@/components/MarkAttendanceModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceResponse | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [attLoading, setAttLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api
      .getEmployees()
      .then((data) => {
        setEmployees(data);
        if (data.length > 0) {
          setSelectedEmp(data[0].id);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedEmp === null) return;
    setAttLoading(true);
    api
      .getAttendance(selectedEmp, dateFilter || undefined)
      .then(setAttendance)
      .catch((err) => setError(err.message))
      .finally(() => setAttLoading(false));
  }, [selectedEmp, dateFilter]);

  const refresh = () => {
    if (selectedEmp !== null) {
      setAttLoading(true);
      api
        .getAttendance(selectedEmp, dateFilter || undefined)
        .then(setAttendance)
        .catch((err) => setError(err.message))
        .finally(() => setAttLoading(false));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && employees.length === 0) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Track daily attendance records</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={employees.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Mark Attendance
        </button>
      </div>

      {employees.length === 0 ? (
        <EmptyState title="No employees found" description="Add employees first to mark attendance." />
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <select
              value={selectedEmp ?? ""}
              onChange={(e) => setSelectedEmp(Number(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
              >
                Clear filter
              </button>
            )}
          </div>

          {attendance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-700 font-medium">Total Present Days</p>
                <p className="text-2xl font-bold text-green-800 mt-1">{attendance.present_count}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 font-medium">Total Absent Days</p>
                <p className="text-2xl font-bold text-red-800 mt-1">{attendance.absent_count}</p>
              </div>
            </div>
          )}

          {attLoading ? (
            <LoadingSpinner />
          ) : attendance && attendance.records.length === 0 ? (
            <EmptyState title="No attendance records" description="No records found for this employee." />
          ) : attendance ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.records.map((record) => (
                      <tr key={record.id} className="border-t border-slate-100">
                        <td className="py-3 px-4 text-slate-900">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </>
      )}

      {showModal && (
        <MarkAttendanceModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
