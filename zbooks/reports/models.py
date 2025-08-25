from django.db import models
from accounts.models import Organization

class FinancialStatement(models.Model):
    STATEMENT_TYPES = (
        ('profit_loss', 'Profit & Loss'),
        ('balance_sheet', 'Balance Sheet'),
        ('cash_flow', 'Cash Flow'),
        ('trial_balance', 'Trial Balance'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    statement_type = models.CharField(max_length=20, choices=STATEMENT_TYPES)
    period_start = models.DateField()
    period_end = models.DateField()
    generated_at = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()
    is_final = models.BooleanField(default=False)

    class Meta:
        db_table = "financial_statements"
        indexes = [models.Index(fields=["organization", "statement_type", "period_start"])]

class ReportTemplate(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    template_type = models.CharField(max_length=50)
    config = models.JSONField()
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "report_templates"
        indexes = [models.Index(fields=["organization", "template_type"])]

class ScheduledReport(models.Model):
    FREQUENCY_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=50)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    recipients = models.JSONField()
    last_run = models.DateTimeField(null=True, blank=True)
    next_run = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scheduled_reports"
        indexes = [models.Index(fields=["organization", "next_run", "is_active"])]
