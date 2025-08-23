from django.db import models

class BankAccount(models.Model):
    account_name = models.CharField(max_length=150)
    bank_name = models.CharField(max_length=150)
    account_number = models.CharField(max_length=50, unique=True)
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)
    opening_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bank_accounts"

class BankTransaction(models.Model):
    TYPE = (("credit","credit"),("debit","debit"))
    bank = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name="transactions")
    transaction_date = models.DateField()
    type = models.CharField(max_length=10, choices=TYPE)
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    reconciled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bank_transactions"
        indexes = [models.Index(fields=["transaction_date","reconciled"])]

class Reconciliation(models.Model):
    account = models.ForeignKey(BankAccount, on_delete=models.CASCADE)
    reconciliation_date = models.DateField()
    statement_balance = models.DecimalField(max_digits=12, decimal_places=2)
    cleared_balance = models.DecimalField(max_digits=12, decimal_places=2)
    difference = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reconciliations"
