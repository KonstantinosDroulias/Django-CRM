from django.contrib.auth.models import User
from django.db import models
from company.models import Company
from customers.models import Customer

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    contributed = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

def project_file_path(instance, filename):
    return f"projects/{instance.project.name}/{filename}"

class ProjectFiles(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to=project_file_path)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name