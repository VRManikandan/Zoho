from rest_framework import serializers
from .models import PurchaseOrder, PurchaseOrderItem, Bill, BillItem, VendorPayment


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = (
            'id', 'item', 'description', 'quantity', 'rate', 'discount', 'tax_rate', 'amount', 'received_quantity'
        )


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = (
            'id', 'organization', 'po_number', 'vendor', 'po_date', 'expected_delivery_date', 'status',
            'subtotal', 'discount', 'tax', 'total', 'shipping_address', 'notes', 'terms_conditions',
            'created_by', 'created_at', 'items'
        )
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        purchase_order = PurchaseOrder.objects.create(**validated_data)
        for item in items_data:
            PurchaseOrderItem.objects.create(po=purchase_order, **item)
        return purchase_order

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                PurchaseOrderItem.objects.create(po=instance, **item)
        return instance


class BillItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillItem
        fields = (
            'id', 'item', 'description', 'quantity', 'rate', 'discount', 'tax_rate', 'amount'
        )


class BillSerializer(serializers.ModelSerializer):
    items = BillItemSerializer(many=True)

    class Meta:
        model = Bill
        fields = (
            'id', 'organization', 'bill_number', 'vendor', 'bill_date', 'due_date', 'status', 'subtotal',
            'discount', 'tax', 'total', 'notes', 'balance', 'created_by', 'created_at', 'items'
        )
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        bill = Bill.objects.create(**validated_data)
        for item in items_data:
            BillItem.objects.create(bill=bill, **item)
        return bill

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                BillItem.objects.create(bill=instance, **item)
        return instance


class VendorPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPayment
        fields = (
            'id', 'organization', 'vendor', 'bill', 'payment_date', 'payment_mode', 'reference_no', 'amount',
            'notes', 'created_by', 'created_at'
        )
        read_only_fields = ('created_at',)


