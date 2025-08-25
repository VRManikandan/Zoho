from django.db import models
from accounts.models import Organization, User
from contacts.models import Customer

class Project(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=200)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    actual_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    project_manager = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "projects"
        indexes = [models.Index(fields=["project_name", "status"])]

class TimeEntry(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField()
    is_billable = models.BooleanField(default=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "time_entries"
        indexes = [models.Index(fields=["date", "project"])]

class ProjectExpense(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    expense_date = models.DateField()
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_billable = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "project_expenses"
