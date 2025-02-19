from django.urls import path 
from . import views

urlpatterns = [
    path('api/problems', views.get_problems, name='get_problems'),
    path('api/problems/create', views.create_problem, name='create_problem'),
    path('api/problems/<slug:slug>', views.get_problem, name='get_problem'),   
    path('api/problems/edit/<int:id>', views.update_problem, name='update_problem'),
    path('api/problems/delete/<int:id>', views.delete_problem, name='delete_problem'),
    path('api/categories', views.get_categories, name='get_categories'),
    path('api/categories/create', views.create_category, name='create_category'),
    path('api/categories/edit/<int:id>', views.update_category, name='update_category'),
    path('api/categories/delete/<int:id>', views.delete_category, name='delete_category'),
]
