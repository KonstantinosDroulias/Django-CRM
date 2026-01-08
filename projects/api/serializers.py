from rest_framework import serializers
from projects.models import *

class ProjectStagesSerializers(serializers.ModelSerializer):

    class Meta:
        model = ProjectStage
        fields = ['id', 'name']

class ProjectsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'description',
            'price',
            'priority',
            'stage',
            'contributed',
            'customers',
            'company',
            'updated_at'
        ]