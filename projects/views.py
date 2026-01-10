from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.shortcuts import render

from customers.models import Customer
from projects.models import Project, ProjectStage


# Create your views here.
@login_required
def index(request):
    if request.user.has_perm('auth.add_user'):
        return render(request, '403.html', status=403)
    projects = Project.objects.all()
    stages = ProjectStage.objects.all()
    context = {
        'projects': projects,
        'stages': stages,
    }
    return render(request, 'projects/index.html', context)
@login_required
def single(request, project_id):
    if request.user.has_perm('auth.add_user'):
        return render(request, '403.html', status=403)
    project = Project.objects.get(id=project_id)
    context = {
        'project': project,
    }
    return render(request, 'projects/single.html', context)