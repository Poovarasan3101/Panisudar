from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    active_jobs = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'

    def get_active_jobs(self, obj):
        return obj.jobs.filter(is_active=True).count()
