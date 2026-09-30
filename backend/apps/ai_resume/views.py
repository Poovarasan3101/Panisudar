import os
import logging
from rest_framework import status, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Resume
from .serializers import (
    ResumeSerializer,
    ScoreRequestSerializer,
    AnalyzeRequestSerializer,
    JobAnalysisRequestSerializer,
    TailorRequestSerializer,
    ImproveContentSerializer,
    ChatRequestSerializer,
)
from .services.resume_scorer import calculate_resume_score
from .services.resume_analyzer import analyze_target_job_keywords, analyze_job_description
from .services.resume_parser import extract_text_from_pdf, extract_text_from_docx, parse_resume_text
from .services.ai_service import AIService

logger = logging.getLogger(__name__)

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Auto-calculate score before saving
        data = serializer.validated_data
        score_res = calculate_resume_score(data)
        serializer.save(
            user=self.request.user,
            score=score_res['score'],
            score_breakdown=score_res['breakdown'],
            analysis={'strengths': score_res['strengths'], 'improvements': score_res['improvements']}
        )

    def perform_update(self, serializer):
        instance = serializer.instance
        # Calculate updated score
        merged_data = {**ResumeSerializer(instance).data, **serializer.validated_data}
        score_res = calculate_resume_score(merged_data)
        serializer.save(
            score=score_res['score'],
            score_breakdown=score_res['breakdown'],
            analysis={'strengths': score_res['strengths'], 'improvements': score_res['improvements']}
        )

class ResumeScoreView(APIView):
    """
    POST /api/ai-resume/score/
    Computes exact 10-category resume score & breakdown.
    """
    permission_classes = [permissions.AllowAny] # Allows guest preview / authenticated save

    def post(self, request):
        serializer = ScoreRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resume_data = serializer.validated_data.get('resume_data')
        resume_id = serializer.validated_data.get('resume_id')

        if resume_id and request.user.is_authenticated:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = ResumeSerializer(resume).data
            except Resume.DoesNotExist:
                return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not resume_data:
            return Response({'error': 'No resume data provided for scoring.'}, status=status.HTTP_400_BAD_REQUEST)

        score_res = calculate_resume_score(resume_data)

        # If user is authenticated and updating an existing resume, persist score
        if resume_id and request.user.is_authenticated:
            Resume.objects.filter(id=resume_id, user=request.user).update(
                score=score_res['score'],
                score_breakdown=score_res['breakdown'],
                analysis={'strengths': score_res['strengths'], 'improvements': score_res['improvements']}
            )

        return Response(score_res, status=status.HTTP_200_OK)

class ResumeAnalyzeView(APIView):
    """
    POST /api/ai-resume/analyze/
    Analyzes ATS keywords against target job role.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AnalyzeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resume_data = serializer.validated_data.get('resume_data')
        target_role = serializer.validated_data.get('target_role', '')
        resume_id = serializer.validated_data.get('resume_id')

        if resume_id and request.user.is_authenticated:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = ResumeSerializer(resume).data
                if not target_role:
                    target_role = resume.target_role or resume.professional_title
            except Resume.DoesNotExist:
                return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not resume_data:
            return Response({'error': 'No resume data provided.'}, status=status.HTTP_400_BAD_REQUEST)

        analysis = analyze_target_job_keywords(resume_data, target_role)
        return Response(analysis, status=status.HTTP_200_OK)

class JobDescriptionAnalysisView(APIView):
    """
    POST /api/ai-resume/job-analysis/
    Parses a pasted Job Description and compares against the resume.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = JobAnalysisRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resume_data = serializer.validated_data.get('resume_data')
        job_description = serializer.validated_data.get('job_description')
        resume_id = serializer.validated_data.get('resume_id')

        if resume_id and request.user.is_authenticated:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = ResumeSerializer(resume).data
            except Resume.DoesNotExist:
                pass

        if not resume_data:
            resume_data = {}

        result = analyze_job_description(resume_data, job_description)
        return Response(result, status=status.HTTP_200_OK)

class ImproveContentView(APIView):
    """
    POST /api/ai-resume/improve/
    AI-assisted content generation for objective, summary, projects, experience, or skills.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ImproveContentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        section = serializer.validated_data.get('section')
        raw_text = serializer.validated_data.get('raw_text', '')
        target_role = serializer.validated_data.get('target_role', '')
        project_name = serializer.validated_data.get('project_name', '')
        company = serializer.validated_data.get('company', '')
        tech_stack = serializer.validated_data.get('tech_stack', '')
        resume_data = serializer.validated_data.get('resume_data', {})

        if section == 'objective':
            enhanced = AIService.enhance_career_objective(raw_text, target_role)
        elif section == 'summary':
            enhanced = AIService.generate_professional_summary(resume_data or {'professional_title': target_role})
        elif section == 'project':
            enhanced = AIService.enhance_project_description(project_name or "Project", raw_text, tech_stack)
        elif section == 'experience':
            enhanced = AIService.enhance_experience_bullets(target_role or "Software Engineer", company or "Company", raw_text)
        elif section == 'skills':
            enhanced = AIService.suggest_skills_for_role(target_role or "Software Developer")
        else:
            return Response({'error': 'Invalid section.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'section': section, 'enhanced': enhanced}, status=status.HTTP_200_OK)

class TailorResumeView(APIView):
    """
    POST /api/ai-resume/tailor/
    Generates side-by-side comparison for a tailored version matching a job description.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TailorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resume_data = serializer.validated_data.get('resume_data') or {}
        job_description = serializer.validated_data.get('job_description', '')
        resume_id = serializer.validated_data.get('resume_id')

        if resume_id and request.user.is_authenticated:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = ResumeSerializer(resume).data
            except Resume.DoesNotExist:
                pass

        result = AIService.tailor_resume_to_jd(resume_data, job_description)
        return Response(result, status=status.HTTP_200_OK)

class ResumeUploadView(APIView):
    """
    POST /api/ai-resume/upload/
    Uploads PDF or DOCX resume, extracts text, identifies sections, scores, and returns structured data.
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded. Please attach a PDF or DOCX file.'}, status=status.HTTP_400_BAD_REQUEST)

        # File validation
        file_name = file_obj.name.lower()
        if not (file_name.endswith('.pdf') or file_name.endswith('.docx')):
            return Response({'error': 'Unsupported file format. Please upload a PDF or DOCX document.'}, status=status.HTTP_400_BAD_REQUEST)

        # Max 10MB
        if file_obj.size > 10 * 1024 * 1024:
            return Response({'error': 'File size exceeds maximum limit of 10MB.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_bytes = file_obj.read()
            if file_name.endswith('.pdf'):
                raw_text = extract_text_from_pdf(file_bytes)
            else:
                raw_text = extract_text_from_docx(file_bytes)

            structured_resume = parse_resume_text(raw_text)

            # Score the parsed resume
            score_data = calculate_resume_score(structured_resume)
            structured_resume['score'] = score_data['score']
            structured_resume['score_breakdown'] = score_data['breakdown']
            structured_resume['analysis'] = {
                'strengths': score_data['strengths'],
                'improvements': score_data['improvements']
            }

            return Response({
                'message': 'Resume successfully parsed.',
                'resume': structured_resume,
                'score': score_data
            }, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error parsing resume upload: {e}")
            return Response({
                'error': 'Failed to process resume document. Please verify the document is not password protected or corrupted.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResumeChatView(APIView):
    """
    POST /api/ai-resume/chat/
    Interactive conversational AI assistant aware of current resume context.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.validated_data.get('message')
        resume_data = serializer.validated_data.get('resume_data') or {}
        resume_id = serializer.validated_data.get('resume_id')

        if resume_id and request.user.is_authenticated:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
                resume_data = ResumeSerializer(resume).data
            except Resume.DoesNotExist:
                pass

        result = AIService.chat_assistant(message, resume_data)
        return Response(result, status=status.HTTP_200_OK)
