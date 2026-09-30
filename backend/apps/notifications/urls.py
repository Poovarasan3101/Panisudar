from django.urls import path
from .views import (
    NotificationListView,
    NotificationDetailView,
    UnreadNotificationCountView,
    MarkAllNotificationsReadView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('unread-count/', UnreadNotificationCountView.as_view(), name='notification_unread_count'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='notification_mark_all_read'),
    path('<int:pk>/', NotificationDetailView.as_view(), name='notification_detail'),
]
