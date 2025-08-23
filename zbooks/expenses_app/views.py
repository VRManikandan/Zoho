from django.http import JsonResponse

def expenses_home(request):
    return JsonResponse({"message": "Expenses API working!"})
