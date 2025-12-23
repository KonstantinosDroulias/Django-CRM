from django.urls import path
from . import views

urlpatterns = [
    path('projects', views.index, name='projects'),
    path('project/<int:project_id>', views.single, name='project'),
]