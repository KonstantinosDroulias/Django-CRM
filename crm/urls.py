"""
URL configuration for crm project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

from django.conf import settings
from users.views import ClerioLoginView
from django.conf.urls import handler403, handler404

handler403 = 'core.views.error_403'
handler404 = 'core.views.error_404'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')),
    path('login/', ClerioLoginView.as_view(), name='login'),
    path('', include('core.urls')),
    path('', include('users.urls')),
    path('', include('dashboard.urls')),
    path('', include('todo.urls')),
    path('', include('company.urls')),
    path('api/v1/companies/', include('company.api.urls')),
    path('', include('customers.urls')),
    path('api/v1/customers/', include('customers.api.urls')),
    path('api/v1/users/', include('users.api.urls')),
    path('', include('projects.urls')),
    path('api/v1/projects/', include('projects.api.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
