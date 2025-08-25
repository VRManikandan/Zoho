from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseOrderViewSet, BillViewSet, VendorPaymentViewSet

router = DefaultRouter()
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'bills', BillViewSet, basename='bill')
router.register(r'vendor-payments', VendorPaymentViewSet, basename='vendor-payment')

urlpatterns = [
    path('', include(router.urls)),
]
