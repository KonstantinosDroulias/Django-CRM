from rest_framework import viewsets, generics
from projects.models import *
from .serializers import ProjectStagesSerializers, ProjectsSerializer
from rest_framework.permissions import IsAuthenticated

class ProjectStages(generics.ListAPIView):
    queryset = ProjectStage.objects.all()
    serializer_class = ProjectStagesSerializers
    permission_classes = [IsAuthenticated]

class ProjectList(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()