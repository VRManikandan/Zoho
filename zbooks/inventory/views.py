from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Warehouse, InventoryTransaction, StockTransfer
from .serializers import (
    WarehouseSerializer,
    InventoryTransactionSerializer,
    StockTransferSerializer,
)


class BaseOrgViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id']
    ordering = ['-id']

    def get_queryset(self):
        qs = super().get_queryset()
        org_id = self.request.query_params.get('organization')
        if org_id:
            qs = qs.filter(organization_id=org_id)
        return qs


class WarehouseViewSet(BaseOrgViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    search_fields = ['name']
    ordering_fields = ['created_at', 'name']


class InventoryTransactionViewSet(BaseOrgViewSet):
    queryset = InventoryTransaction.objects.all()
    serializer_class = InventoryTransactionSerializer
    search_fields = ['transaction_type', 'reference', 'item__name']
    ordering_fields = ['transaction_date']


class StockTransferViewSet(BaseOrgViewSet):
    queryset = StockTransfer.objects.all()
    serializer_class = StockTransferSerializer
    search_fields = ['transfer_number', 'status']
    ordering_fields = ['transfer_date', 'status']
