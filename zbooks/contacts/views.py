from django.http import JsonResponse

def contact_list(request):
    return JsonResponse({"message": "Contacts API working!"})
