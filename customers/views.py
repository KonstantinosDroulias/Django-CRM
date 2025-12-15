import json
from decimal import Decimal, InvalidOperation

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from company.models import Company
from customers.models import LeadStatus, Source, Customer


# Create your views here.

def index(request):
    lead_status = LeadStatus.objects.all()
    sources = Source.objects.all()
    customers = Customer.objects.all()
    companies = Company.objects.filter(customer__in=customers).distinct()
    context = {
        'lead_status': lead_status,
        'sources': sources,
        'customers': customers,
        'companies': companies,
    }
    return  render(request, 'customers/index.html', context)

def customer(request, pk):
    lead_status = LeadStatus.objects.filter(id=pk)
    sources = Source.objects.filter(id=pk)
    customer = Customer.objects.get(id=pk)
    users = User.objects.all()
    context = {
        'lead_status': lead_status,
        'sources': sources,
        'customer': customer,
        'users': users,
    }
    return render(request, 'customers/single.html', context)

@require_POST
@login_required
@transaction.atomic
def add_customer(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.decoder.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    customer_data = data.get('customer_data', {})
    company_data = data.get('company_data')

    # CHATGPT Helped me on the code below
    first_name = (customer_data.get("first_name", "") or "").strip()
    last_name = (customer_data.get("last_name", "") or "").strip()
    email = (customer_data.get("email", "") or "").strip()
    phone_number = (customer_data.get("phone_number", "") or "").strip()

    source_id = customer_data.get("source_id")
    lead_status_id = customer_data.get("lead_status_id")

    raw_value = customer_data.get("value", None)

    # --- Validate required fields ---
    errors = {}

    if not first_name:
        errors["first_name"] = "First name is required."
    if not last_name:
        errors["last_name"] = "Last name is required."

    # At least one contact method (optional rule; remove if you want)
    if not email and not phone_number:
        errors["contact"] = "Provide at least email or phone."

    if not source_id:
        errors["source_id"] = "Source is required."
    if not lead_status_id:
        errors["lead_status_id"] = "Lead status is required."

    # Parse decimal (optional)
    value = None
    if raw_value not in (None, ""):
        try:
            value = Decimal(str(raw_value))
        except (InvalidOperation, ValueError):
            errors["value"] = "Value must be a valid number."

    if errors:
        return JsonResponse({"errors": errors}, status=400)

    # --- Load FK objects (or use *_id assignment if you prefer) ---
    try:
        source = Source.objects.get(id=source_id)
    except Source.DoesNotExist:
        return JsonResponse({"errors": {"source_id": "Invalid source."}}, status=400)

    try:
        lead_status = LeadStatus.objects.get(id=lead_status_id)
    except LeadStatus.DoesNotExist:
        return JsonResponse({"errors": {"lead_status_id": "Invalid lead status."}}, status=400)

    # --- Optional company creation ---
    company_obj = None
    if company_data:
        company_name = (company_data.get("name", "") or "").strip()
        vat_id = (company_data.get("vat_id", "") or "").strip()

        if not company_name:
            return JsonResponse({"errors": {"company.name": "Company name is required."}}, status=400)

        company_obj = Company.objects.create(
            name=company_name,
            vat_id=vat_id if vat_id else None,
        )

    # --- Create customer ---
    customer = Customer.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone_number=phone_number,
        value=value,
        source=source,
        lead_status=lead_status,
        company=company_obj,  # nullable FK
    )

    customer.assigned_to.add(request.user)

    return JsonResponse(
        {
            "id": customer.id,
            "company_id": company_obj.id if company_obj else None,
            "message": "Customer created successfully.",
        },
        status=201,
    )
