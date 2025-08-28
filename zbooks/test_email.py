#!/usr/bin/env python
"""
Test script for email delivery - Run this to verify SMTP configuration
Usage: python test_email.py your-test-email@example.com
"""
import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email_delivery(recipient_email):
    """Test email delivery with current SMTP configuration"""
    
    print(f"Testing email delivery to: {recipient_email}")
    print(f"SMTP Host: {settings.EMAIL_HOST}")
    print(f"SMTP Port: {settings.EMAIL_PORT}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
    print(f"Backend: {settings.EMAIL_BACKEND}")
    print("-" * 50)
    
    try:
        # Send test email
        send_mail(
            subject='ZBooks OTP Test Email',
            message='This is a test email to verify SMTP configuration.\n\nYour OTP would be: 123456\n\nIf you received this, your email setup is working correctly!',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        print("✅ Email sent successfully!")
        print("Check your inbox (and spam folder) for the test email.")
        
    except Exception as e:
        print(f"❌ Email delivery failed: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check your .env file has correct SMTP credentials")
        print("2. Verify EMAIL_HOST_PASSWORD is set to your SendGrid API key")
        print("3. Ensure DEFAULT_FROM_EMAIL uses a verified domain")
        print("4. Check SendGrid dashboard for any delivery issues")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_email.py your-email@example.com")
        sys.exit(1)
    
    recipient = sys.argv[1]
    test_email_delivery(recipient)
