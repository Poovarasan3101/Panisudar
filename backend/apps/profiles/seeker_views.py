from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from .models import JobSeekerProfile, Application, SavedJob
from .serializers import JobSeekerProfileSerializer, ApplicationSerializer, SavedJobSerializer

import logging

logger = logging.getLogger(__name__)

class JobSeekerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = JobSeekerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        profile, created = JobSeekerProfile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            logger.warning(f"Profile update validation error for {request.user}: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)

class SeekerApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user).order_by('-applied_at')

class SeekerSavedJobsView(generics.ListCreateAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        job_id = request.data.get('job') or request.data.get('jobId') or request.data.get('job_id')
        if not job_id:
            return Response({'error': 'Job ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            job = Job.objects.get(id=job_id)
        except (Job.DoesNotExist, ValueError):
            return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        serializer = self.get_serializer(saved_job)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class SeekerSavedJobDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, job_id=None, *args, **kwargs):
        if not job_id:
            return Response({'error': 'Job ID required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        deleted, _ = SavedJob.objects.filter(user=request.user, job_id=job_id).delete()
        return Response({'saved': False, 'deleted': deleted > 0}, status=status.HTTP_200_OK)

