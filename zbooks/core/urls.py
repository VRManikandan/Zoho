from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/auth/", include("accounts.urls")),
    path("api/contacts/", include("contacts.urls")),
    path("api/catalog/", include("catalog.urls")),
    path("api/sales/", include("sales.urls")),
    path("api/expenses/", include("expenses_app.urls")),
    path("api/banking/", include("banking.urls")),
    path("api/comms/", include("comms.urls")),
    path('api/customers/', include('customers.urls')),
    path('api/vendors/', include('vendors.urls')),
    path('api/items/', include('items.urls')),
    path('api/taxes/', include('taxes.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/reminders/', include('reminders.urls')),
]
