from django.urls import path, include        
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MeView, ChartOfAccountsViewSet, JournalEntryViewSet, OrganizationViewSet, otp_request, otp_verify, logout_view, switch_organization
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'chart-of-accounts', ChartOfAccountsViewSet, basename='chart-of-accounts')
router.register(r'journal-entries', JournalEntryViewSet, basename='journal-entries')
router.register(r'organizations', OrganizationViewSet, basename='organizations')

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", logout_view),
    path("me/", MeView.as_view()),
    path("switch-organization/", switch_organization),
    path("otp/request/", otp_request),
    path("otp/verify/", otp_verify),
    path('', include(router.urls)),
]