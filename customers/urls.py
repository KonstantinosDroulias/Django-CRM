from django.urls import path
from . import views

urlpatterns = [
    path('customers', views.index, name='index'),
    path('customer/<int:pk>', views.customer, name='customer'),
    path('customer/<int:pk>/delete', views.delete_customer, name='delete_customer'),
]