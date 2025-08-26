from django.urls import path, include        
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MeView, ChartOfAccountsViewSet, JournalEntryViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'chart-of-accounts', ChartOfAccountsViewSet, basename='chart-of-accounts')
router.register(r'journal-entries', JournalEntryViewSet, basename='journal-entries')

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view()),
    path('', include(router.urls)),
]