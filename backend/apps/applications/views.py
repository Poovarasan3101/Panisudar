from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.profiles.models import Application
from apps.profiles.serializers import ApplicationSerializer
from apps.jobs.models import Job
from apps.notifications.models import Notification
import logging

logger = logging.getLogger(__name__)

class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Application.objects.filter(job__posted_by=user).order_by('-applied_at')
        return Application.objects.filter(applicant=user).order_by('-applied_at')

    def create(self, request, *args, **kwargs):
        user = request.user
        if getattr(user, 'role', '') == 'employer':
            return Response(
                {'error': 'Recruiter accounts cannot apply for jobs. Please use a job seeker account.'},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        job_id = data.get('job') or data.get('jobId') or data.get('job_id')
        cover_letter = data.get('cover_letter') or data.get('coverLetter') or ''

        if not job_id:
            return Response({'error': 'Job ID is required to apply.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job = Job.objects.get(id=job_id)
        except (Job.DoesNotExist, ValueError):
            return Response({'error': 'The requested job does not exist or has been removed.'}, status=status.HTTP_404_NOT_FOUND)

        if not job.is_active:
            return Response({'error': 'This job posting is no longer active.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check for duplicate applications
        if Application.objects.filter(job=job, applicant=user).exists():
            return Response(
                {'error': 'You have already applied for this job.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application = Application.objects.create(
            job=job,
            applicant=user,
            cover_letter=cover_letter
        )

        # Trigger notification for the employer
        try:
            if job.posted_by and job.posted_by != user:
                Notification.objects.create(
                    user=job.posted_by,
                    type='application_update',
                    title=f"New Applicant: {job.title}",
                    message=f"{user.full_name} has applied for '{job.title}'."
                )
        except Exception as e:
            logger.warning(f"Failed to create employer notification: {e}")

        # Trigger confirmation notification for the applicant
        try:
            company_name = job.company.name if job.company else 'Panisudar'
            Notification.objects.create(
                user=user,
                type='application_update',
                title=f"Application Submitted: {job.title}",
                message=f"Your application for '{job.title}' at {company_name} was submitted successfully."
            )
        except Exception as e:
            logger.warning(f"Failed to create applicant notification: {e}")

        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        old_status = instance.status

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        updated_app = serializer.save()
        new_status = updated_app.status

        # If status changed, notify candidate
        if old_status != new_status and updated_app.applicant:
            try:
                notif_type = 'interview' if new_status == 'interview' else 'application_update'
                company_name = updated_app.job.company.name if updated_app.job.company else 'Employer'
                Notification.objects.create(
                    user=updated_app.applicant,
                    type=notif_type,
                    title=f"Application Update: {updated_app.job.title}",
                    message=f"Your application for '{updated_app.job.title}' at {company_name} was updated to '{updated_app.get_status_display()}'.",
                    is_read=False
                )
            except Exception as e:
                logger.warning(f"Failed to notify applicant on status update: {e}")

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # Only the applicant or the job poster can withdraw/delete
        if instance.applicant != user and instance.job.posted_by != user and not user.is_staff:
            return Response(
                {'error': 'You do not have permission to withdraw this application.'},
                status=status.HTTP_403_FORBIDDEN
            )

        self.perform_destroy(instance)
        return Response({'success': True, 'message': 'Application withdrawn successfully.'}, status=status.HTTP_200_OK)
