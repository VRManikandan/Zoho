from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import FinancialStatement, ReportTemplate, ScheduledReport
from .serializers import FinancialStatementSerializer, ReportTemplateSerializer, ScheduledReportSerializer


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


class FinancialStatementViewSet(BaseOrgViewSet):
    queryset = FinancialStatement.objects.all()
    serializer_class = FinancialStatementSerializer
    search_fields = ['statement_type']
    ordering_fields = ['period_start', 'period_end', 'generated_at']


class ReportTemplateViewSet(BaseOrgViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    search_fields = ['name', 'template_type']
    ordering_fields = ['created_at']


class ScheduledReportViewSet(BaseOrgViewSet):
    queryset = ScheduledReport.objects.all()
    serializer_class = ScheduledReportSerializer
    search_fields = ['name', 'report_type', 'frequency']
    ordering_fields = ['next_run', 'last_run']


