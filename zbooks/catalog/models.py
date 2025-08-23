from django.db import models

class Tax(models.Model):
    name = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=5, decimal_places=2)  # %
    tax_type = models.CharField(max_length=20, default="exclusive")  # exclusive/inclusive
    status = models.CharField(max_length=20, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "taxes"

class Item(models.Model):
    ITEM_TYPES = (("product","product"),("service","service"))
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, default="service")
    sku = models.CharField(max_length=100, blank=True, null=True)
    unit = models.CharField(max_length=20, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    tax = models.ForeignKey(Tax, on_delete=models.SET_NULL, null=True, blank=True)
    opening_stock = models.IntegerField(default=0)
    current_stock = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "items"
        indexes = [models.Index(fields=["name","sku"])]
