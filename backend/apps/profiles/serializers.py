from rest_framework import serializers
from .models import JobSeekerProfile, Application, SavedJob
from apps.jobs.serializers import JobSerializer

class JobSeekerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', required=False, allow_blank=True)
    fullName = serializers.CharField(source='user.full_name', required=False, allow_blank=True)

    class Meta:
        model = JobSeekerProfile
        fields = '__all__'
        read_only_fields = ('user',)

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        camel_to_snake = {
            'preferredRole': 'preferred_role',
            'preferredLocation': 'preferred_location',
            'expectedSalaryMin': 'expected_salary_min',
            'expectedSalaryMax': 'expected_salary_max',
            'preferredJobType': 'preferred_job_type',
            'resumeName': 'resume_name',
            'additionalInfo': 'additional_info',
        }
        for c, s in camel_to_snake.items():
            if c in data and s not in data:
                data[s] = data[c]

        # Handle salary integers vs empty string
        for salary_field in ('expected_salary_min', 'expected_salary_max'):
            if salary_field in data:
                val = data[salary_field]
                if val == '' or val is None:
                    data[salary_field] = None
                else:
                    try:
                        data[salary_field] = int(val)
                    except (ValueError, TypeError):
                        pass

        # Handle photo: if string URL or empty string, do not overwrite/fail file field
        if 'photo' in data:
            val = data['photo']
            if val is None or val == 'null':
                data['photo'] = None
            elif not hasattr(val, 'read') and not hasattr(val, 'chunks'):
                data.pop('photo')

        # Handle resume: if dict or string URL, preserve name and do not overwrite file field
        if 'resume' in data:
            val = data['resume']
            if val is None or val == 'null':
                data['resume'] = None
            elif not hasattr(val, 'read') and not hasattr(val, 'chunks'):
                if isinstance(val, dict) and 'name' in val:
                    data.setdefault('resume_name', val['name'])
                data.pop('resume')

        # Handle JSON list fields (education, experience, projects, certifications, skills)
        import json
        for json_field in ('education', 'experience', 'projects', 'certifications', 'skills'):
            if json_field in data:
                val = data[json_field]
                if isinstance(val, str):
                    try:
                        data[json_field] = json.loads(val)
                    except Exception:
                        pass
                if not isinstance(data[json_field], list):
                    data[json_field] = []

        # Collect additional info fields (languages, github, linkedin, etc.)
        extra_fields = [
            'languages', 'github', 'linkedin', 'portfolio',
            'careerObjective', 'career_objective', 'achievements'
        ]
        additional_info = {}
        if self.instance and isinstance(self.instance.additional_info, dict):
            additional_info = self.instance.additional_info.copy()

        passed_info = data.get('additional_info', {})
        if isinstance(passed_info, dict):
            additional_info.update(passed_info)

        for field in extra_fields:
            if field in data:
                additional_info[field] = data[field]

        data['additional_info'] = additional_info

        # Normalize fullName vs full_name
        if 'fullName' in data and 'full_name' not in data:
            data['full_name'] = data['fullName']
        elif 'full_name' in data and 'fullName' not in data:
            data['fullName'] = data['full_name']

        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        if instance.photo:
            try:
                ret['photo'] = request.build_absolute_uri(instance.photo.url) if request else instance.photo.url
            except Exception:
                ret['photo'] = instance.photo.url
        ret['fullName'] = instance.user.full_name
        ret['preferredRole'] = instance.preferred_role or ''
        ret['preferredLocation'] = instance.preferred_location or ''
        ret['expectedSalaryMin'] = instance.expected_salary_min
        ret['expectedSalaryMax'] = instance.expected_salary_max
        ret['preferredJobType'] = instance.preferred_job_type or 'full_time'
        ret['resumeName'] = instance.resume_name or ''
        ret['education'] = instance.education if isinstance(instance.education, list) else []
        ret['experience'] = instance.experience if isinstance(instance.experience, list) else []
        ret['projects'] = instance.projects if isinstance(instance.projects, list) else []
        ret['certifications'] = instance.certifications if isinstance(instance.certifications, list) else []
        ret['skills'] = instance.skills if isinstance(instance.skills, list) else []
        if isinstance(instance.additional_info, dict):
            for k, v in instance.additional_info.items():
                if k not in ret:
                    ret[k] = v
        return ret

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        name_to_update = user_data.get('full_name')
        if name_to_update is not None and name_to_update != '':
            instance.user.full_name = name_to_update
            instance.user.save()
        return super().update(instance, validated_data)

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('applicant',)

class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ('user',)
