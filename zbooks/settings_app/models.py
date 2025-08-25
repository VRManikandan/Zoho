from django.db import models
from accounts.models import Organization

class SystemSetting(models.Model):
    SETTING_TYPES = (
        ('general', 'General'),
        ('financial', 'Financial'),
        ('email', 'Email'),
        ('notification', 'Notification'),
        ('integration', 'Integration'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    setting_key = models.CharField(max_length=100)
    setting_value = models.TextField()
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES)
    description = models.TextField(blank=True, null=True)
    is_encrypted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "system_settings"
        unique_together = ['organization', 'setting_key']
        indexes = [models.Index(fields=["organization", "setting_type"])]

class EmailTemplate(models.Model):
    TEMPLATE_TYPES = (
        ('invoice', 'Invoice'),
        ('estimate', 'Estimate'),
        ('payment_reminder', 'Payment Reminder'),
        ('welcome', 'Welcome'),
        ('password_reset', 'Password Reset'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "email_templates"
        unique_together = ['organization', 'template_type']

class WorkflowRule(models.Model):
    RULE_TYPES = (
        ('approval', 'Approval'),
        ('notification', 'Notification'),
        ('automation', 'Automation'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    conditions = models.JSONField()
    actions = models.JSONField()
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "workflow_rules"
        indexes = [models.Index(fields=["organization", "rule_type", "priority"])]
