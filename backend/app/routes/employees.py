import re

from flask import Blueprint, jsonify, request

from app import db
from app.models import Employee

employees_bp = Blueprint("employees", __name__)


def validate_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


@employees_bp.route("/api/employees", methods=["GET"])
def get_employees():
    employees = Employee.query.order_by(Employee.created_at.desc()).all()
    return jsonify([e.to_dict() for e in employees]), 200


@employees_bp.route("/api/employees", methods=["POST"])
def add_employee():
    data = request.get_json()

    # Required fields validation
    required = ["employee_id", "full_name", "email", "department"]
    missing = [f for f in required if not data.get(f, "").strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    employee_id = data["employee_id"].strip()
    full_name = data["full_name"].strip()
    email = data["email"].strip().lower()
    department = data["department"].strip()

    # Email format validation
    if not validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    # Duplicate employee_id check
    if Employee.query.filter_by(employee_id=employee_id).first():
        return jsonify({"error": f"Employee ID '{employee_id}' already exists"}), 409

    # Duplicate email check
    if Employee.query.filter_by(email=email).first():
        return jsonify({"error": f"Email '{email}' already exists"}), 409

    employee = Employee(
        employee_id=employee_id,
        full_name=full_name,
        email=email,
        department=department,
    )
    db.session.add(employee)
    db.session.commit()

    return jsonify(employee.to_dict()), 201


@employees_bp.route("/api/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    db.session.delete(employee)
    db.session.commit()

    return jsonify({"message": "Employee deleted successfully"}), 200
