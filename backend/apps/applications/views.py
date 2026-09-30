from rest_framework import generics, permissions
from apps.profiles.models import Application
from apps.profiles.serializers import ApplicationSerializer

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
