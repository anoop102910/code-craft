from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Contest
from .serializer import ContestSerializer
from rest_framework import status
# Create your views here.

@api_view(['GET'])
def get_contests(request):
    contests = Contest.objects.all()
    serializer = ContestSerializer(contests, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_contest(request, pk):
    contest = Contest.objects.get(pk=pk)
    serializer = ContestSerializer(contest)
    return Response(serializer.data)


