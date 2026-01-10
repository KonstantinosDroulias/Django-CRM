from django.urls import path
from . import views

urlpatterns = [
    path('company/<int:pk>', views.single, name='company'),
]