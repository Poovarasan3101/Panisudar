from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPES = (
        ('application_update', 'Application Update'),
        ('recommendation', 'Job Recommendation'),
        ('interview', 'Interview Scheduled'),
        ('message', 'Recruiter Message'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=TYPES, default='application_update')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.title}"
