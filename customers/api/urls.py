from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.CustomerList.as_view(), name='customer-list'),
    #path('create', views.CustomerCreate.as_view(), name='customer-create'),
    #path('<int:pk>', views.CustomerDetail.as_view(), name='customer-detail'),
    #path('<int:pk>/update', views.CustomerUpdate.as_view(), name='customer-update'),
    #path('<int:pk>/delete', views.CustomerDelete.as_view(), name='customer-delete'),
]