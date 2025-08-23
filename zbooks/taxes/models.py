from django.db import models

class Tax(models.Model):
    org_id = models.IntegerField()
    name = models.CharField(max_length=100)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    type = models.CharField(max_length=10, choices=[('inclusive','Inclusive'),('exclusive','Exclusive')])
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
