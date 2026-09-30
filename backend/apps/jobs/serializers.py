from rest_framework import serializers
from .models import Company, Job

class CompanySerializer(serializers.ModelSerializer):
    active_jobs = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'

    def get_active_jobs(self, obj):
        return obj.jobs.filter(is_active=True).count()

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
