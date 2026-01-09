from django.contrib.auth.models import User
from django.db import models

from company.models import Company


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

class Note(models.Model):
    customer = models.ForeignKey('Customer', related_name='notes', on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.title

class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=100)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=100, null=True, blank=True)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    lead_status = models.ForeignKey(LeadStatus, on_delete=models.CASCADE)
    assigned_to = models.ManyToManyField(User)
    last_contact = models.DateField(null=True, blank=True)
    next_contact = models.DateField(null=True, blank=True)
    value = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True, default=0)
    files = models.FileField('customer/files', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

def customer_file_path(instance, filename):
    return f"customers/{instance.customer.id}_{instance.customer.last_name}/{filename}"

class CustomerFiles(models.Model):
    customer = models.ForeignKey(Customer, related_name='uploaded_files', on_delete=models.CASCADE)
    file = models.FileField(upload_to=customer_file_path)
    created_at = models.DateTimeField(auto_now_add=True)