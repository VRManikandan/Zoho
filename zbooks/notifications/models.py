from django.db import models

class Notification(models.Model):
    org_id = models.IntegerField()
    user_id = models.IntegerField()
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=[('read','Read'),('unread','Unread')], default='unread')
    created_at = models.DateTimeField(auto_now_add=True)

class Reminder(models.Model):
    org_id = models.IntegerField()
    type = models.CharField(max_length=50)
    customer_id = models.IntegerField()
    related_id = models.IntegerField()  # could be invoice/payment/etc.
    reminder_date = models.DateField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
