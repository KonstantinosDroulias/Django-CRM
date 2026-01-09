from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from company.api.serializers import CompanySerializer
from company.models import Company


class CompanyList(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()