from django.urls import path 
from . import views

urlpatterns = [
    path('api/contests', views.get_contests, name='get_contests'),
    path('api/contests/<int:pk>', views.get_contest, name='get_contest'),
]
