from rest_framework import generics, permissions, filters
from django.db.models import Q
from .models import Job, Company
from .serializers import JobSerializer

class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'location', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True).select_related('company')
        params = self.request.query_params

        # Search
        q = params.get('search') or params.get('q')
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(description__icontains=q) |
                Q(company__name__icontains=q) |
                Q(category__icontains=q) |
                Q(location__icontains=q)
            )

        # Filters
        category = params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        job_type = params.get('job_type') or params.get('jobType')
        if job_type:
            queryset = queryset.filter(job_type=job_type)

        work_mode = params.get('work_mode') or params.get('workMode')
        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)

        exp_level = params.get('experience_level') or params.get('experienceLevel')
        if exp_level:
            queryset = queryset.filter(experience_level=exp_level)

        location = params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        salary_min = params.get('salary_min') or params.get('salaryMin')
        if salary_min:
            try:
                queryset = queryset.filter(salary_max__gte=int(salary_min))
            except (ValueError, TypeError):
                pass

        is_featured = params.get('is_featured') or params.get('isFeatured')
        if is_featured is not None:
            val = str(is_featured).lower() in ('true', '1')
            queryset = queryset.filter(is_featured=val)

        company_id = params.get('company') or params.get('company_id') or params.get('companyId')
        if company_id:
            queryset = queryset.filter(company_id=company_id)

        # Sorting
        sort = params.get('sort')
        if sort == 'salary_high':
            queryset = queryset.order_by('-salary_max', '-created_at')
        elif sort == 'salary_low':
            queryset = queryset.order_by('salary_min', '-created_at')
        elif sort == 'recent':
            queryset = queryset.order_by('-created_at')

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        company = serializer.validated_data.get('company')
        if not company:
            company = Company.objects.filter(jobs__posted_by=user).first() or Company.objects.first()
            if not company:
                company = Company.objects.create(
                    name=f"{user.full_name}'s Company",
                    industry='Technology',
                    size='11_50',
                    location='Bangalore'
                )
            serializer.save(posted_by=user, company=company)
        else:
            serializer.save(posted_by=user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all().select_related('company')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
