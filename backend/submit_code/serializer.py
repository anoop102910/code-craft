from rest_framework import serializers
from .models import UserCode

class UserCodeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    problem_title = serializers.CharField(source='problem.title', read_only=True)

    class Meta:
        model = UserCode
        fields = [
            'id', 'user', 'username', 'code', 'language', 'problem', 'problem_title',
            'status', 'correct_cases', 'incorrect_cases', 'execution_time',
            'memory_used', 'result', 'error_message', 'submission_time'
        ]
        read_only_fields = [
            'status', 'correct_cases', 'incorrect_cases', 'execution_time',
            'memory_used', 'result', 'error_message', 'submission_time',  'problem_title', 'username', 'user',
        ]

    def create(self, validated_data):
        # Associate the submission with the current user
        print(self.context['request'].user)
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)