from django.db import models
from django.utils import timezone

class Reminder(models.Model):
    org_id = models.IntegerField()
    type = models.CharField(max_length=50)
    customer_id = models.IntegerField(blank=True, null=True)
    related_id = models.IntegerField(blank=True, null=True)
    reminder_date = models.DateField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('sent', 'Sent')], default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Reminder {self.id}'
