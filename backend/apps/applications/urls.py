from django.urls import path
from .views import ApplicationDetailView

urlpatterns = [
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application_detail'),
]
