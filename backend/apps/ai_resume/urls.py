from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResumeViewSet,
    ResumeScoreView,
    ResumeAnalyzeView,
    JobDescriptionAnalysisView,
    ImproveContentView,
    TailorResumeView,
    ResumeUploadView,
    ResumeChatView,
)

router = DefaultRouter()
router.register(r'', ResumeViewSet, basename='ai-resume')

urlpatterns = [
    # Dedicated AI endpoints
    path('score/', ResumeScoreView.as_view(), name='ai-resume-score'),
    path('analyze/', ResumeAnalyzeView.as_view(), name='ai-resume-analyze'),
    path('job-analysis/', JobDescriptionAnalysisView.as_view(), name='ai-resume-job-analysis'),
    path('improve/', ImproveContentView.as_view(), name='ai-resume-improve'),
    path('tailor/', TailorResumeView.as_view(), name='ai-resume-tailor'),
    path('upload/', ResumeUploadView.as_view(), name='ai-resume-upload'),
    path('chat/', ResumeChatView.as_view(), name='ai-resume-chat'),

    # ViewSet CRUD URLs
    path('', include(router.urls)),
]
