from django.urls import path
from .seeker_views import JobSeekerProfileView, SeekerApplicationsView, SeekerSavedJobsView

urlpatterns = [
    path('profile/', JobSeekerProfileView.as_view(), name='seeker_profile'),
    path('applications/', SeekerApplicationsView.as_view(), name='seeker_applications'),
    path('saved-jobs/', SeekerSavedJobsView.as_view(), name='seeker_saved_jobs'),
]
