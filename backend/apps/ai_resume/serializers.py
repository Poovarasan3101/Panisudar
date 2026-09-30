from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)

class ScoreRequestSerializer(serializers.Serializer):
    resume_data = serializers.DictField(required=False)
    resume_id = serializers.IntegerField(required=False)

class AnalyzeRequestSerializer(serializers.Serializer):
    resume_data = serializers.DictField(required=False)
    resume_id = serializers.IntegerField(required=False)
    target_role = serializers.CharField(required=False, allow_blank=True)

class JobAnalysisRequestSerializer(serializers.Serializer):
    resume_data = serializers.DictField(required=False)
    resume_id = serializers.IntegerField(required=False)
    job_description = serializers.CharField(required=True)

class TailorRequestSerializer(serializers.Serializer):
    resume_data = serializers.DictField(required=False)
    resume_id = serializers.IntegerField(required=False)
    job_description = serializers.CharField(required=True)

class ImproveContentSerializer(serializers.Serializer):
    section = serializers.ChoiceField(choices=['objective', 'summary', 'project', 'experience', 'skills'])
    raw_text = serializers.CharField(required=False, allow_blank=True)
    target_role = serializers.CharField(required=False, allow_blank=True)
    project_name = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    tech_stack = serializers.CharField(required=False, allow_blank=True)
    resume_data = serializers.DictField(required=False)

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)
    resume_data = serializers.DictField(required=False)
    resume_id = serializers.IntegerField(required=False)
