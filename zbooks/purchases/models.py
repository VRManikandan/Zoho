from django.db import models
from contacts.models import Vendor
from catalog.models import Item
from accounts.models import Organization, User

class PurchaseOrder(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('confirmed', 'Confirmed'),
        ('received', 'Partially Received'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    po_number = models.CharField(max_length=50, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    po_date = models.DateField()
    expected_delivery_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_address = models.TextField()
    notes = models.TextField(blank=True, null=True)
    terms_conditions = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "purchase_orders"
        indexes = [models.Index(fields=["po_number", "status"])]

class PurchaseOrderItem(models.Model):
    po = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    description = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.IntegerField(default=1)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    received_quantity = models.IntegerField(default=0)

    class Meta:
        db_table = "purchase_order_items"

class Bill(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('partial', 'Partially Paid'),
        ('overdue', 'Overdue'),
        ('void', 'Void'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    bill_number = models.CharField(max_length=50, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    bill_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True, null=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bills"
        indexes = [models.Index(fields=["bill_number", "status"])]

class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    description = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.IntegerField(default=1)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "bill_items"

class VendorPayment(models.Model):
    MODE = (("cash","cash"),("bank_transfer","bank_transfer"),("credit_card","credit_card"),("upi","upi"),("cheque","cheque"))
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    bill = models.ForeignKey(Bill, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    payment_date = models.DateField()
    payment_mode = models.CharField(max_length=20, choices=MODE, default="cash")
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "vendor_payments"
        indexes = [models.Index(fields=["payment_date"])]
