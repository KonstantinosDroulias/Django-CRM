from rest_framework import viewsets, generics
from projects.models import *
from .serializers import ProjectStagesSerializers
from rest_framework.permissions import IsAuthenticated

class ProjectStages(generics.ListAPIView):
    queryset = ProjectStage.objects.all()
    serializer_class = ProjectStagesSerializers
    permission_classes = [IsAuthenticated]