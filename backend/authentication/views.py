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
from django.utils import timezone
from datetime import timedelta

from authentication.serializers import CustomRegisterSerializer, CustomLoginSerializer, PasswordResetCodeSerializer, PasswordResetVerifySerializer, PasswordResetSerializer
from authentication.models import PasswordResetToken, PasswordResetCode

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
    serializer_class = PasswordResetCodeSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "If this email exists, a code has been sent."})

        # Generate random 5-digit code
        code = str(random.randint(10000, 99999))

        # Store in DB with 10 min expiry
        PasswordResetCode.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=10),
        )

        # Send code to user through email
        send_mail(
            subject="Your password reset code",
            message=f"Your password reset code is: {code}",
            from_email=None,
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

        # Get latest code
        reset_code = (
            PasswordResetCode.objects.filter(user=user, code=code)
            .order_by("-created_at")
            .first()
        )

        if not reset_code or reset_code.is_expired():
            return Response({"error": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate reset password token
        reset_token = PasswordResetToken.generate(user=user, ttl_seconds=900)

        # Invalidate code
        reset_code.delete()

        return Response({"resetToken": reset_token.token})

class ResetPasswordView(APIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password1"]

        try:
            token_obj = PasswordResetToken.objects.get(token=reset_token)
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        if token_obj.is_expired():
            token_obj.delete()
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user = token_obj.user
        user.set_password(new_password)
        user.save()

        # Delete token (single use)
        token_obj.delete()

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

