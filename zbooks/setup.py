#!/usr/bin/env python3
"""
ZBooks Setup Script
Automates the installation and configuration of the ZBooks system
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_prerequisites():
    """Check if required software is installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Python version
    if sys.version_info < (3, 11):
        print("❌ Python 3.11+ is required")
        return False
    
    # Check Node.js
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        print("✅ Node.js found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js is required")
        return False
    
    # Check npm
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        print("✅ npm found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ npm is required")
        return False
    
    print("✅ All prerequisites met")
    return True

def setup_backend():
    """Setup the Django backend"""
    print("\n🚀 Setting up Django backend...")
    
    # Create virtual environment
    if not run_command("python -m venv venv", "Creating virtual environment"):
        return False
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    if not run_command(f"{pip_cmd} install --upgrade pip", "Upgrading pip"):
        return False
    
    if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    # Create .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        if Path("env_template.txt").exists():
            shutil.copy("env_template.txt", ".env")
            print("✅ Created .env file from template")
            print("⚠️  Please edit .env file with your configuration")
        else:
            print("⚠️  No .env template found. Please create .env file manually")
    
    print("✅ Backend setup completed")
    return True

def setup_frontend():
    """Setup the React frontend"""
    print("\n🎨 Setting up React frontend...")
    
    frontend_dir = Path("../zbooks_web/Zohoweb")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    os.chdir(frontend_dir)
    
    if not run_command("npm install", "Installing Node.js dependencies"):
        return False
    
    print("✅ Frontend setup completed")
    return True

def create_database():
    """Create MySQL database and user"""
    print("\n🗄️  Database setup...")
    
    print("Please run the following MySQL commands manually:")
    print("""
mysql -u root -p

CREATE DATABASE zbooks_db;
CREATE USER 'zbooks_user'@'localhost' IDENTIFIED BY 'zbooks_password';
GRANT ALL PRIVILEGES ON zbooks_db.* TO 'zbooks_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
    """)
    
    response = input("Have you created the database? (y/n): ")
    if response.lower() != 'y':
        print("⚠️  Please create the database before continuing")
        return False
    
    return True

def run_migrations():
    """Run Django migrations"""
    print("\n🔄 Running database migrations...")
    
    # Go back to backend directory
    os.chdir(Path("../../zbooks"))
    
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    if not run_command(f"{python_cmd} manage.py makemigrations", "Creating migrations"):
        return False
    
    if not run_command(f"{python_cmd} manage.py migrate", "Running migrations"):
        return False
    
    print("✅ Database migrations completed")
    return True

def create_superuser():
    """Create Django superuser"""
    print("\n👤 Creating superuser...")
    
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    print("Please create a superuser account:")
    if not run_command(f"{python_cmd} manage.py createsuperuser", "Creating superuser"):
        return False
    
    return True

def start_services():
    """Start the development servers"""
    print("\n🚀 Starting development servers...")
    
    print("""
To start the services, run the following commands in separate terminals:

Terminal 1 (Backend):
cd zbooks
venv\\Scripts\\activate  # Windows
source venv/bin/activate  # Unix/Linux/Mac
python manage.py runserver

Terminal 2 (Frontend):
cd zbooks_web/Zohoweb
npm run dev

Then access:
- Backend API: http://localhost:8000/api/
- API Docs: http://localhost:8000/api/docs/
- Frontend: http://localhost:5173/
- Admin: http://localhost:8000/admin/
    """)

def main():
    """Main setup function"""
    print("🎯 ZBooks Setup Script")
    print("=" * 50)
    
    if not check_prerequisites():
        print("❌ Setup failed due to missing prerequisites")
        sys.exit(1)
    
    if not setup_backend():
        print("❌ Backend setup failed")
        sys.exit(1)
    
    if not setup_frontend():
        print("❌ Frontend setup failed")
        sys.exit(1)
    
    if not create_database():
        print("❌ Database setup failed")
        sys.exit(1)
    
    if not run_migrations():
        print("❌ Migration failed")
        sys.exit(1)
    
    if not create_superuser():
        print("❌ Superuser creation failed")
        sys.exit(1)
    
    start_services()
    
    print("\n🎉 ZBooks setup completed successfully!")
    print("Please follow the instructions above to start the services")

if __name__ == "__main__":
    main()
