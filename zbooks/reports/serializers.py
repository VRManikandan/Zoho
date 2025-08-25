from rest_framework import serializers
from .models import FinancialStatement, ReportTemplate, ScheduledReport


class FinancialStatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialStatement
        fields = (
            'id', 'organization', 'statement_type', 'period_start', 'period_end', 'generated_at', 'data', 'is_final'
        )
        read_only_fields = ('generated_at',)


class ReportTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTemplate
        fields = (
            'id', 'organization', 'name', 'description', 'template_type', 'config', 'is_default', 'created_at'
        )
        read_only_fields = ('created_at',)


class ScheduledReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledReport
        fields = (
            'id', 'organization', 'name', 'report_type', 'frequency', 'recipients', 'last_run', 'next_run',
            'is_active', 'created_at'
        )
        read_only_fields = ('created_at',)


