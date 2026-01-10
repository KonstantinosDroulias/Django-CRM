from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.shortcuts import render, get_object_or_404, redirect

from company.models import Company
from customers.models import Customer
from projects.models import Project


@login_required
def single(request, pk):
    if request.user.has_perm('auth.add_user'):
        return render(request, '403.html', status=403)

    company = get_object_or_404(Company, pk=pk)
    if request.method == 'POST':

        if request.POST.get('action') == 'delete':
            company.delete()
            return redirect('/')

        company.company_name = request.POST.get('company-name')
        company.vat_id = request.POST.get('vat-id')

        if request.FILES.get('logo'):
            company.logo = request.FILES['logo']

        company.save()

        return redirect(request.path)

    customers = Customer.objects.filter(company=company)
    projects = Project.objects.filter(customers__company=company).distinct()

    aggregation = projects.aggregate(total_value=Sum('price')) # AI
    total_value = aggregation['total_value'] or 0  # AI

    context = {
        'company': company,
        'projects': projects,
        'total_value': total_value,
        'customers': customers,
    }
    return render(request, 'company/single.html', context)