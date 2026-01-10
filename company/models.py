from django.db import models

# Create your models here.
class Company(models.Model):
    logo = models.ImageField(upload_to='companies/logos/',null=True, blank=True)
    company_name = models.CharField(max_length=100, unique=True)
    vat_id = models.CharField(max_length=100)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name}"