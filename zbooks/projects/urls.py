from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TimeEntryViewSet, ProjectExpenseViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'time-entries', TimeEntryViewSet, basename='time-entry')
router.register(r'project-expenses', ProjectExpenseViewSet, basename='project-expense')

urlpatterns = [
    path('', include(router.urls)),
]


