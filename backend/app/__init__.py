from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app)
    db.init_app(app)

    from app.routes.attendance import attendance_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.employees import employees_bp

    app.register_blueprint(employees_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(dashboard_bp)

    @app.route("/")
    def index():
        return {"message": "HRMS Lite API", "status": "running"}

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Warning: Could not create tables: {e}")

    return app
