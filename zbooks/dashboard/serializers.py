from rest_framework import serializers
from .models import DashboardWidget, Report


class DashboardWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardWidget
        fields = (
            'id', 'organization', 'name', 'widget_type', 'position_x', 'position_y', 'width', 'height', 'config',
            'is_active', 'created_at'
        )
        read_only_fields = ('created_at',)


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = (
            'id', 'organization', 'name', 'report_type', 'description', 'query_config', 'schedule', 'is_active',
            'created_at'
        )
        read_only_fields = ('created_at',)


