from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.CustomerList.as_view(), name='customer-list'),
    path('<int:pk>/', views.CustomerDetailView.as_view(), name='customer-update'),
]