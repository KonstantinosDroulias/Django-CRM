from django.contrib.auth.decorators import login_required
from django.http import HttpRequest
from django.shortcuts import render

from todo.models import Todo
from django.contrib.auth.models import User

# Create your views here.
@login_required
def index(request: HttpRequest):
    user = request.user
    if user.has_perm('auth.add_user'):
        users = User.objects.all()

        admin_context = {
            'users': users,
            'user': user
        }

        # 2. Render the ADMIN template
        return render(request, 'dashboard/admin.html', admin_context)

    else:
        todos = Todo.objects.filter(user=user)

        employee_context = {
            'todos': todos,
        }

        return render(request, 'dashboard/index.html', employee_context)