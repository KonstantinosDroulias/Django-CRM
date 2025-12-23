from django.contrib.auth.models import User
from django.db import models
from company.models import Company
from customers.models import Customer

# Create your models here.
class ProjectStage(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    stage = models.ForeignKey(ProjectStage, on_delete=models.CASCADE)
    contributed = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    customers = models.ManyToManyField(Customer)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)

    #The priority was Ai generated in attempt to learn how to add enum database column
    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.LOW
    )

    def __str__(self):
        return self.name

def project_file_path(instance, filename):
    return f"projects/{instance.project.name}/{filename}"

class ProjectNote(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProjectFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to=project_file_path)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name