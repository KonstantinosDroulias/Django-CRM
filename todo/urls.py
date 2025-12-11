from django.urls import path
from . import views

urlpatterns = [
    # ... your other views
    path("api/todos/add", views.create_todo, name="create_todo"),
    path("api/todos/<int:pk>/delete/", views.delete_todo, name="delete_todo"),
]