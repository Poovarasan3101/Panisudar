from rest_framework import generics, permissions, filters
from .models import Job
from .serializers import JobSerializer

class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'location']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        job_type = self.request.query_params.get('job_type')
        location = self.request.query_params.get('location')
        if category:
            queryset = queryset.filter(category=category)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if location:
            queryset = queryset.filter(location__icontains=location)
        return queryset

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
