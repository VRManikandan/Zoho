import os
import environ
from pathlib import Path

# Use Pathlib for BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

# SECURITY
SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=False)
ALLOWED_HOSTS = ["*"]
AUTH_USER_MODEL = "accounts.User"

# Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'drf_spectacular',
    'corsheaders',
    'django_filters',
    # First-party apps
    'accounts',
    'banking',
    'catalog',
    'common',
    'comms',
    'contacts',
    'core',
    'expenses_app',
    'sales',
    'customers',
    'vendors', 
    'items', 
    'taxes',  
    'notifications', 
    'reminders',
    'purchases',
    'projects',
    'inventory',
    'dashboard',
    'reports',
    'settings_app',
]

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Corrected Path usage
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Root URL configuration
ROOT_URLCONF = "core.urls"

# Timezone
TIME_ZONE = env("TIME_ZONE", default="Asia/Kolkata")
USE_TZ = True

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
        "OPTIONS": {"charset": "utf8mb4"},
    }
}

# Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DATETIME_FORMAT": "%Y-%m-%d %H:%M:%S",
}

# Spectacular API documentation
SPECTACULAR_SETTINGS = {
    "TITLE": "ZBooks API",
    "VERSION": "1.0.0",
}

# CORS
CORS_ALLOWED_ORIGINS = [o.strip() for o in env("ALLOWED_ORIGINS", default="http://localhost:5173").split(",")]

# Static & Media (Optional, but recommended)
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
