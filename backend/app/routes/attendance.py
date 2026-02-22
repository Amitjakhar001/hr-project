from datetime import datetime

from flask import Blueprint, jsonify, request

from app import db
from app.models import Attendance, Employee

attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.route("/api/attendance/<int:emp_id>", methods=["GET"])
def get_attendance(emp_id):
    employee = Employee.query.get(emp_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    # Optional date filter
    date_filter = request.args.get("date")

    query = Attendance.query.filter_by(employee_id=emp_id)

    if date_filter:
        try:
            parsed = datetime.strptime(date_filter, "%Y-%m-%d").date()
            query = query.filter_by(date=parsed)
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    records = query.order_by(Attendance.date.desc()).all()

    # Count present days
    present_count = Attendance.query.filter_by(
        employee_id=emp_id, status="Present"
    ).count()
    absent_count = Attendance.query.filter_by(
        employee_id=emp_id, status="Absent"
    ).count()

    return jsonify({
        "employee": employee.to_dict(),
        "present_count": present_count,
        "absent_count": absent_count,
        "records": [r.to_dict() for r in records],
    }), 200


@attendance_bp.route("/api/attendance", methods=["POST"])
def mark_attendance():
    data = request.get_json()

    # Validation
    required = ["employee_id", "date", "status"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    emp_id = data["employee_id"]
    status = data["status"]

    if status not in ("Present", "Absent"):
        return jsonify({"error": "Status must be 'Present' or 'Absent'"}), 400

    # Validate date
    try:
        date = datetime.strptime(data["date"], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    # Check employee exists
    employee = Employee.query.get(emp_id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    # Check duplicate
    existing = Attendance.query.filter_by(employee_id=emp_id, date=date).first()
    if existing:
        # Update existing record
        existing.status = status
        db.session.commit()
        return jsonify(existing.to_dict()), 200

    record = Attendance(employee_id=emp_id, date=date, status=status)
    db.session.add(record)
    db.session.commit()

    return jsonify(record.to_dict()), 201
