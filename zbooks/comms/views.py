from django.http import JsonResponse

def comms_home(request):
    return JsonResponse({"message": "Comms API is working!"})
