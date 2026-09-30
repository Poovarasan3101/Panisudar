from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/jobs/', include('apps.jobs.urls')),
    path('api/companies/', include('apps.companies.urls')),
    path('api/job-seekers/', include('apps.profiles.seeker_urls')),
    path('api/employers/', include('apps.profiles.employer_urls')),
    path('api/applications/', include('apps.applications.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/ai-resume/', include('apps.ai_resume.urls')),
    path('api/chat/', include('apps.accounts.chat_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
