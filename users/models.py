from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Roles(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=255)
    role = models.ForeignKey(Roles, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.user.username}, {self.phone_number}, {self.role}"
