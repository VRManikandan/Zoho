from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class Organization(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    gst_number = models.CharField(max_length=50, blank=True, null=True)
    pan_number = models.CharField(max_length=20, blank=True, null=True)
    currency = models.CharField(max_length=10, default="INR")
    fiscal_year_start = models.DateField()
    timezone = models.CharField(max_length=50, default="Asia/Kolkata")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "organizations"

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (("admin","admin"),("accountant","accountant"),("user","user"))
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    objects = UserManager()

    class Meta:
        db_table = "users"
        indexes = [models.Index(fields=["email"])]

class ChartOfAccounts(models.Model):
    ACCOUNT_TYPES = (
        ('asset', 'Asset'),
        ('liability', 'Liability'),
        ('equity', 'Equity'),
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    account_code = models.CharField(max_length=20, unique=True)
    account_name = models.CharField(max_length=200)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    parent_account = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    opening_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chart_of_accounts"
        indexes = [models.Index(fields=["account_code", "account_type"])]

class JournalEntry(models.Model):
    ENTRY_TYPES = (
        ('manual', 'Manual Entry'),
        ('system', 'System Generated'),
        ('recurring', 'Recurring Entry'),
    )
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    entry_number = models.CharField(max_length=50, unique=True)
    entry_date = models.DateField()
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPES, default='manual')
    reference = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    total_debit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_credit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    is_posted = models.BooleanField(default=False)
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    posted_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_entries')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "journal_entries"
        indexes = [models.Index(fields=["entry_number", "entry_date", "is_posted"])]

class JournalEntryLine(models.Model):
    entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='lines')
    account = models.ForeignKey(ChartOfAccounts, on_delete=models.CASCADE)
    description = models.TextField()
    debit_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    credit_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "journal_entry_lines"
