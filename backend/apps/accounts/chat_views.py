import os
import json
import urllib.request
import urllib.error
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

logger = logging.getLogger(__name__)

KNOWLEDGE_BASE = [
    {
        'keywords': ['find', 'search', 'look for', 'browse', 'opportunity', 'vacancy', 'openings'],
        'response': (
            "To find jobs on Panisudar:\n"
            "1. Visit the **Find Jobs** page from the top navigation.\n"
            "2. Filter by Category, Job Type (Full-time, Remote, Contract), and Experience.\n"
            "3. Use the salary slider to target your preferred compensation.\n"
            "4. Click **View Details** and submit your application with a single click!"
        )
    },
    {
        'keywords': ['profile', 'resume upload', 'avatar', 'photo', 'edit profile'],
        'response': (
            "To update your profile on Panisudar:\n"
            "1. Sign in and navigate to **Profile** from your avatar menu.\n"
            "2. Upload your latest PDF/DOCX resume and profile photo.\n"
            "3. Add your key skills, education, experience, and projects.\n"
            "4. A complete profile gives you up to 3x higher visibility with recruiters!"
        )
    },
    {
        'keywords': ['apply', 'application', 'how to apply', 'submit application'],
        'response': (
            "Applying for jobs is seamless:\n"
            "1. Open any job posting on Panisudar.\n"
            "2. Click the **Apply Now** button.\n"
            "3. Review your auto-filled profile details and optionally include a personalized note.\n"
            "4. Click Submit — you can track status live in your **Applications** dashboard."
        )
    },
    {
        'keywords': ['ai resume', 'resume score', 'ats', 'tailor', 'cv builder'],
        'response': (
            "Check out our new **AI Resume Assistant** (`/ai-resume`):\n"
            "• **Live Score (0-100)**: Instant multi-category ATS scoring.\n"
            "• **Keyword Match**: Scan against any target role or job description.\n"
            "• **One-Click Tailor**: Optimize summary and bullet points without hallucinations.\n"
            "• **3 Clean Templates**: Classic ATS, Modern Professional, and Developer."
        )
    },
    {
        'keywords': ['post job', 'hire', 'employer', 'recruiter', 'candidates'],
        'response': (
            "Hiring on Panisudar:\n"
            "1. Sign up or log in as an **Employer / Recruiter**.\n"
            "2. Go to **Post Job** to specify roles, salary ranges, and required skills.\n"
            "3. Track incoming applicants in real-time under **Applications** and manage candidates through Shortlisted, Interview, and Offer stages."
        )
    },
    {
        'keywords': ['interview', 'prepare', 'questions', 'tips'],
        'response': (
            "Tips for interview success on Panisudar:\n"
            "• Research the company's background and product stack on their Panisudar company page.\n"
            "• Use the STAR method (Situation, Task, Action, Result) for behavioral questions.\n"
            "• Check your Panisudar **Notifications** for recruiter invites and interview meeting links."
        )
    },
]

class ChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_message = (request.data.get('message') or '').strip()
        history = request.data.get('history') or []

        if not user_message:
            return Response({'reply': "Hi! How can I assist your job search or hiring on Panisudar today?", 'source': 'assistant'})

        # 1. Try Ollama if configured
        ollama_url = os.environ.get('OLLAMA_API_URL', 'http://localhost:11434/api/generate')
        ollama_model = os.environ.get('OLLAMA_MODEL', 'llama3')
        use_ollama = os.environ.get('USE_OLLAMA', 'false').lower() in ('true', '1')

        if use_ollama:
            try:
                system_prompt = "You are Panisudar's helpful AI Career Assistant. Give concise, friendly advice regarding jobs, hiring, resumes, and interview preparation."
                payload = {
                    "model": ollama_model,
                    "prompt": f"{system_prompt}\nUser: {user_message}\nAssistant:",
                    "stream": False
                }
                req = urllib.request.Request(
                    ollama_url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=8) as res:
                    res_data = json.loads(res.read().decode('utf-8'))
                    reply = res_data.get('response')
                    if reply:
                        return Response({'reply': reply.strip(), 'source': 'ollama'})
            except Exception as e:
                logger.info(f"Ollama local service unavailable: {e}")

        # 2. Try external AI API key if configured
        ai_key = os.environ.get('AI_API_KEY') or os.environ.get('GEMINI_API_KEY') or os.environ.get('OPENAI_API_KEY')
        if ai_key:
            try:
                from apps.ai_resume.services.ai_service import call_external_llm
                reply = call_external_llm(
                    user_message,
                    "You are Panisudar's official AI Job Portal Assistant. Provide concise, expert advice on jobs, career growth, resumes, and hiring on Panisudar."
                )
                if reply:
                    return Response({'reply': reply.strip(), 'source': 'ai'})
            except Exception as e:
                logger.info(f"External AI call skipped: {e}")

        # 3. Intelligent contextual knowledge base
        msg_lower = user_message.lower()
        for item in KNOWLEDGE_BASE:
            if any(kw in msg_lower for kw in item['keywords']):
                return Response({'reply': item['response'], 'source': 'knowledge_base'})

        # Generic default response
        return Response({
            'reply': (
                "I'm here to help with all aspects of **Panisudar**! You can ask me about:\n"
                "• **'How do I find remote jobs?'**\n"
                "• **'How does the AI Resume Assistant work?'**\n"
                "• **'How do I post a job as an employer?'**\n"
                "• **'How do I update my profile and skills?'**\n"
                "What would you like assistance with?"
            ),
            'source': 'assistant'
        })
