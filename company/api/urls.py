from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.CompanyList.as_view(), name='company-list'),
]