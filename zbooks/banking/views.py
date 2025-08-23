from django.http import JsonResponse

def banking_home(request):
    return JsonResponse({"message": "Banking API working!"})
