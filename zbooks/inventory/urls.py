from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WarehouseViewSet, InventoryTransactionViewSet, StockTransferViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'transactions', InventoryTransactionViewSet, basename='inventory-transaction')
router.register(r'transfers', StockTransferViewSet, basename='stock-transfer')

urlpatterns = [
    path('', include(router.urls)),
]
