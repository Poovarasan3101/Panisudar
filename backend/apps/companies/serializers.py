from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    active_jobs = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'

    def get_active_jobs(self, obj):
        return obj.jobs.filter(is_active=True).count()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['activeJobs'] = ret.get('active_jobs', 0)
        return ret
