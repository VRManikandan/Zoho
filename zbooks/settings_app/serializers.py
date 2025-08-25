from rest_framework import serializers
from .models import SystemSetting, EmailTemplate, WorkflowRule


class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = (
            'id', 'organization', 'setting_key', 'setting_value', 'setting_type', 'description', 'is_encrypted',
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')


class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = (
            'id', 'organization', 'template_type', 'subject', 'body', 'is_active', 'created_at'
        )
        read_only_fields = ('created_at',)


class WorkflowRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowRule
        fields = (
            'id', 'organization', 'name', 'rule_type', 'conditions', 'actions', 'is_active', 'priority', 'created_at'
        )
        read_only_fields = ('created_at',)


