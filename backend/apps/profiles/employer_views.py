from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.jobs.models import Job
from apps.jobs.serializers import JobSerializer
from apps.companies.models import Company
from .models import Application
from .serializers import ApplicationSerializer

class EmployerProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_company_for_user(self, user):
        # Look for company associated with jobs posted by this user
        company = Company.objects.filter(jobs__posted_by=user).first()
        if not company:
            # Fall back to first company or create a default one
            company = Company.objects.first()
            if not company:
                company = Company.objects.create(
                    name=f"{user.full_name}'s Company",
                    industry='Information Technology',
                    size='51_200',
                    location='Bangalore, Karnataka',
                    about='Fast-growing technology company building innovative digital solutions.'
                )
        return company

    def get(self, request):
        user = request.user
        company = self.get_company_for_user(user)

        data = {
            'companyId': company.id if company else 1,
            'companyName': company.name if company else '',
            'name': company.name if company else '',
            'website': company.website if company else '',
            'industry': company.industry if company else '',
            'companySize': company.size if company else '',
            'size': company.size if company else '',
            'location': company.location if company else '',
            'about': company.about if company else '',
            'companyLogo': company.logo.url if (company and company.logo) else None,
            'recruiterName': user.full_name,
            'fullName': user.full_name,
            'email': user.email,
            'phone': '',
            'benefits': company.benefits if (company and isinstance(company.benefits, list)) else [],
        }
        return Response(data)

    def patch(self, request):
        user = request.user
        data = request.data
        company = self.get_company_for_user(user)

        # Update user name if recruiterName or fullName passed
        new_name = data.get('recruiterName') or data.get('fullName') or data.get('name')
        if new_name and new_name.strip():
            user.full_name = new_name.strip()
            user.save()

        # Update company fields
        if company:
            company_name = data.get('companyName') or data.get('name')
            if company_name and company_name.strip():
                company.name = company_name.strip()
            if 'website' in data:
                company.website = data.get('website')
            if 'industry' in data:
                company.industry = data.get('industry')
            if 'companySize' in data:
                company.size = data.get('companySize')
            elif 'size' in data:
                company.size = data.get('size')
            if 'location' in data:
                company.location = data.get('location')
            if 'about' in data:
                company.about = data.get('about')
            if 'benefits' in data:
                benefits_val = data.get('benefits')
                if isinstance(benefits_val, list):
                    company.benefits = benefits_val

            # Handle company logo upload
            if 'logo' in request.FILES:
                company.logo = request.FILES['logo']
            elif 'companyLogo' in request.FILES:
                company.logo = request.FILES['companyLogo']

            company.save()

        return self.get(request)

class EmployerJobsView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Job.objects.filter(posted_by=self.request.user).order_by('-created_at')
        status_param = self.request.query_params.get('status')
        if status_param == 'active':
            qs = qs.filter(is_active=True)
        elif status_param == 'inactive':
            qs = qs.filter(is_active=False)
        return qs

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

class EmployerJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(posted_by=self.request.user)

class EmployerJobToggleStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            job = Job.objects.get(id=pk, posted_by=request.user)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

        job.is_active = not job.is_active
        job.save()
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EmployerApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Application.objects.filter(job__posted_by=self.request.user).order_by('-applied_at')
        job_id = self.request.query_params.get('jobId') or self.request.query_params.get('job')
        app_status = self.request.query_params.get('status')
        if job_id and job_id != 'all':
            qs = qs.filter(job_id=job_id)
        if app_status and app_status != 'all':
            qs = qs.filter(status=app_status)
        return qs
