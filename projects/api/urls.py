from django.urls import path
from . import views

urlpatterns = [
    path('stages/', views.ProjectStages.as_view(), name='project-stages'),
    path('', views.ProjectList.as_view(), name='project-list'),
]