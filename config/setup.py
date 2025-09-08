"""
Automatic Configuration Setup for BB84 Quantum Simulator
This module handles all external API configurations automatically.
"""

import os
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def setup_environment():
    """
    Automatically configure all environment variables and external APIs.
    Call this once at startup to handle all configuration.
    """
    
    # Get the config directory path
    config_dir = Path(__file__).parent
    
    # 1. Setup Firebase credentials
    firebase_creds_file = config_dir / "firebase_credentials.json"
    if firebase_creds_file.exists():
        try:
            with open(firebase_creds_file, 'r') as f:
                firebase_creds = json.load(f)
            os.environ['FIREBASE_SERVICE_ACCOUNT_KEY'] = json.dumps(firebase_creds)
            logger.info("✅ Firebase credentials configured automatically")
        except Exception as e:
            logger.error(f"❌ Failed to load Firebase credentials: {e}")
    
    # 2. Setup default configurations
    os.environ.setdefault('FLASK_ENV', 'development')
    os.environ.setdefault('FLASK_DEBUG', '1')
    
    # 3. Setup database URL (defaults to SQLite if PostgreSQL not configured)
    if not os.environ.get('DATABASE_URL'):
        project_root = config_dir.parent
        sqlite_path = project_root / "quantum_experiments.db"
        os.environ['DATABASE_URL'] = f'sqlite:///{sqlite_path}'
        logger.info(f"📊 Using SQLite database: {sqlite_path}")
    
    # 4. Setup optional IBM Quantum API (if available)
    ibm_token_file = config_dir / "ibm_quantum_token.txt"
    if ibm_token_file.exists():
        try:
            with open(ibm_token_file, 'r') as f:
                token = f.read().strip()
            os.environ['QISKIT_IBM_TOKEN'] = token
            logger.info("✅ IBM Quantum API token configured")
        except Exception as e:
            logger.warning(f"⚠️ IBM Quantum token file found but couldn't read: {e}")
    
    logger.info("🚀 All configurations loaded successfully!")

def create_setup_files():
    """
    Create template files for additional configurations.
    """
    config_dir = Path(__file__).parent
    
    # Create IBM Quantum token template
    ibm_template = config_dir / "ibm_quantum_token.txt.template"
    if not ibm_template.exists():
        with open(ibm_template, 'w') as f:
            f.write("# Replace this with your IBM Quantum API token\n")
            f.write("# Get your token from: https://quantum.ibm.com/\n")
            f.write("# Rename this file to 'ibm_quantum_token.txt' after adding your token\n")
            f.write("your_ibm_quantum_api_token_here")
    
    # Create .env template for additional environment variables
    env_template = config_dir / ".env.template"
    if not env_template.exists():
        with open(env_template, 'w') as f:
            f.write("# Optional environment variables\n")
            f.write("# Rename to .env to use\n\n")
            f.write("# PostgreSQL Database (optional)\n")
            f.write("# DATABASE_URL=postgresql://username:password@localhost:5432/bb84_db\n\n")
            f.write("# Flask settings\n")
            f.write("FLASK_ENV=development\n")
            f.write("FLASK_DEBUG=1\n")