import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from todo.models import Todo


# Create your views here.
@require_POST
@login_required
def create_todo(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        text = data.get("text", "").strip()

        if not text:
            return JsonResponse({"error": "Can't be emtpy"}, status=400)

        todo = Todo.objects.create(user=request.user, text=text)

        return JsonResponse(
            {
                "id": todo.id,
                "text": todo.text,
                "is_done": todo.is_done,
                "created_at": todo.created_at.isoformat(),
            },
            status=201,
        )

    except json.decoder.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

@require_POST
@login_required
def delete_todo(request, pk):
    try:
        todo = Todo.objects.get(pk=pk, user=request.user)
    except Todo.DoesNotExist:
        return JsonResponse({"error": "Todo not found"}, status=404)

    todo.delete()
    return JsonResponse({"success": True})