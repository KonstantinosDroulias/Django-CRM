from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.shortcuts import render

from todo.models import Todo


# Create your views here.
@login_required
def index(request: HttpRequest):
    todos = Todo.objects.filter(user=request.user)
    context = {
        'todos': todos,
    }
    return render(request, 'dashboard/index.html', context)