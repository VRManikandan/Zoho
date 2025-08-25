from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemSettingViewSet, EmailTemplateViewSet, WorkflowRuleViewSet

router = DefaultRouter()
router.register(r'settings', SystemSettingViewSet, basename='system-setting')
router.register(r'email-templates', EmailTemplateViewSet, basename='email-template')
router.register(r'workflow-rules', WorkflowRuleViewSet, basename='workflow-rule')

urlpatterns = [
    path('', include(router.urls)),
]


