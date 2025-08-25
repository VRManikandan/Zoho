# ZBooks - Complete ZohoBooks Clone

A comprehensive accounting and business management system built with Django and React, featuring all Elite and Ultimate ZohoBooks functionality.

## 🚀 Features

### ✅ **Complete Financial Management**
- **Chart of Accounts** - Hierarchical account structure
- **Journal Entries** - Double-entry bookkeeping
- **Financial Reports** - P&L, Balance Sheet, Cash Flow
- **Multi-currency Support** - Global business support
- **Fiscal Year Management** - Period closing and reporting

### ✅ **Advanced Sales & Purchase**
- **Estimates & Quotes** - Pre-invoice management
- **Sales Orders** - Order tracking and fulfillment
- **Purchase Orders** - Vendor order management
- **Bills Management** - Vendor invoice handling
- **Credit Notes** - Returns and refunds
- **Recurring Invoices** - Automated billing

### ✅ **Inventory & Projects**
- **Multi-warehouse Management** - Stock tracking
- **Project Accounting** - Project-based tracking
- **Time Tracking** - Billable hours management
- **Stock Transfers** - Inter-warehouse movements

### ✅ **Banking & Payments**
- **Bank Reconciliation** - Automated matching
- **Payment Gateways** - Online payment processing
- **Multi-bank Support** - Multiple account management
- **Transaction Categorization** - Smart categorization

### ✅ **Advanced Features**
- **Workflow Automation** - Business process automation
- **Document Management** - File attachments and storage
- **Email Integration** - Automated communications
- **Mobile Responsive** - Works on all devices

## 🛠️ Technology Stack

### Backend
- **Django 5.2.5** - Web framework
- **Django REST Framework** - API development
- **MySQL/PostgreSQL** - Database
- **Redis** - Caching and background tasks
- **Celery** - Asynchronous task processing

### Frontend
- **React 19** - User interface
- **Ant Design** - UI components
- **Vite** - Build tool
- **React Router** - Navigation

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Web server
- **Gunicorn** - WSGI server
- **AWS S3** - File storage

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+ or PostgreSQL 13+
- Redis 6.0+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd zbooks
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp env_template.txt .env

# Edit .env file with your configuration
# Database credentials, API keys, etc.

# Create database
mysql -u root -p
CREATE DATABASE zbooks_db;
CREATE USER 'zbooks_user'@'localhost' IDENTIFIED BY 'zbooks_password';
GRANT ALL PRIVILEGES ON zbooks_db.* TO 'zbooks_user'@'localhost';
FLUSH PRIVILEGES;

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd zbooks_web/Zohoweb

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Backend API**: http://localhost:8000/api/
- **API Documentation**: http://localhost:8000/api/docs/
- **Frontend**: http://localhost:5173/
- **Admin Panel**: http://localhost:8000/admin/

## 📚 Complete API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "organization_name": "My Company",
  "organization_address": "123 Business St",
  "organization_phone": "+1234567890",
  "organization_email": "info@mycompany.com"
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh/
Authorization: Bearer <refresh_token>
```

### Chart of Accounts

#### Create Account
```http
POST /api/chart-of-accounts/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "account_code": "1000",
  "account_name": "Cash",
  "account_type": "asset",
  "opening_balance": 10000.00,
  "description": "Main cash account"
}
```

#### List Accounts
```http
GET /api/chart-of-accounts/
Authorization: Bearer <access_token>
```

### Sales Management

#### Create Invoice
```http
POST /api/sales/invoices/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer": 1,
  "invoice_date": "2024-01-15",
  "due_date": "2024-02-15",
  "items": [
    {
      "item": 1,
      "quantity": 2,
      "rate": 100.00,
      "description": "Product description"
    }
  ],
  "notes": "Thank you for your business"
}
```

#### Create Estimate
```http
POST /api/sales/estimates/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer": 1,
  "estimate_date": "2024-01-15",
  "expiry_date": "2024-02-15",
  "items": [
    {
      "item": 1,
      "quantity": 2,
      "rate": 100.00
    }
  ],
  "terms_conditions": "Net 30 days"
}
```

### Purchase Management

#### Create Purchase Order
```http
POST /api/purchases/purchase-orders/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "vendor": 1,
  "po_date": "2024-01-15",
  "expected_delivery_date": "2024-01-30",
  "items": [
    {
      "item": 1,
      "quantity": 10,
      "rate": 50.00
    }
  ],
  "shipping_address": "123 Warehouse St"
}
```

#### Create Bill
```http
POST /api/purchases/bills/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "vendor": 1,
  "bill_date": "2024-01-15",
  "due_date": "2024-02-15",
  "items": [
    {
      "item": 1,
      "quantity": 10,
      "rate": 50.00
    }
  ]
}
```

### Financial Management

#### Create Journal Entry
```http
POST /api/journal-entries/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "entry_date": "2024-01-15",
  "description": "Initial investment",
  "lines": [
    {
      "account": 1,
      "description": "Cash received",
      "debit_amount": 10000.00,
      "credit_amount": 0.00
    },
    {
      "account": 2,
      "description": "Owner's equity",
      "debit_amount": 0.00,
      "credit_amount": 10000.00
    }
  ]
}
```

### Dashboard & Reports

#### Get Dashboard Stats
```http
GET /api/dashboard/stats/
Authorization: Bearer <access_token>
```

#### Generate Financial Report
```http
POST /api/reports/financial/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "report_type": "profit_loss",
  "period_start": "2024-01-01",
  "period_end": "2024-01-31",
  "format": "pdf"
}
```

## 🔧 Configuration

### Environment Variables

Copy `env_template.txt` to `.env` and configure:

```bash
# Database
DB_NAME=zbooks_db
DB_USER=zbooks_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Redis
REDIS_URL=redis://localhost:6379/0

# Payment Gateway
STRIPE_PUBLIC_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
```

### Database Configuration

The system supports both MySQL and PostgreSQL:

```python
# MySQL
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}

# PostgreSQL
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}
```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
python manage.py test

# Frontend tests
cd zbooks_web/Zohoweb
npm test

# Coverage report
coverage run --source='.' manage.py test
coverage report
coverage html
```

### API Testing

Use the built-in API documentation at `/api/docs/` or test with tools like:

- **Postman** - API testing
- **Insomnia** - REST client
- **curl** - Command line

Example API test:
```bash
# Test authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:8000/api/dashboard/stats/ \
  -H "Authorization: Bearer <your_access_token>"
```

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
```bash
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

2. **Static Files**
```bash
python manage.py collectstatic
```

3. **Database Migration**
```bash
python manage.py migrate
```

4. **Gunicorn Configuration**
```bash
gunicorn --bind 0.0.0.0:8000 core.wsgi:application
```

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 Monitoring & Maintenance

### Health Checks
- **API Health**: `/api/health/`
- **Database**: Check connection status
- **Redis**: Verify cache connectivity
- **Background Tasks**: Monitor Celery workers

### Backup Strategy
```bash
# Database backup
mysqldump -u zbooks_user -p zbooks_db > backup.sql

# File backup
tar -czf media_backup.tar.gz media/

# Automated backup script
python manage.py backup_data
```

### Performance Optimization
- **Database Indexing** - Optimize slow queries
- **Caching** - Redis for frequently accessed data
- **CDN** - Static file delivery
- **Load Balancing** - Multiple server instances

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: `/api/docs/`
- **Issues**: GitHub Issues
- **Email**: support@zbooks.com
- **Community**: Discord/Slack

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core financial management
- ✅ Sales & purchase management
- ✅ Basic reporting

### Phase 2 (Next)
- 🔄 Advanced analytics
- 🔄 Mobile app
- 🔄 AI-powered insights

### Phase 3 (Future)
- 📋 Multi-tenant SaaS
- 📋 Advanced integrations
- 📋 Machine learning features

---

**Built with ❤️ for modern businesses**
