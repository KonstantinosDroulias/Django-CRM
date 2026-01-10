from rest_framework import serializers
from customers.models import *
from company.models import *

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'group']

    def get_avatar(self, obj):
        if hasattr(obj, 'profile') and obj.profile.avatar:
            return obj.profile.avatar.url
        return "/static/img/default-avatar.png"

    def get_group(self, obj):
        if obj.groups.exists():
            return obj.groups.first().name
        return "Employee"

# Ai generated - Then I leaned to do my own
class CustomerSerializer(serializers.ModelSerializer):

    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    vat_id = serializers.CharField(write_only=True, required=False, allow_blank=True)

    company_display_name = serializers.CharField(source='company.company_name', read_only=True)

    source_name = serializers.CharField(source='source.name', read_only=True)
    lead_status_name = serializers.CharField(source='lead_status.name', read_only=True)
    assigned_users = UserSerializer(source='assigned_to', many=True, read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('id', 'assigned_to')

    def create(self, validated_data):
        comp_name_input = validated_data.pop('company_name', None)
        comp_vat_input = validated_data.pop('vat_id', None)

        company_instance = None
        if comp_name_input:
            # FIX 2: Change 'name=' to 'company_name=' inside get_or_create
            company_instance, created = Company.objects.get_or_create(
                company_name=comp_name_input,
                defaults={'vat_id': comp_vat_input}
            )

        validated_data['company'] = company_instance

        customer = super().create(validated_data)

        user = self.context['request'].user
        customer.assigned_to.add(user)

        return customer


# Updated to allow files is Ai generated.
class CustomerUpdateSerializer(serializers.ModelSerializer):
    files = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Customer
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'address', 'city', 'state', 'country', 'zip_code',
            'source', 'lead_status', 'company',
            'last_contact', 'next_contact', 'value',
            'files'
        ]
        read_only_fields = ['created_at', 'updated_at', 'assigned_to']

    def update(self, instance, validated_data):
        files_data = validated_data.pop('files', None)

        customer = super().update(instance, validated_data)

        if files_data:
            for file_item in files_data:
                CustomerFiles.objects.create(customer=customer, file=file_item)

        return customer