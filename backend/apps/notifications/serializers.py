from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'isRead' in data and 'is_read' not in data:
            data['is_read'] = data['isRead']
        return super().to_internal_value(data)

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        ret['isRead'] = obj.is_read
        ret['createdAt'] = obj.created_at.isoformat() if obj.created_at else None
        return ret
