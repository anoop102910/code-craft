from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .queue_service import send_to_queue
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializer import UserCodeSerializer
from .models import UserCode
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_code(request):
    data = request.data
    serializer = UserCodeSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        try:
            response = send_to_queue(serializer.data['id'])
            return Response({"message":"Code pushed to the queue", "user_code_id": serializer.data['id']}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Failed to push code to the queue", e)
            return Response({"message":"Failed to push code to the queue"}, status=status.HTTP_400_BAD_REQUEST)
    else :  
        return Response(serializer.errors)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_code(request):
    user_code = UserCode.objects.filter(id=request.query_params.get('user_code_id')).first()
    serializer = UserCodeSerializer(user_code, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_user_code(request):
    user_code = UserCode.objects.filter(user=request.user)
    serializer = UserCodeSerializer(user_code, many=True)
    return Response((serializer.data)[0])



