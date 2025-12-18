from django.contrib import admin

from projects.models import Project, ProjectFiles

# Register your models here.
admin.site.register(Project)
admin.site.register(ProjectFiles)