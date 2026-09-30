from django.urls import path
from .employer_views import EmployerJobsView, EmployerApplicationsView

urlpatterns = [
    path('jobs/', EmployerJobsView.as_view(), name='employer_jobs'),
    path('applications/', EmployerApplicationsView.as_view(), name='employer_applications'),
]
