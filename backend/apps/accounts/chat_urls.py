from django.urls import path
from .chat_views import ChatbotView

urlpatterns = [
    path('', ChatbotView.as_view(), name='chatbot'),
]
