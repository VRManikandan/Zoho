from rest_framework import generics, permissions, viewsets, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
import random
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.core.mail import send_mail
from django.conf import settings
import logging
from django.db import transaction
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

logger = logging.getLogger(__name__)

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


def mask_destination(destination):
    """Mask email or phone number for privacy"""
    if not destination:
        return ""
    
    if "@" in destination:
        # Email masking
        username, domain = destination.split("@")
        if len(username) <= 2:
            masked_username = username[0] + "*"
        else:
            masked_username = username[:2] + "*" * max(1, len(username) - 2)
        
        domain_parts = domain.split(".")
        if len(domain_parts[0]) <= 1:
            masked_domain = domain
        else:
            masked_domain = domain_parts[0][0] + "*" * (len(domain_parts[0]) - 1) + "." + ".".join(domain_parts[1:])
        
        return f"{masked_username}@{masked_domain}"
    else:
        # Phone masking - show last 2 digits
        return "*" * max(0, len(destination) - 2) + destination[-2:]


def send_otp_email(email, code, full_name):
    """Send OTP via email"""
    try:
        subject = "Your ZBooks Login OTP"
        message = f"""Hi {full_name},

Your OTP for ZBooks login is: {code}

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
ZBooks Team"""
        
        # Check if email backend is properly configured
        from django.conf import settings
        if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
            logger.warning("Using console email backend - emails will only appear in console")
            print(f"📧 EMAIL OTP for {email}: {code}")
        
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@zbooks.com'),
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"OTP email sent successfully to {mask_destination(email)}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {mask_destination(email)}: {str(e)}")
        print(f"❌ EMAIL ERROR: {str(e)}")
        return False


def send_otp_sms(phone, code):
    """Send OTP via SMS - placeholder for SMS service integration"""
    try:
        # TODO: Integrate with SMS service provider (Twilio, AWS SNS, etc.)
        # For now, just log the OTP
        logger.info(f"SMS OTP for {mask_destination(phone)}: {code}")
        
        # In development, you can print to console
        print(f"📱 SMS OTP for {phone}: {code}")
        
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP SMS to {mask_destination(phone)}: {str(e)}")
        return False


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

    @action(detail=False, methods=["post"], url_path="create")
    def create_organization(self, request):
        """Create a new organization for logged-in user"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            org = serializer.save()
            # Create membership with owner role
            UserOrganization.objects.create(
                user=request.user, 
                organization=org, 
                role="owner", 
                is_default=False  # Don't make it default automatically
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def check_rate_limit(key, limit=5, window=300):
    """Simple rate limiting using cache"""
    current = cache.get(key, 0)
    if current >= limit:
        return False
    cache.set(key, current + 1, window)
    return True

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def otp_request(request):
    try:
        destination = request.data.get("destination")
        if not destination:
            return Response({"detail": "destination required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Rate limiting - 5 requests per 5 minutes per destination
        rate_limit_key = f"otp_request:{destination}"
        if not check_rate_limit(rate_limit_key, limit=5, window=300):
            return Response(
                {"detail": "Too many OTP requests. Please try again in 5 minutes."}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        logger.info(f"OTP request for destination: {mask_destination(destination)}")
        
        channel = "email" if "@" in destination else "phone"
        try:
            if channel == "email":
                user = User.objects.get(email=destination)
            else:
                # Improved phone lookup - try multiple formats
                clean_phone = destination.replace("+", "").replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
                
                # Try exact match first
                user = None
                try:
                    user = User.objects.get(phone=destination)
                except User.DoesNotExist:
                    # Try with cleaned phone number
                    try:
                        user = User.objects.get(phone=clean_phone)
                    except User.DoesNotExist:
                        # Try contains search as last resort
                        users = User.objects.filter(phone__icontains=clean_phone[-10:])  # Last 10 digits
                        if users.exists():
                            user = users.first()
                        else:
                            raise User.DoesNotExist()
                
        except User.DoesNotExist:
            logger.warning(f"User not found for destination: {mask_destination(destination)}")
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f"Found user: {user.email} for OTP request")
        
    except Exception as e:
        logger.error(f"Unexpected error in otp_request: {str(e)}", exc_info=True)
        return Response({"detail": f"Internal error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        # Generate 6-digit OTP
        code = f"{random.randint(100000, 999999)}"
        expires = timezone.now() + timedelta(minutes=10)
        
        logger.info(f"Generated OTP for user {user.email}, expires at {expires}")
        
        # Create OTP record
        OneTimePassword.objects.create(
            user=user, 
            channel=channel, 
            destination=destination, 
            code=code, 
            expires_at=expires
        )
        
        logger.info(f"OTP record created successfully")
        
        # Send OTP via appropriate channel
        delivery_success = False
        if channel == "email":
            delivery_success = send_otp_email(destination, code, user.full_name)
            if not delivery_success:
                logger.error(f"Failed to send OTP email to {mask_destination(destination)}")
                return Response({"detail": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            delivery_success = send_otp_sms(destination, code)
            if not delivery_success:
                logger.error(f"Failed to send OTP SMS to {mask_destination(destination)}")
                return Response({"detail": "Failed to send OTP. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        logger.info(f"OTP sent successfully via {channel}")
        return Response({
            "message": "OTP sent successfully"
        })
        
    except Exception as e:
        logger.error(f"Error in OTP generation/sending: {str(e)}", exc_info=True)
        return Response({"detail": f"OTP processing error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def otp_verify(request):
    destination = request.data.get("destination")
    code = request.data.get("code")
    
    if not destination or not code:
        return Response({"detail": "destination and code required"}, status=status.HTTP_400_BAD_REQUEST)
    
    now = timezone.now()
    otp = (
        OneTimePassword.objects.filter(
            destination=destination, 
            code=code, 
            is_used=False, 
            expires_at__gte=now
        )
        .order_by("-id")
        .first()
    )
    
    if not otp:
        return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Mark OTP as used
    otp.is_used = True
    otp.save()
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(otp.user)
    
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": UserSerializer(otp.user).data,
    })


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Logout user and blacklist refresh token"""
    try:
        refresh_token = request.data.get("refresh_token")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                logger.warning(f"Failed to blacklist token: {str(e)}")
        
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return Response({"detail": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def switch_organization(request):
    """Switch user's default organization"""
    try:
        org_id = request.data.get("organization_id")
        if not org_id:
            return Response({"detail": "organization_id required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user has access to this organization
        try:
            membership = UserOrganization.objects.get(user=request.user, organization_id=org_id)
        except UserOrganization.DoesNotExist:
            return Response({"detail": "Access denied to this organization"}, status=status.HTTP_403_FORBIDDEN)
        
        # Switch default organization
        with transaction.atomic():
            UserOrganization.objects.filter(user=request.user).update(is_default=False)
            membership.is_default = True
            membership.save()
        
        return Response({
            "message": "Organization switched successfully",
            "current_organization": OrganizationSerializer(membership.organization).data,
            "role": membership.role
        })
        
    except Exception as e:
        logger.error(f"Organization switch error: {str(e)}")
        return Response({"detail": "Failed to switch organization"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





