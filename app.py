import os
import logging
from flask import Flask
from flask_cors import CORS
from database import db, init_db

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "quantum_bb84_simulator_secret_key")

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or f'sqlite:///{os.path.join(basedir, "quantum_experiments.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database with the app
init_db(app)

# Enable CORS for all routes
CORS(app)

# Import routes after app creation to avoid circular imports
from routes import *

# Initialize database tables
def init_database():
    """Create database tables on startup"""
    try:
        # Import models inside function to avoid circular imports
        from models import User, Experiment, LabSession, DeviceConnection, Collaborator
        with app.app_context():
            db.create_all()
            print("📊 Database tables created successfully")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")

if __name__ == '__main__':
    init_database()
    app.run(host='0.0.0.0', port=5000, debug=True)
