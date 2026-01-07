from rest_framework import serializers
from projects.models import *

class ProjectStagesSerializers(serializers.ModelSerializer):

    class Meta:
        model = ProjectStage
        fields = ['id', 'name']
