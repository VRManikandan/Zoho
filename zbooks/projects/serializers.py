from rest_framework import serializers
from .models import Project, TimeEntry, ProjectExpense


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            'id', 'organization', 'project_name', 'customer', 'description', 'start_date', 'end_date', 'status',
            'budget', 'actual_cost', 'project_manager', 'created_at'
        )
        read_only_fields = ('created_at',)


class TimeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeEntry
        fields = (
            'id', 'organization', 'project', 'user', 'date', 'start_time', 'end_time', 'hours', 'description',
            'is_billable', 'hourly_rate', 'created_at'
        )
        read_only_fields = ('created_at',)


class ProjectExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectExpense
        fields = (
            'id', 'organization', 'project', 'expense_date', 'description', 'amount', 'is_billable', 'created_by',
            'created_at'
        )
        read_only_fields = ('created_at',)


