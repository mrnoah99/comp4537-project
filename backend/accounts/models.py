from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    api_calls = models.IntegerField(default=0)

    def __str__(self):
        return self.username

class APIUsage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    endpoint = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    count = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'endpoint', 'method')

    def __str__(self):
        return f"{self.user.username} - {self.endpoint} ({self.method})"
