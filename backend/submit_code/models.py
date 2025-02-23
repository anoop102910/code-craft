from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserCode(models.Model):
    # Define status choices
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
    ]

    # Define result choices
    RESULT_CHOICES = [
        ('accepted', 'Accepted'),
        ('wrong_answer', 'Wrong Answer'),
        ('time_limit_exceeded', 'Time Limit Exceeded'),
        ('memory_limit_exceeded', 'Memory Limit Exceeded'),
        ('runtime_error', 'Runtime Error'),
        ('compilation_error', 'Compilation Error'),
        ('system_error', 'System Error'),
    ]

    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('javascript', 'JavaScript'),
        ('ruby', 'Ruby'),
        ('go', 'Go'),
        ('csharp', 'C#'),
        ('php', 'PHP'),
    ]

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.TextField(max_length=20000)
    language = models.CharField(max_length=50,choices=LANGUAGE_CHOICES)
    problem = models.ForeignKey('problems.Problem', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    correct_cases = models.IntegerField(default=0)
    incorrect_cases = models.IntegerField(default=0)
    execution_time = models.FloatField(null=True)   
    memory_used = models.IntegerField(null=True)
    result = models.CharField(max_length=255, choices=RESULT_CHOICES, null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)  # Store detailed error messages
    submission_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s submission for {self.problem.title}" 