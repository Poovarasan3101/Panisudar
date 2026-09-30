from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    industry = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    about = models.TextField()
    benefits = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
