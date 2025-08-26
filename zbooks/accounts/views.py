from rest_framework import generics, permissions, viewsets, filters
from .models import User, ChartOfAccounts, JournalEntry
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import RegisterSerializer, UserSerializer,ChartOfAccountsSerializer,JournalEntrySerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user
    
    
class ChartOfAccountsViewSet(viewsets.ModelViewSet):
    queryset = ChartOfAccounts.objects.all().order_by("account_code")
    serializer_class = ChartOfAccountsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["organization", "account_type", "is_active"]
    search_fields = ["account_code", "account_name"]


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all().order_by("-entry_date", "-id")
    serializer_class = JournalEntrySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["organization", "entry_type", "is_posted", "entry_date"]
    search_fields = ["entry_number", "reference", "description"]
