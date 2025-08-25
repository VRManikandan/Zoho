from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import PurchaseOrder, Bill, VendorPayment
from .serializers import (
    PurchaseOrderSerializer,
    BillSerializer,
    VendorPaymentSerializer,
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


class PurchaseOrderViewSet(BaseOrgViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    search_fields = ['po_number', 'vendor__name', 'status']
    ordering_fields = ['po_date', 'status', 'total']


class BillViewSet(BaseOrgViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    search_fields = ['bill_number', 'vendor__name', 'status']
    ordering_fields = ['bill_date', 'status', 'total']


class VendorPaymentViewSet(BaseOrgViewSet):
    queryset = VendorPayment.objects.all()
    serializer_class = VendorPaymentSerializer
    search_fields = ['reference_no', 'vendor__name']
    ordering_fields = ['payment_date', 'amount']
