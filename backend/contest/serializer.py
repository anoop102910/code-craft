from rest_framework import serializers
from contest.models import Contest

class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ['id', 'name', 'description', 'start_time', 'end_time', 'is_active']
