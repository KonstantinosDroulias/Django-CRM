from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages

from django.contrib.auth.views import LoginView

class ClerioLoginView(LoginView):
    template_name = "registration/login.html"
    redirect_authenticated_user = True
