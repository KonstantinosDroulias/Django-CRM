from django.contrib import admin
from django.contrib.auth.models import User
from .models import Customer, LeadStatus, Source

# Register your models here.
admin.site.register(Customer)
admin.site.register(LeadStatus)
admin.site.register(Source)