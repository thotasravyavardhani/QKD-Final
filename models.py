from database import db
from datetime import datetime
import json


class User(db.Model):
    """User model for authentication and experiment tracking"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    experiments = db.relationship('Experiment', backref='user', lazy=True)
    
    def __repr__(self):
        return f'<User {self.username}>'


class Experiment(db.Model):
    """Experiment model for storing BB84 simulation data"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    protocol_variant = db.Column(db.String(64), nullable=False, default='bb84')
    
    # Experiment parameters (JSON)
    parameters = db.Column(db.Text)  # JSON string of simulation parameters
    results = db.Column(db.Text)     # JSON string of simulation results
    
    # Metrics
    qber = db.Column(db.Float)
    key_generation_rate = db.Column(db.Float)
    security_level = db.Column(db.Float)
    photons_transmitted = db.Column(db.Integer)
    final_key_length = db.Column(db.Integer)
    
    # Status and timing
    status = db.Column(db.String(32), default='pending')  # pending, running, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def set_parameters(self, params_dict):
        """Store parameters as JSON"""
        self.parameters = json.dumps(params_dict)
    
    def get_parameters(self):
        """Retrieve parameters from JSON"""
        return json.loads(self.parameters) if self.parameters else {}
    
    def set_results(self, results_dict):
        """Store results as JSON"""
        self.results = json.dumps(results_dict)
    
    def get_results(self):
        """Retrieve results from JSON"""
        return json.loads(self.results) if self.results else {}
    
    def __repr__(self):
        return f'<Experiment {self.name} - {self.protocol_variant}>'


class LabSession(db.Model):
    """Lab session model for tracking real-time lab experiments"""
    id = db.Column(db.Integer, primary_key=True)
    session_name = db.Column(db.String(128), nullable=False)
    protocol_variant = db.Column(db.String(64), nullable=False, default='bb84')
    
    # Session parameters
    parameters = db.Column(db.Text)  # JSON string of lab parameters
    
    # Real-time metrics
    current_qber = db.Column(db.Float)
    current_key_rate = db.Column(db.Float)
    photons_processed = db.Column(db.Integer, default=0)
    
    # Session timing
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def __repr__(self):
        return f'<LabSession {self.session_name}>'


class DeviceConnection(db.Model):
    """Device connection model for tracking mobile device connections"""
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(128), unique=True, nullable=False)
    device_type = db.Column(db.String(64), nullable=False)  # mobile, quantum_device, etc.
    
    # Connection details
    connection_status = db.Column(db.String(32), default='disconnected')  # connected, disconnected
    last_ping = db.Column(db.DateTime)
    
    # Device info
    device_info = db.Column(db.Text)  # JSON string of device information
    
    # Timing
    connected_at = db.Column(db.DateTime, default=datetime.utcnow)
    disconnected_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<DeviceConnection {self.device_id} - {self.connection_status}>'


class Collaborator(db.Model):
    """Collaborator model for team management"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(64), nullable=False)
    status = db.Column(db.String(32), default='active')
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Collaborator {self.name} - {self.role}>'
