from django.db import models
from django.conf import settings

class Resume(models.Model):
    TEMPLATE_CHOICES = (
        ('classic', 'Classic ATS'),
        ('modern', 'Modern Professional'),
        ('developer', 'Developer'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    title = models.CharField(max_length=255, default='My Resume')
    target_role = models.CharField(max_length=255, blank=True)
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, default='classic')

    # Personal Information
    full_name = models.CharField(max_length=255, blank=True)
    professional_title = models.CharField(max_length=255, blank=True)
    email = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=255, blank=True)
    linkedin = models.URLField(max_length=500, blank=True)
    github = models.URLField(max_length=500, blank=True)
    portfolio = models.URLField(max_length=500, blank=True)

    # Career Information
    career_objective = models.TextField(blank=True)
    professional_summary = models.TextField(blank=True)

    # Skills: [{ "name": "Python", "category": "technical" }, ...] or ["Python", ...]
    skills = models.JSONField(default=list, blank=True)

    # Repeatable collections
    education = models.JSONField(default=list, blank=True)
    experience = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    languages = models.JSONField(default=list, blank=True)

    # AI Scoring & Analysis results
    score = models.IntegerField(default=0)
    score_breakdown = models.JSONField(default=dict, blank=True)
    analysis = models.JSONField(default=dict, blank=True)

    # Job-Specific tailoring
    target_job_description = models.TextField(blank=True)
    tailored_suggestions = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.full_name or self.title} ({self.user.email})"
