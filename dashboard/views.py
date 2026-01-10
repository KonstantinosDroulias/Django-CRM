from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.http import HttpRequest
from django.shortcuts import render

from customers.models import Customer
from projects.models import Project
from todo.models import Todo
from django.contrib.auth.models import User

# Create your views here.
@login_required
def index(request):
    user = request.user

    if user.has_perm('company.change_company') or user.is_superuser:
        customers_qs = Customer.objects.all()
        projects_qs = Project.objects.all()
    else:
        customers_qs = Customer.objects.filter(assigned_to=user)
        projects_qs = Project.objects.filter(contributed=user)

    customers_count = customers_qs.count()
    projects_count = projects_qs.count()

    revenue_val = projects_qs.aggregate(total=Sum('price'))['total']
    total_revenue = revenue_val if revenue_val is not None else 0

    context = {
        'todos': Todo.objects.filter(user=user),
        'stats': {
            'customers': customers_count,
            'projects': projects_count,
            'revenue': total_revenue,
        }
    }

    if user.has_perm('auth.add_user'):
        context['users'] = User.objects.all()
        return render(request, 'dashboard/admin.html', context)

    return render(request, 'dashboard/index.html', context)