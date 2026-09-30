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
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'
        extra_kwargs = {
            'company': {'required': False},
            'posted_by': {'required': False, 'read_only': True},
            'application_deadline': {'required': False},
        }

    def get_applications_count(self, obj):
        return obj.applications.count()

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        camel_to_snake = {
            'workMode': 'work_mode',
            'jobType': 'job_type',
            'experienceLevel': 'experience_level',
            'salaryMin': 'salary_min',
            'salaryMax': 'salary_max',
            'applicationDeadline': 'application_deadline',
            'isActive': 'is_active',
            'isFeatured': 'is_featured',
            'companyId': 'company',
        }
        for c, s in camel_to_snake.items():
            if c in data and s not in data:
                data[s] = data[c]

        for s_field in ('salary_min', 'salary_max'):
            if s_field in data:
                val = data[s_field]
                if val == '' or val is None:
                    data[s_field] = None
                else:
                    try:
                        data[s_field] = int(val)
                    except (ValueError, TypeError):
                        pass

        if 'application_deadline' in data and not data['application_deadline']:
            data.pop('application_deadline')

        return super().to_internal_value(data)

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        request = self.context.get('request')

        logo_url = None
        if obj.company and obj.company.logo:
            try:
                logo_url = request.build_absolute_uri(obj.company.logo.url) if request else obj.company.logo.url
            except Exception:
                logo_url = obj.company.logo.url

        app_count = obj.applications.count()

        # CamelCase convenience fields for frontend components
        ret['companyName'] = obj.company.name if obj.company else ''
        ret['companyLogo'] = logo_url
        ret['companyId'] = str(obj.company_id) if obj.company_id else ''
        ret['workMode'] = obj.work_mode
        ret['jobType'] = obj.job_type
        ret['experienceLevel'] = obj.experience_level
        ret['salaryMin'] = obj.salary_min
        ret['salaryMax'] = obj.salary_max
        ret['postedAt'] = obj.created_at.isoformat() if obj.created_at else None
        ret['applicationDeadline'] = str(obj.application_deadline) if obj.application_deadline else None
        ret['isActive'] = obj.is_active
        ret['isFeatured'] = obj.is_featured
        ret['applicationsCount'] = app_count
        ret['applications_count'] = app_count

        return ret
