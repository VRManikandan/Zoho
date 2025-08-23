from django.http import JsonResponse

def catalog_home(request):
    return JsonResponse({"message": "Catalog API working!"})
