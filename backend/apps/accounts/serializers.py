from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', read_only=True)
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'fullName', 'role', 'photo')

    def get_photo(self, obj):
        try:
            if hasattr(obj, 'seeker_profile') and obj.seeker_profile.photo:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.seeker_profile.photo.url)
                return obj.seeker_profile.photo.url
        except Exception:
            pass
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    fullName = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'fullName', 'password', 'role')
        extra_kwargs = {'full_name': {'required': False}}

    def validate(self, attrs):
        if 'fullName' in attrs and not attrs.get('full_name'):
            attrs['full_name'] = attrs.pop('fullName')
        elif not attrs.get('full_name'):
            attrs['full_name'] = attrs.get('email', '').split('@')[0]
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'job_seeker')
        )
        if user.role == 'job_seeker':
            from apps.profiles.models import JobSeekerProfile
            JobSeekerProfile.objects.get_or_create(user=user)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user, context=self.context).data
        return data
