from django.db import models
from django.utils import timezone
import random

# Create your models here.
class CommunityMessage(models.Model):
    name = models.CharField(max_length=50)
    text = models.TextField(max_length=200)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(default=timezone.now)
        
    class Meta:
        ordering = ['created_at']
        
    def __str__(self):
        return f"{self.name}: {self.text[:50]}"
