from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from customers.models import Customer
from .serializers import CustomerSerializer


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]