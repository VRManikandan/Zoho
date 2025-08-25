from rest_framework import serializers
from .models import Warehouse, InventoryTransaction, StockTransfer, StockTransferItem


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = (
            'id', 'organization', 'name', 'address', 'contact_person', 'phone', 'email', 'is_active', 'created_at'
        )
        read_only_fields = ('created_at',)


class InventoryTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryTransaction
        fields = (
            'id', 'organization', 'warehouse', 'item', 'transaction_type', 'quantity', 'unit_cost', 'reference',
            'notes', 'transaction_date'
        )
        read_only_fields = ('transaction_date',)


class StockTransferItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransferItem
        fields = (
            'id', 'item', 'quantity', 'notes'
        )


class StockTransferSerializer(serializers.ModelSerializer):
    items = StockTransferItemSerializer(many=True)

    class Meta:
        model = StockTransfer
        fields = (
            'id', 'organization', 'transfer_number', 'from_warehouse', 'to_warehouse', 'transfer_date', 'status',
            'notes', 'created_by', 'created_at', 'items'
        )
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        transfer = StockTransfer.objects.create(**validated_data)
        for item in items_data:
            StockTransferItem.objects.create(transfer=transfer, **item)
        return transfer

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                StockTransferItem.objects.create(transfer=instance, **item)
        return instance


