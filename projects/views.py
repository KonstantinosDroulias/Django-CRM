from django.shortcuts import render

from customers.models import Customer
from projects.models import Project, ProjectNote, ProjectStage


# Create your views here.

def index(request):
    projects = Project.objects.all()
    stages = ProjectStage.objects.all()
    context = {
        'projects': projects,
        'stages': stages,
    }
    return render(request, 'projects/index.html', context)

def single(request, project_id):
    project = Project.objects.get(id=project_id)
    notes = ProjectNote.objects.filter(project=project)
    context = {
        'project': project,
        'notes': notes,
    }
    return render(request, 'projects/single.html', context)