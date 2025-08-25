from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Project, TimeEntry, ProjectExpense
from .serializers import ProjectSerializer, TimeEntrySerializer, ProjectExpenseSerializer


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


class ProjectViewSet(BaseOrgViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    search_fields = ['project_name', 'status']
    ordering_fields = ['start_date', 'end_date', 'status']


class TimeEntryViewSet(BaseOrgViewSet):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    search_fields = ['project__project_name', 'user__full_name']
    ordering_fields = ['date', 'hours']


class ProjectExpenseViewSet(BaseOrgViewSet):
    queryset = ProjectExpense.objects.all()
    serializer_class = ProjectExpenseSerializer
    search_fields = ['project__project_name', 'description']
    ordering_fields = ['expense_date', 'amount']


