# quiz/models.py
from django.db import models

class QuizQuestion(models.Model):
    difficulty = models.CharField(max_length=50)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question
