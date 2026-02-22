from datetime import date

from flask import Blueprint, jsonify

from app import db
from app.models import Attendance, Employee

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    total_employees = Employee.query.count()

    today = date.today()
    present_today = Attendance.query.filter_by(
        date=today, status="Present"
    ).count()
    absent_today = Attendance.query.filter_by(
        date=today, status="Absent"
    ).count()

    # Department-wise count
    departments = (
        db.session.query(Employee.department, db.func.count(Employee.id))
        .group_by(Employee.department)
        .all()
    )

    return jsonify({
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "departments": [
            {"name": d[0], "count": d[1]} for d in departments
        ],
    }), 200
