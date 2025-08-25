# ZBooks API Testing Collection

Complete API testing guide for the ZBooks system with all endpoints, request bodies, and response examples.

## 🔐 Authentication

### 1. User Registration
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "admin@zbooks.com",
  "password": "admin123",
  "full_name": "Admin User",
  "organization_name": "ZBooks Company",
  "organization_address": "123 Business Street, City, State 12345",
  "organization_phone": "+1-555-0123",
  "organization_email": "info@zbooks.com",
  "organization_website": "https://zbooks.com",
  "organization_gst_number": "GST123456789",
  "organization_pan_number": "ABCDE1234F",
  "organization_currency": "USD",
  "organization_fiscal_year_start": "2024-01-01",
  "organization_timezone": "America/New_York"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@zbooks.com",
    "full_name": "Admin User",
    "role": "admin",
    "organization": {
      "id": 1,
      "name": "ZBooks Company"
    }
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### 2. User Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "admin@zbooks.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@zbooks.com",
    "full_name": "Admin User",
    "role": "admin"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### 3. Refresh Token
```http
POST /api/auth/refresh/
Authorization: Bearer <refresh_token>
```

## 📊 Chart of Accounts

### 4. Create Asset Account
```http
POST /api/chart-of-accounts/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "account_code": "1000",
  "account_name": "Cash",
  "account_type": "asset",
  "opening_balance": 10000.00,
  "description": "Main cash account for daily operations"
}
```

### 5. Create Liability Account
```http
POST /api/chart-of-accounts/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "account_code": "2000",
  "account_name": "Accounts Payable",
  "account_type": "liability",
  "opening_balance": 0.00,
  "description": "Amounts owed to vendors and suppliers"
}
```

### 6. Create Income Account
```http
POST /api/chart-of-accounts/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "account_code": "4000",
  "account_name": "Sales Revenue",
  "account_type": "income",
  "opening_balance": 0.00,
  "description": "Revenue from product and service sales"
}
```

### 7. List All Accounts
```http
GET /api/chart-of-accounts/
Authorization: Bearer <access_token>
```

## 👥 Contacts Management

### 8. Create Customer
```http
POST /api/contacts/customers/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "ABC Corporation",
  "email": "contact@abccorp.com",
  "phone": "+1-555-0100",
  "billing_address": "456 Customer Ave, Business City, BC 54321",
  "shipping_address": "456 Customer Ave, Business City, BC 54321",
  "gst_number": "GST987654321",
  "currency": "USD"
}
```

### 9. Create Vendor
```http
POST /api/contacts/vendors/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "XYZ Supplies",
  "email": "orders@xyzsupplies.com",
  "phone": "+1-555-0200",
  "address": "789 Vendor Blvd, Supply Town, ST 67890",
  "gst_number": "GST456789123"
}
```

### 10. List Customers
```http
GET /api/contacts/customers/
Authorization: Bearer <access_token>
```

### 11. List Vendors
```http
GET /api/contacts/vendors/
Authorization: Bearer <access_token>
```

## 🛍️ Catalog Management

### 12. Create Product Item
```http
POST /api/catalog/items/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Premium Widget",
  "description": "High-quality widget for professional use",
  "item_type": "product",
  "sku": "WID-001",
  "unit": "piece",
  "price": 99.99,
  "tax_rate": 8.5,
  "opening_stock": 100,
  "current_stock": 100
}
```

### 13. Create Service Item
```http
POST /api/catalog/items/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Consulting Service",
  "description": "Professional business consulting",
  "item_type": "service",
  "sku": "CON-001",
  "unit": "hour",
  "price": 150.00,
  "tax_rate": 8.5,
  "opening_stock": 0,
  "current_stock": 0
}
```

### 14. List Items
```http
GET /api/catalog/items/
Authorization: Bearer <access_token>
```

## 💰 Sales Management

### 15. Create Estimate
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
      "quantity": 5,
      "rate": 99.99,
      "description": "Premium Widgets for office use"
    }
  ],
  "notes": "Valid for 30 days",
  "terms_conditions": "Net 30 days, 2% discount for early payment"
}
```

### 16. Create Sales Order
```http
POST /api/sales/sales-orders/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer": 1,
  "order_date": "2024-01-15",
  "delivery_date": "2024-01-30",
  "items": [
    {
      "item": 1,
      "quantity": 5,
      "rate": 99.99,
      "description": "Premium Widgets for office use"
    }
  ],
  "shipping_address": "456 Customer Ave, Business City, BC 54321",
  "notes": "Please deliver during business hours"
}
```

### 17. Create Invoice
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
      "quantity": 5,
      "rate": 99.99,
      "description": "Premium Widgets for office use"
    }
  ],
  "notes": "Thank you for your business",
  "is_recurring": false
}
```

### 18. List Invoices
```http
GET /api/sales/invoices/
Authorization: Bearer <access_token>
```

### 19. Create Payment
```http
POST /api/sales/payments/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "customer": 1,
  "invoice": 1,
  "payment_date": "2024-01-20",
  "payment_mode": "bank_transfer",
  "reference_no": "TXN123456",
  "amount": 499.95,
  "notes": "Payment received via bank transfer"
}
```

## 🛒 Purchase Management

### 20. Create Purchase Order
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
      "quantity": 50,
      "rate": 75.00,
      "description": "Bulk order of Premium Widgets"
    }
  ],
  "shipping_address": "123 Warehouse St, Storage City, SC 11111",
  "notes": "Please ensure quality control",
  "terms_conditions": "Net 30 days, FOB destination"
}
```

### 21. Create Bill
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
      "quantity": 50,
      "rate": 75.00,
      "description": "Bulk order of Premium Widgets"
    }
  ],
  "notes": "Invoice for bulk widget order"
}
```

### 22. List Purchase Orders
```http
GET /api/purchases/purchase-orders/
Authorization: Bearer <access_token>
```

### 23. List Bills
```http
GET /api/purchases/bills/
Authorization: Bearer <access_token>
```

## 📝 Financial Management

### 24. Create Journal Entry
```http
POST /api/journal-entries/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "entry_date": "2024-01-15",
  "description": "Initial investment and setup costs",
  "lines": [
    {
      "account": 1,
      "description": "Cash received from owner",
      "debit_amount": 10000.00,
      "credit_amount": 0.00
    },
    {
      "account": 2,
      "description": "Owner's equity investment",
      "debit_amount": 0.00,
      "credit_amount": 10000.00
    }
  ]
}
```

### 25. List Journal Entries
```http
GET /api/journal-entries/
Authorization: Bearer <access_token>
```

### 26. Post Journal Entry
```http
POST /api/journal-entries/1/post/
Authorization: Bearer <access_token>
```

## 🏦 Banking

### 27. Create Bank Account
```http
POST /api/banking/bank-accounts/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "account_name": "Main Business Account",
  "bank_name": "Business Bank",
  "account_number": "1234567890",
  "ifsc_code": "BUSI0001234",
  "opening_balance": 10000.00,
  "current_balance": 10000.00
}
```

### 28. Create Bank Transaction
```http
POST /api/banking/bank-transactions/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "bank": 1,
  "transaction_date": "2024-01-15",
  "type": "credit",
  "description": "Initial deposit",
  "amount": 10000.00,
  "reference_no": "DEP001"
}
```

### 29. List Bank Accounts
```http
GET /api/banking/bank-accounts/
Authorization: Bearer <access_token>
```

### 30. List Bank Transactions
```http
GET /api/banking/bank-transactions/
Authorization: Bearer <access_token>
```

## 📊 Dashboard & Reports

### 31. Get Dashboard Statistics
```http
GET /api/dashboard/stats/
Authorization: Bearer <access_token>
```

**Expected Response:**
```json
{
  "totalRevenue": 499.95,
  "pendingInvoices": 1,
  "pendingAmount": 499.95,
  "totalCustomers": 1,
  "monthlySales": 499.95,
  "collectionRate": 100.0,
  "totalVendors": 1,
  "totalItems": 2,
  "monthlyExpenses": 0.0,
  "cashBalance": 10000.0
}
```

### 32. Generate Financial Report
```http
POST /api/reports/financial/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "report_type": "profit_loss",
  "period_start": "2024-01-01",
  "period_end": "2024-01-31",
  "format": "json"
}
```

### 33. Generate Balance Sheet
```http
POST /api/reports/financial/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "report_type": "balance_sheet",
  "as_of_date": "2024-01-31",
  "format": "pdf"
}
```

## 🏗️ Projects & Time Tracking

### 34. Create Project
```http
POST /api/projects/projects/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project_name": "Website Development",
  "customer": 1,
  "description": "Complete website redesign and development",
  "start_date": "2024-01-15",
  "end_date": "2024-03-15",
  "budget": 5000.00,
  "project_manager": 1
}
```

### 35. Create Time Entry
```http
POST /api/projects/time-entries/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "project": 1,
  "date": "2024-01-15",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "hours": 8.0,
  "description": "Initial project planning and requirements gathering",
  "is_billable": true,
  "hourly_rate": 75.00
}
```

### 36. List Projects
```http
GET /api/projects/projects/
Authorization: Bearer <access_token>
```

### 37. List Time Entries
```http
GET /api/projects/time-entries/
Authorization: Bearer <access_token>
```

## 📦 Inventory Management

### 38. Create Warehouse
```http
POST /api/inventory/warehouses/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Main Warehouse",
  "address": "123 Warehouse St, Storage City, SC 11111",
  "contact_person": "Warehouse Manager",
  "phone": "+1-555-0300",
  "email": "warehouse@zbooks.com"
}
```

### 39. Create Stock Transfer
```http
POST /api/inventory/stock-transfers/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "from_warehouse": 1,
  "to_warehouse": 1,
  "transfer_date": "2024-01-15",
  "items": [
    {
      "item": 1,
      "quantity": 10,
      "notes": "Transfer for customer order"
    }
  ],
  "notes": "Internal transfer for order fulfillment"
}
```

### 40. List Warehouses
```http
GET /api/inventory/warehouses/
Authorization: Bearer <access_token>
```

### 41. List Stock Transfers
```http
GET /api/inventory/stock-transfers/
Authorization: Bearer <access_token>
```

## ⚙️ Settings & Configuration

### 42. Create System Setting
```http
POST /api/settings/system-settings/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "setting_key": "company_logo",
  "setting_value": "https://example.com/logo.png",
  "setting_type": "general",
  "description": "Company logo URL for reports and invoices"
}
```

### 43. Create Email Template
```http
POST /api/settings/email-templates/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "template_type": "invoice",
  "subject": "Invoice #{invoice_number} from {company_name}",
  "body": "Dear {customer_name},\n\nPlease find attached invoice #{invoice_number} for {amount}.\n\nDue date: {due_date}\n\nThank you for your business.\n\nBest regards,\n{company_name}"
}
```

### 44. List System Settings
```http
GET /api/settings/system-settings/
Authorization: Bearer <access_token>
```

### 45. List Email Templates
```http
GET /api/settings/email-templates/
Authorization: Bearer <access_token>
```

## 🔍 Search & Filtering

### 46. Search Customers
```http
GET /api/contacts/customers/?search=ABC
Authorization: Bearer <access_token>
```

### 47. Filter Invoices by Status
```http
GET /api/sales/invoices/?status=draft
Authorization: Bearer <access_token>
```

### 48. Filter Items by Type
```http
GET /api/catalog/items/?item_type=product
Authorization: Bearer <access_token>
```

### 49. Date Range Filter
```http
GET /api/sales/invoices/?date_from=2024-01-01&date_to=2024-01-31
Authorization: Bearer <access_token>
```

## 📱 Pagination

### 50. Paginated Results
```http
GET /api/sales/invoices/?page=1&page_size=10
Authorization: Bearer <access_token>
```

**Expected Response:**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/sales/invoices/?page=2&page_size=10",
  "previous": null,
  "results": [
    // Invoice objects
  ]
}
```

## 🧪 Testing Commands

### Using curl
```bash
# Test authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zbooks.com","password":"admin123"}'

# Test protected endpoint
curl -X GET http://localhost:8000/api/dashboard/stats/ \
  -H "Authorization: Bearer <your_access_token>"
```

### Using Postman
1. Import the collection
2. Set base URL: `http://localhost:8000`
3. Set environment variables for tokens
4. Run requests in sequence

### Using Python requests
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', json={
    'email': 'admin@zbooks.com',
    'password': 'admin123'
})

token = response.json()['tokens']['access']

# Use token for authenticated requests
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/dashboard/stats/', headers=headers)
print(response.json())
```

## 📋 Testing Checklist

- [ ] Authentication (Register, Login, Refresh)
- [ ] Chart of Accounts (Create, List)
- [ ] Contacts (Customers, Vendors)
- [ ] Catalog (Items)
- [ ] Sales (Estimates, Orders, Invoices, Payments)
- [ ] Purchases (Orders, Bills)
- [ ] Financial (Journal Entries)
- [ ] Banking (Accounts, Transactions)
- [ ] Dashboard (Statistics)
- [ ] Reports (Financial)
- [ ] Projects (Projects, Time Entries)
- [ ] Inventory (Warehouses, Transfers)
- [ ] Settings (System, Email Templates)
- [ ] Search & Filtering
- [ ] Pagination

## 🚨 Error Handling

### Common HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

### Error Response Format
```json
{
  "error": "Validation failed",
  "details": {
    "field_name": ["This field is required."]
  }
}
```

## 🔐 Security Testing

### Test Invalid Token
```http
GET /api/dashboard/stats/
Authorization: Bearer invalid_token
```

### Test Expired Token
```http
GET /api/dashboard/stats/
Authorization: Bearer expired_token
```

### Test Missing Token
```http
GET /api/dashboard/stats/
```

## 📊 Performance Testing

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API performance
ab -n 1000 -c 10 http://localhost:8000/api/dashboard/stats/
```

### Database Performance
```bash
# Check slow queries
python manage.py dbshell
SHOW PROCESSLIST;
```

---

**Complete API Testing Guide for ZBooks System**
