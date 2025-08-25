from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardWidgetViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'widgets', DashboardWidgetViewSet, basename='dashboard-widget')
router.register(r'reports', ReportViewSet, basename='dashboard-report')

urlpatterns = [
    path('', include(router.urls)),
]
