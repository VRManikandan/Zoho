from django.db import models
from contacts.models import Vendor

class Expense(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    expense_date = models.DateField()
    category = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    payment_mode = models.CharField(max_length=30, default="cash")
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    receipt_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "expenses"
