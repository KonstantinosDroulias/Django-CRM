from django.contrib import admin

from projects.models import Project, ProjectFile, ProjectStage

# Register your models here.
admin.site.register(Project)
admin.site.register(ProjectFile)
admin.site.register(ProjectStage)