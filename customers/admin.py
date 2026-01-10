from django.contrib import admin
from django.contrib.auth.models import User
from django.db.models.functions import Lead

from .models import Customer, LeadStatus, Source, CustomerFiles

# Register your models here.
admin.site.register(Customer)
admin.site.register(LeadStatus)
admin.site.register(Source)
admin.site.register(CustomerFiles)