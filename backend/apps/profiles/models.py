from django.db import models
from django.conf import settings
from apps.jobs.models import Job

class JobSeekerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seeker_profile')
    title = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)
    photo = models.ImageField(upload_to='avatars/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    resume_name = models.CharField(max_length=255, blank=True)
    skills = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    experience = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    preferred_role = models.CharField(max_length=255, blank=True)
    preferred_location = models.CharField(max_length=255, blank=True)
    expected_salary_min = models.IntegerField(null=True, blank=True)
    expected_salary_max = models.IntegerField(null=True, blank=True)
    preferred_job_type = models.CharField(max_length=50, blank=True)
    additional_info = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.user.full_name}'s Profile"

class Application(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview', 'Interview'),
        ('rejected', 'Rejected'),
        ('selected', 'Selected'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('job', 'applicant')

    def __str__(self):
        return f"{self.applicant.full_name} -> {self.job.title} ({self.status})"

class SavedJob(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"
