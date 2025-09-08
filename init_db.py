#!/usr/bin/env python3
"""
Database initialization script for BB84 QKD Simulator
Creates all database tables and sets up initial data
"""

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, Experiment, LabSession, DeviceConnection, Collaborator
from datetime import datetime

def init_database():
    """Initialize the database with tables and sample data"""
    
    print("🔧 Initializing BB84 QKD Simulator Database...")
    
    with app.app_context():
        # Create all database tables
        print("📊 Creating database tables...")
        db.create_all()
        
        # Check if we already have data
        if User.query.first():
            print("✅ Database already initialized with data")
            return
        
        # Create sample user
        print("👤 Creating sample user...")
        sample_user = User(
            username='quantum_researcher',
            email='researcher@quantum.lab',
            password_hash='hashed_password_here'  # In production, use proper password hashing
        )
        db.session.add(sample_user)
        db.session.commit()
        
        # Create sample experiments
        print("🧪 Creating sample experiments...")
        experiments = [
            {
                'name': 'BB84 Standard Protocol Test',
                'protocol_variant': 'bb84',
                'parameters': {
                    'photon_rate': 50,
                    'channel_loss': 10,
                    'eve_interception': 0,
                    'num_photons': 10000
                },
                'qber': 0.08,
                'key_generation_rate': 2.47,
                'security_level': 0.95,
                'photons_transmitted': 10000,
                'final_key_length': 4800,
                'status': 'completed'
            },
            {
                'name': 'SARG04 Protocol Evaluation',
                'protocol_variant': 'sarg04',
                'parameters': {
                    'photon_rate': 75,
                    'channel_loss': 15,
                    'eve_interception': 5,
                    'num_photons': 15000
                },
                'qber': 0.12,
                'key_generation_rate': 1.85,
                'security_level': 0.88,
                'photons_transmitted': 15000,
                'final_key_length': 3200,
                'status': 'completed'
            },
            {
                'name': 'Decoy State Protocol Analysis',
                'protocol_variant': 'decoy',
                'parameters': {
                    'photon_rate': 100,
                    'channel_loss': 8,
                    'eve_interception': 0,
                    'num_photons': 20000
                },
                'qber': 0.06,
                'key_generation_rate': 3.21,
                'security_level': 0.98,
                'photons_transmitted': 20000,
                'final_key_length': 7200,
                'status': 'completed'
            }
        ]
        
        for exp_data in experiments:
            experiment = Experiment(
                name=exp_data['name'],
                protocol_variant=exp_data['protocol_variant'],
                qber=exp_data['qber'],
                key_generation_rate=exp_data['key_generation_rate'],
                security_level=exp_data['security_level'],
                photons_transmitted=exp_data['photons_transmitted'],
                final_key_length=exp_data['final_key_length'],
                status=exp_data['status'],
                user_id=sample_user.id,
                completed_at=datetime.utcnow()
            )
            experiment.set_parameters(exp_data['parameters'])
            db.session.add(experiment)
        
        # Create sample lab session
        print("🔬 Creating sample lab session...")
        lab_session = LabSession(
            session_name='Real-time BB84 Monitoring',
            protocol_variant='bb84',
            current_qber=0.085,
            current_key_rate=2.34,
            photons_processed=8547,
            user_id=sample_user.id
        )
        lab_session.parameters = '{"photon_rate": 50, "channel_loss": 10}'
        db.session.add(lab_session)
        
        # Create sample collaborators
        print("👥 Creating sample collaborators...")
        collaborators = [
            {'name': 'Dr. Alice Quantum', 'role': 'Principal Investigator'},
            {'name': 'Bob Cryptographer', 'role': 'Security Analyst'},
            {'name': 'Dr. Eve Security', 'role': 'Penetration Tester'},
            {'name': 'Charlie Engineer', 'role': 'System Administrator'}
        ]
        
        for collab_data in collaborators:
            collaborator = Collaborator(
                name=collab_data['name'],
                role=collab_data['role']
            )
            db.session.add(collaborator)
        
        # Commit all changes
        db.session.commit()
        print("✅ Database initialization completed successfully!")
        print(f"📍 Database location: {app.config['SQLALCHEMY_DATABASE_URI']}")

def reset_database():
    """Reset the database by dropping and recreating all tables"""
    print("🔄 Resetting database...")
    
    with app.app_context():
        db.drop_all()
        print("🗑️  Dropped all tables")
        init_database()

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        reset_database()
    else:
        init_database()