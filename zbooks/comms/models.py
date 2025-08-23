from django.db import models
from django.conf import settings
from sales.models import Invoice

class Notification(models.Model):
    TYPE = (("invoice","invoice"),("payment","payment"),("expense","expense"),("system","system"))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=30, choices=TYPE, default="system")
    status = models.CharField(max_length=20, default="unread")  # unread/read
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"

class Reminder(models.Model):
        TYPE = (("payment_due","payment_due"),("invoice_overdue","invoice_overdue"),("custom","custom"))
        invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, null=True, blank=True)
        reminder_type = models.CharField(max_length=30, choices=TYPE, default="custom")
        reminder_date = models.DateField()
        status = models.CharField(max_length=20, default="pending")  # pending/sent
        created_at = models.DateTimeField(auto_now_add=True)

        class Meta:
            db_table = "reminders"
