"""Authentication views."""


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView, RegisterView, VerifyEmailView, ResendEmailVerificationView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView, PasswordResetView, PasswordResetConfirmView
from django.conf import settings
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
import secrets
from django.contrib.auth.hashers import make_password

from authentication.serializers import CustomRegisterSerializer, CustomLoginSerializer, PasswordResetCodeSerializer, PasswordResetVerifySerializer, PasswordResetSerializer

User = get_user_model()

def email_confirm_redirect(request, key):
    return HttpResponseRedirect(f"{settings.EMAIL_CONFIRM_REDIRECT_BASE_URL}{key}/")


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/")


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.BASE_FRONTEND_URL
    client_class = OAuth2Client

class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

class CustomLoginView(LoginView):
    serializer_class = CustomLoginSerializer

class SendResetCodeView(APIView):
    """
    Generate a 6-digit code, save it in cache, and email it to the user.
    """
    serializer_class = PasswordResetCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # For security
            return Response({"detail": "If this email exists, a code has been sent."})

        # Generate a random 5-digit code
        code = str(random.randint(10000, 99999))

        # Save in cache with 10 min expiration
        cache.set(f"reset_code_{user.pk}", code, timeout=600)

        # Send the code via email
        send_mail(
            subject="Your password reset code",
            message=f"Your password reset code is: {code}",
            from_email=None,  # uses DEFAULT_FROM_EMAIL
            recipient_list=[email],
        )

        return Response({"detail": "If this email exists, a code has been sent."})

class VerifyResetCodeView(APIView):
    serializer_class = PasswordResetVerifySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f"reset_code_{user.pk}")
        if cached_code != code:
            return Response({"error": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a temporary reset token
        reset_token = secrets.token_urlsafe(32)
        cache.set(f"reset_token_{reset_token}", user.pk, timeout=900)  # 15 min expiry
        cache.delete(f"reset_code_{user.pk}")  # code is single-use

        return Response({"resetToken": reset_token})

class ResetPasswordView(APIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password1"]

        # Get user ID from cache
        user_id = cache.get(f"reset_token_{reset_token}")
        if not user_id:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Update password
        user.set_password(new_password)
        user.save()

        # Delete token to make it single-use
        cache.delete(f"reset_token_{reset_token}")

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

