# quiz/urls.py
from django.urls import path
from .views import QuizSubmitView

urlpatterns = [
    path('submit/', QuizSubmitView.as_view(), name='quiz-submit'),
]
