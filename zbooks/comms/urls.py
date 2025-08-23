from django.urls import path
from . import views

urlpatterns = [
    path('', views.comms_home, name='comms_home'),
]
