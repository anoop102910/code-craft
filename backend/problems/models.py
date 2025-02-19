from django.db import models

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()

class Problem(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=255)
    acceptance = models.FloatField()
    frequency = models.FloatField()
    example_test_cases = models.JSONField()
    all_test_cases = models.JSONField()
    constraints = models.JSONField()
    status = models.CharField(max_length=255, default="Easy")
    time_limit = models.FloatField()
    memory_limit = models.FloatField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return self.title
