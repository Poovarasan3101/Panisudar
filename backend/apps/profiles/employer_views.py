from rest_framework import generics, permissions
from apps.jobs.models import Job
from apps.jobs.serializers import JobSerializer
from .models import Application
from .serializers import ApplicationSerializer

class EmployerJobsView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(posted_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

class EmployerApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(job__posted_by=self.request.user).order_by('-applied_at')
