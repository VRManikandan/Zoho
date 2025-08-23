from rest_framework import viewsets, permissions, filters
from .models import Invoice, Payment
from .serializers import InvoiceSerializer, PaymentSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.none()  # to please linters
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["invoice_number","customer__name"]

    def get_queryset(self):
        return Invoice.objects.select_related("customer").prefetch_related("items").order_by("-id")

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Payment.objects.select_related("invoice","customer").order_by("-payment_date")
