from django.shortcuts import render, redirect, get_object_or_404
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, Group
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from django.contrib.auth.views import LoginView

from users.models import Profile


class ClerioLoginView(LoginView):
    template_name = "registration/login.html"
    redirect_authenticated_user = True


@login_required
def update_user(request, pk):
    user_to_edit = get_object_or_404(User, id=pk)

    if request.method == 'POST':
        if request.POST.get('action') == 'delete':
            user_to_edit.delete()
            return redirect('/')

        user_to_edit.username = request.POST.get('username')
        user_to_edit.email = request.POST.get('email')
        user_to_edit.first_name = request.POST.get('first_name')
        user_to_edit.last_name = request.POST.get('last_name')

        # --- FIX STARTS HERE ---
        # Only touch is_active if the current user is an Admin (has permission)
        # Otherwise, leave it exactly as it is in the database.
        if request.user.has_perm('auth.add_user'):
            user_to_edit.is_active = request.POST.get('is_active') == 'on'
        # --- FIX ENDS HERE ---

        user_to_edit.save()

        # Update Profile
        profile, created = Profile.objects.get_or_create(user=user_to_edit)
        profile.phone_number = request.POST.get('phone')

        if request.FILES.get('image'):
            profile.avatar = request.FILES.get('image')

        profile.save()

        # Update Role (Only Admins should probably do this too, but leaving as is for now)
        group_id = request.POST.get('groups')
        if group_id:
            user_to_edit.groups.clear()
            group = Group.objects.get(id=group_id)
            user_to_edit.groups.add(group)

        messages.success(request, "User updated successfully.")
        return redirect('/')

    # ... GET logic remains the same ...
    all_groups = Group.objects.all()
    user_group_ids = list(user_to_edit.groups.values_list('id', flat=True))

    context = {
        'user_obj': user_to_edit,
        'all_groups': all_groups,
        'user_group_ids': user_group_ids,
    }
    return render(request, 'users/settings.html', context)


@login_required
def add_user(request):
    if not request.user.has_perm('auth.add_user'):
        return render(request, '403.html', status=403)

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        group_id = request.POST.get('groups')
        phone = request.POST.get('phone')

        # Files (Images) come from request.FILES
        avatar = request.FILES.get('image')

        is_active = request.POST.get('is_active') == 'on'

        # B. Backend Validation
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken.")
            return redirect('add_user')

        new_user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=is_active
        )
        new_user.set_password(password)
        new_user.save()


        profile, created = Profile.objects.get_or_create(user=new_user)
        profile.phone_number = phone
        if avatar:
            profile.avatar = avatar
        profile.save()

        if group_id:
            group = Group.objects.get(id=group_id)
            new_user.groups.add(group)

        return redirect('/')  # Redirect to Dashboard

    all_groups = Group.objects.all()

    context = {
        'all_groups': all_groups,
    }
    return render(request, 'users/add_user.html', context)


