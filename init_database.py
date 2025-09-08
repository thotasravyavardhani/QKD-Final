#!/usr/bin/env python3
from app import app
from models import User, Experiment, LabSession, DeviceConnection, Collaborator
from database import db

with app.app_context():
    db.create_all()
    print('Database tables created successfully')