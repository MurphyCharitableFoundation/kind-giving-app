from django.db import models
from django.core.exceptions import ValidationError
from djmoney.models.fields import MoneyField

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

class Campaign(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)  
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)  
    target_amount = MoneyField(max_digits=10, decimal_places=2, default_currency='USD')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.target_amount < 0:
            raise ValidationError('Target amount cannot be negative')
        if self.target_amount.amount < 0:
            raise ValidationError('Target amount cannot be negative')

    def __str__(self):
        return self.title
