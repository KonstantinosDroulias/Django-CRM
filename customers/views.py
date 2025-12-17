import json
from decimal import Decimal, InvalidOperation

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST

from company.models import Company
from customers.models import LeadStatus, Source, Customer, Note


# Create your views here.

def index(request):
    lead_status = list(LeadStatus.objects.values('id', 'name'))
    sources = Source.objects.all()
    customers = Customer.objects.all()
    companies = Company.objects.filter(customer__in=customers).distinct()

    context = {
        'lead_status': lead_status,  # Now this is a list, so json_script won't crash
        'sources': sources,
        'customers': customers,
        'companies': companies,
    }
    return render(request, 'customers/index.html', context)

def customer(request, pk):
    lead_status = LeadStatus.objects.all()
    sources = Source.objects.all()
    customer = Customer.objects.get(id=pk)
    notes = Note.objects.all()
    users = User.objects.all()
    context = {
        'lead_status': lead_status,
        'sources': sources,
        'customer': customer,
        'users': users,
        'notes': notes,
    }
    return render(request, 'customers/single.html', context)

@require_POST
@login_required
def delete_customer(request, pk):
    customer = Customer.objects.get(id=pk)
    customer.delete()
    return redirect('/customers')
