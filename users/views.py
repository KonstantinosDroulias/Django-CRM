from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        # Authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Correct username & password
            login(request, user)
            return redirect("dashboard")
        else:
            # Authentication failed
            messages.error(request, "Invalid username or password")

    return render(request, "users/login.html")
