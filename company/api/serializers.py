from rest_framework import serializers
from company.models import *

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'logo', 'company_name', 'vat_id']