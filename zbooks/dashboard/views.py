from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import DashboardWidget, Report
from .serializers import DashboardWidgetSerializer, ReportSerializer


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


class DashboardWidgetViewSet(BaseOrgViewSet):
    queryset = DashboardWidget.objects.all()
    serializer_class = DashboardWidgetSerializer
    search_fields = ['name', 'widget_type']
    ordering_fields = ['created_at', 'position_x', 'position_y']


class ReportViewSet(BaseOrgViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    search_fields = ['name', 'report_type']
    ordering_fields = ['created_at', 'report_type']


