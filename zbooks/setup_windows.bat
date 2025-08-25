@echo off
echo ========================================
echo ZBooks Setup Script for Windows
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install npm (usually comes with Node.js)
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Create virtual environment
echo 🔄 Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Upgrade pip
echo 🔄 Upgrading pip...
python -m pip install --upgrade pip
if errorlevel 1 (
    echo ERROR: Failed to upgrade pip
    pause
    exit /b 1
)

REM Install Python dependencies
echo 🔄 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    if exist "env_template.txt" (
        echo 🔄 Creating .env file from template...
        copy env_template.txt .env
        echo ✅ Created .env file from template
        echo ⚠️  Please edit .env file with your configuration
    ) else (
        echo ⚠️  No .env template found. Please create .env file manually
    )
)

echo.
echo ✅ Backend setup completed
echo.

REM Setup frontend
echo 🔄 Setting up React frontend...
cd ..\zbooks_web\Zohoweb

REM Install Node.js dependencies
echo 🔄 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo ✅ Frontend setup completed
echo.

REM Go back to backend directory
cd ..\..\zbooks

echo.
echo ========================================
echo Setup Instructions
echo ========================================
echo.
echo 1. Edit the .env file with your configuration:
echo    - Database credentials
echo    - JWT secret keys
echo    - Email settings
echo    - Other API keys
echo.
echo 2. Create MySQL database:
echo    mysql -u root -p
echo    CREATE DATABASE zbooks_db;
echo    CREATE USER 'zbooks_user'@'localhost' IDENTIFIED BY 'zbooks_password';
echo    GRANT ALL PRIVILEGES ON zbooks_db.* TO 'zbooks_user'@'localhost';
echo    FLUSH PRIVILEGES;
echo    EXIT;
echo.
echo 3. Run database migrations:
echo    venv\Scripts\activate
echo    python manage.py makemigrations
echo    python manage.py migrate
echo.
echo 4. Create superuser:
echo    python manage.py createsuperuser
echo.
echo 5. Start the services:
echo    Terminal 1 (Backend):
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo    Terminal 2 (Frontend):
echo    cd zbooks_web\Zohoweb
echo    npm run dev
echo.
echo 6. Access the application:
echo    - Backend API: http://localhost:8000/api/
echo    - API Docs: http://localhost:8000/api/docs/
echo    - Frontend: http://localhost:5173/
echo    - Admin: http://localhost:8000/admin/
echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
pause
