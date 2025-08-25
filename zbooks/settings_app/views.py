from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import SystemSetting, EmailTemplate, WorkflowRule
from .serializers import SystemSettingSerializer, EmailTemplateSerializer, WorkflowRuleSerializer


class BaseOrgViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id']
    ordering = ['-id']

    def get_queryset(self):
        qs = super().get_queryset()
        org_id = self.request.query_params.get('organization')
        if org_id:
            qs = qs.filter(organization_id=org_id)
        return qs


class SystemSettingViewSet(BaseOrgViewSet):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    search_fields = ['setting_key', 'setting_type']
    ordering_fields = ['created_at', 'updated_at']


class EmailTemplateViewSet(BaseOrgViewSet):
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    search_fields = ['template_type', 'subject']
    ordering_fields = ['created_at']


class WorkflowRuleViewSet(BaseOrgViewSet):
    queryset = WorkflowRule.objects.all()
    serializer_class = WorkflowRuleSerializer
    search_fields = ['name', 'rule_type']
    ordering_fields = ['priority']


