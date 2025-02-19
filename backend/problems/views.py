from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Problem, Category
from .serializer import ProblemSerializer, CategorySerializer
from rest_framework import status
# Create your views here.
@api_view(['GET'])
def get_problems(request):
    problems = Problem.objects.select_related('category').defer('all_test_cases').all()
    serializer = ProblemSerializer(problems, many=True)
    return Response({'data': serializer.data})

@api_view(['GET'])
def get_problem(request, slug):
    problem = Problem.objects.select_related('category').defer('all_test_cases').get(slug=slug)
    serializer = ProblemSerializer(problem)
    return Response({'data': serializer.data})

@api_view(['POST'])
def create_problem(request):
    serializer = ProblemSerializer(data=request.data)
    if serializer.is_valid():
        existing_problem = Problem.objects.filter(slug=request.data['slug']).first()
        if existing_problem:
            return Response({'message': 'Problem already exists'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_problem(request, id):
    problem = Problem.objects.get(id=id)
    serializer = ProblemSerializer(problem, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_problem(request, id):
    problem = Problem.objects.get(id=id)
    problem.delete()
    return Response({'message': 'Problem deleted successfully'}, status=status.HTTP_200_OK) 

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response({'data': serializer.data})

@api_view(['POST'])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        existing_category = Category.objects.filter(name=request.data['name']).first()
        if existing_category:
            return Response({'message': 'Category already exists'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

@api_view(['PUT'])
def update_category(request, id):
    category = Category.objects.get(id=id)
    serializer = CategorySerializer(category, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_category(request, id):
    category = Category.objects.get(id=id)
    category.delete()
    return Response({'message': 'Category deleted successfully'}, status=status.HTTP_200_OK)
