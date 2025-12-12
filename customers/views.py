from django.shortcuts import render

from customers.models import LeadStatus, Source, Customer


# Create your views here.

def index(request):
    lead_status = LeadStatus.objects.all()
    sources = Source.objects.all()
    customers = Customer.objects.all()
    context = {
        'lead_status': lead_status,
        'sources': sources,
        'customers': customers,
    }
    return  render(request, 'customers/index.html', context)

def customer(request, pk):
    lead_status = LeadStatus.objects.filter(id=pk)
    sources = Source.objects.filter(id=pk)
    customer = Customer.objects.get(id=pk)
    context = {
        'lead_status': lead_status,
        'sources': sources,
        'customer': customer,
    }
    return render(request, 'customers/single.html', context)