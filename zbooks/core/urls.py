from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    
    path("api/chart-of-accounts/", include("accounts.urls")),
    path("api/journal-entries/", include("accounts.urls")),

    # Financial Management
    path("api/", include("accounts.urls")), 

    # Authentication & User Management
    path("api/auth/", include("accounts.urls")),
    
    # Core Business Modules
    path("api/contacts/", include("contacts.urls")),
    path("api/catalog/", include("catalog.urls")),
    path("api/sales/", include("sales.urls")),
    path("api/purchases/", include("purchases.urls")),
    path("api/expenses/", include("expenses_app.urls")),
    path("api/banking/", include("banking.urls")),
    
    # Financial Management
    path("api/chart-of-accounts/", include("accounts.urls")),
    path("api/journal-entries/", include("accounts.urls")),
    
    
    
    # Inventory & Projects
    path("api/inventory/", include("inventory.urls")),
    path("api/projects/", include("projects.urls")),
    
    # Communication & Notifications
    path("api/comms/", include("comms.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/reminders/", include("reminders.urls")),
    
    # Dashboard & Reports
    path("api/dashboard/", include("dashboard.urls")),
    path("api/reports/", include("reports.urls")),
    
    # Settings & Configuration
    path("api/settings/", include("settings_app.urls")),
    
    # Legacy endpoints for backward compatibility
    path('api/customers/', include('customers.urls')),
    path('api/vendors/', include('vendors.urls')),
    path('api/items/', include('items.urls')),
    path('api/taxes/', include('taxes.urls')),
]


