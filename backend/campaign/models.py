from django.db import models
from django.core.exceptions import ValidationError

class Campaign(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    project_id = models.IntegerField()
    user_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.target_amount < 0:
            raise ValidationError('Goal amount cannot be negative')

    def __str__(self):
        return self.title
    
    
