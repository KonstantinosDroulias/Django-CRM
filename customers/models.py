from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Source(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class LeadStatus(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=100)
    source = models.OneToOneField(Source, on_delete=models.CASCADE)
    lead_status = models.ForeignKey(LeadStatus, on_delete=models.CASCADE)
    assigned_to = models.ManyToManyField(User)
    last_contact = models.DateField()
    next_contact = models.DateField()
    value = models.DecimalField(decimal_places=2, max_digits=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name}, {self.last_name}"
