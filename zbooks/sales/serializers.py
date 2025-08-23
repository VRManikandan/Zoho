from rest_framework import serializers
from .models import Invoice, InvoiceItem, Payment

class InvoiceItemInSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ("item","description","quantity","rate","discount","tax","amount")

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemInSerializer(many=True, write_only=True)
    class Meta:
        model = Invoice
        fields = ("id","customer","invoice_number","invoice_date","due_date","status",
                  "subtotal","discount","tax","total","notes","balance","items")

    def create(self, validated):
        items = validated.pop("items", [])
        inv = Invoice.objects.create(**validated)
        subtotal=tax=discount=0
        for it in items:
            obj = InvoiceItem.objects.create(invoice=inv, **it)
            subtotal += obj.quantity * obj.rate
            tax += obj.tax
            discount += obj.discount
        inv.subtotal = subtotal
        inv.tax = tax
        inv.discount = discount
        inv.total = subtotal - discount + tax
        inv.balance = inv.total
        inv.save()
        return inv

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id","customer","invoice","payment_date","payment_mode","reference_no","amount","notes")

    def create(self, validated):
        pay = super().create(validated)
        if pay.invoice_id:
            inv = pay.invoice
            inv.balance = (inv.balance or 0) - pay.amount
            inv.status = "paid" if inv.balance <= 0 else "partial"
            inv.save(update_fields=["balance","status"])
        return pay
