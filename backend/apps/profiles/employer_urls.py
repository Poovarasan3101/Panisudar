from django.urls import path
from .employer_views import (
    EmployerProfileView,
    EmployerJobsView,
    EmployerJobDetailView,
    EmployerJobToggleStatusView,
    EmployerApplicationsView,
)

urlpatterns = [
    path('profile/', EmployerProfileView.as_view(), name='employer_profile'),
    path('jobs/', EmployerJobsView.as_view(), name='employer_jobs'),
    path('jobs/<int:pk>/', EmployerJobDetailView.as_view(), name='employer_job_detail'),
    path('jobs/<int:pk>/toggle/', EmployerJobToggleStatusView.as_view(), name='employer_job_toggle'),
    path('applications/', EmployerApplicationsView.as_view(), name='employer_applications'),
]
