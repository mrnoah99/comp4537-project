from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class QuizSubmitView(APIView):
    def post(self, request):
        # Retrieve the answer from the request
        user_answer = request.data.get("answer")
        correct_answer = "Random Access Memory"  # Replace with dynamic logic if needed

        # Evaluate the user's answer
        if user_answer and user_answer.strip().lower() == correct_answer.lower():
            return Response(
                {"result": "correct", "message": "Your answer is correct!"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"result": "incorrect", "message": "Your answer is incorrect."},
                status=status.HTTP_200_OK,
            )
