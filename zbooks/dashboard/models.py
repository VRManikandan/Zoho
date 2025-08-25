from django.db import models
from accounts.models import Organization

class DashboardWidget(models.Model):
    WIDGET_TYPES = (
        ('chart', 'Chart'),
        ('metric', 'Metric'),
        ('table', 'Table'),
        ('list', 'List'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    width = models.IntegerField(default=6)
    height = models.IntegerField(default=4)
    config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "dashboard_widgets"
        indexes = [models.Index(fields=["organization", "is_active"])]

class Report(models.Model):
    REPORT_TYPES = (
        ('financial', 'Financial'),
        ('sales', 'Sales'),
        ('purchase', 'Purchase'),
        ('inventory', 'Inventory'),
        ('custom', 'Custom'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField(blank=True, null=True)
    query_config = models.JSONField()
    schedule = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reports"
        indexes = [models.Index(fields=["organization", "report_type"])]
