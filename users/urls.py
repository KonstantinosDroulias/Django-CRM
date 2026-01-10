from django.urls import path
from . import views

urlpatterns = [
    path('user/<int:pk>/', views.update_user, name='update_user'),
    path('user/add/', views.add_user, name='add-user'),
]