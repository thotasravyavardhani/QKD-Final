#!/usr/bin/env python3
"""
Simple startup script for BB84 Quantum Simulator
Automatically configures all external APIs and dependencies.

Usage:
    python run.py              # Run on localhost:5000
    python run.py --host 0.0.0.0 --port 8080  # Custom host/port
    python run.py --production  # Production mode with Gunicorn
"""

import argparse
import sys
import os

def main():
    parser = argparse.ArgumentParser(description='BB84 Quantum Simulator')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=5000, help='Port to bind to (default: 5000)')
    parser.add_argument('--production', action='store_true', help='Run in production mode with Gunicorn')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    
    args = parser.parse_args()
    
    # Auto-configure all external APIs
    try:
        from config.setup import setup_environment, create_setup_files
        setup_environment()
        create_setup_files()
        print("✅ All configurations loaded successfully!")
    except ImportError as e:
        print(f"⚠️ Configuration module not found: {e}")
        print("Running with manual environment setup...")
    
    if args.production:
        # Production mode with Gunicorn
        import subprocess
        cmd = [
            'gunicorn',
            '--bind', f'{args.host}:{args.port}',
            '--workers', '4',
            '--timeout', '300',
            '--keep-alive', '2',
            '--log-level', 'info',
            'app:app'
        ]
        print(f"🚀 Starting production server on {args.host}:{args.port}")
        subprocess.run(cmd)
    else:
        # Development mode with Flask
        from app import app
        print(f"🚀 Starting development server on {args.host}:{args.port}")
        print("💡 Use --production flag for production deployment")
        app.run(
            host=args.host, 
            port=args.port, 
            debug=args.debug or True
        )

if __name__ == '__main__':
    main()