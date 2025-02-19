from rest_framework import serializers
from problems.models import Problem, Category  
from django.utils.text import slugify

class CategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(min_length=2,max_length=255)
    description = serializers.CharField(min_length=10,max_length=10000)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProblemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(min_length=3,max_length=255)
    slug = serializers.SlugField(max_length=255)
    description = serializers.CharField(min_length=10,max_length=10000)
    difficulty = serializers.ChoiceField(choices=['Easy', 'Medium', 'Hard'])
    acceptance = serializers.FloatField(min_value=0, max_value=100)
    time_limit = serializers.IntegerField(min_value=1,max_value=10)
    memory_limit = serializers.IntegerField(min_value=1,max_value=1024)
    frequency = serializers.FloatField(min_value=0, max_value=100)
    example_test_cases = serializers.JSONField()
    all_test_cases = serializers.JSONField()
    constraints = serializers.JSONField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Problem
        fields = ['id', 'title', 'slug', 'description', 'difficulty', 'acceptance', 'frequency', 'example_test_cases', 'all_test_cases', 'constraints', 'status', 'time_limit', 'memory_limit', 'category', 'category_id']
