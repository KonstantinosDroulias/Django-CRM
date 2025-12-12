from django.urls import path
from . import views

urlpatterns = [
    path('customers', views.index, name='index'),
    path('customer/<int:pk>', views.customer, name='customer'),
]