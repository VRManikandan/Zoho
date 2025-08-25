from django.db import models
from accounts.models import Organization
from catalog.models import Item

class Warehouse(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    address = models.TextField()
    contact_person = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "warehouses"

class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('purchase', 'Purchase'),
        ('sale', 'Sale'),
        ('transfer', 'Transfer'),
        ('adjustment', 'Adjustment'),
        ('return', 'Return'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reference = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    transaction_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "inventory_transactions"
        indexes = [models.Index(fields=["transaction_date", "transaction_type"])]

class StockTransfer(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    transfer_number = models.CharField(max_length=50, unique=True)
    from_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='outgoing_transfers')
    to_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='incoming_transfers')
    transfer_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stock_transfers"
        indexes = [models.Index(fields=["transfer_number", "status"])]

class StockTransferItem(models.Model):
    transfer = models.ForeignKey(StockTransfer, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "stock_transfer_items"
