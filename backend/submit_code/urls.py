from django.urls import path
from . import views

urlpatterns = [
    path('api/submit-code', views.submit_code, name='submit_code'),
    path('api/get-user-code', views.get_user_code, name='get_user_code'),
    path('api/get-all-user-code', views.get_all_user_code, name='get_all_user_code'),
]

