from rest_framework import generics, permissions, viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
import random

from .models import (
    User,
    ChartOfAccounts,
    JournalEntry,
    Organization,
    UserOrganization,
    OneTimePassword,
)
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ChartOfAccountsSerializer,
    JournalEntrySerializer,
    OrganizationSerializer,
)


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


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all().order_by("-id")
    serializer_class = OrganizationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name", "email"]

    def perform_create(self, serializer):
        org = serializer.save()
        # create membership and set as default for creator
        UserOrganization.objects.get_or_create(user=self.request.user, organization=org, defaults={"role": "owner", "is_default": True})

    @action(detail=False, methods=["get"], url_path="my")
    def my(self, request):
        memberships = UserOrganization.objects.filter(user=request.user).select_related("organization")
        data = [
            {
                "id": m.organization.id,
                "name": m.organization.name,
                "is_default": m.is_default,
                "role": m.role,
            }
            for m in memberships
        ]
        return Response(data)

    @action(detail=True, methods=["post"], url_path="switch")
    def switch(self, request, pk=None):
        org = self.get_object()
        UserOrganization.objects.filter(user=request.user).update(is_default=False)
        membership, _ = UserOrganization.objects.get_or_create(user=request.user, organization=org)
        membership.is_default = True
        membership.save()
        return Response({"active_organization": OrganizationSerializer(org).data})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def otp_request(request):
    destination = request.data.get("destination")
    if not destination:
        return Response({"detail": "destination required"}, status=status.HTTP_400_BAD_REQUEST)
    channel = "email" if "@" in destination else "phone"
    try:
        user = User.objects.get(email=destination) if channel == "email" else User.objects.get(phone=destination)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    code = f"{random.randint(100000, 999999)}"
    expires = timezone.now() + timedelta(minutes=10)
    OneTimePassword.objects.create(user=user, channel=channel, destination=destination, code=code, expires_at=expires)
    # TODO: integrate with email/SMS provider to actually send OTP
    return Response({"message": "OTP sent", "expires_in": 600})


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def otp_verify(request):
    destination = request.data.get("destination")
    code = request.data.get("code")
    if not destination or not code:
        return Response({"detail": "destination and code required"}, status=status.HTTP_400_BAD_REQUEST)
    now = timezone.now()
    otp = (
        OneTimePassword.objects.filter(destination=destination, code=code, is_used=False, expires_at__gte=now)
        .order_by("-id")
        .first()
    )
    if not otp:
        return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
    otp.is_used = True
    otp.save()
    from rest_framework_simplejwt.tokens import RefreshToken

    refresh = RefreshToken.for_user(otp.user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": UserSerializer(otp.user).data,
    })
from rest_framework import generics, permissions
from .models import User
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user





