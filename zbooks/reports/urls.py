from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancialStatementViewSet, ReportTemplateViewSet, ScheduledReportViewSet

router = DefaultRouter()
router.register(r'financial-statements', FinancialStatementViewSet, basename='financial-statement')
router.register(r'templates', ReportTemplateViewSet, basename='report-template')
router.register(r'scheduled', ScheduledReportViewSet, basename='scheduled-report')

urlpatterns = [
    path('', include(router.urls)),
]


