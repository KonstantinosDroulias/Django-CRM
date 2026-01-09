from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from customers.models import Customer
from .serializers import CustomerSerializer, CustomerUpdateSerializer


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CustomerUpdateSerializer

        return CustomerSerializer