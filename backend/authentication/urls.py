from allauth.socialaccount.views import signup
from dj_rest_auth.registration.views import RegisterView, ResendEmailVerificationView, VerifyEmailView
from dj_rest_auth.views import LoginView, LogoutView, PasswordResetConfirmView, PasswordResetView, UserDetailsView
from django.urls import path

from authentication.views import GoogleLogin, email_confirm_redirect, password_reset_confirm_redirect, CustomRegisterView, CustomLoginView, SendResetCodeView, VerifyResetCodeView, ResetPasswordView

urlpatterns = [
    path("register/", CustomRegisterView.as_view(), name="rest_register"),
    path("login/", CustomLoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("user/", UserDetailsView.as_view(), name="rest_user_details"),
    # email:
    path(
        "register/verify-email/",
        VerifyEmailView.as_view(),
        name="rest_verify_email",
    ),
    path(
        "register/resend-email/",
        ResendEmailVerificationView.as_view(),
        name="rest_resend_email",
    ),
    path(
        "account-confirm-email/<str:key>/",
        email_confirm_redirect,
        name="account_confirm_email",
    ),
    path(
        "account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    # reset password:
    path(
        "password/reset/",
        SendResetCodeView.as_view(),
        name="rest_password_reset",
    ),
    path(
        "password/reset/verify/",
        VerifyResetCodeView.as_view(),
        name="password_reset_verify",
    ),
    path(
        "password/reset/confirm/",
        ResetPasswordView.as_view(),
        name="password_reset_confirm_custom",
    ),
    # social_auth:
    path("signup/", signup, name="socialaccount_signup"),
    path("google/", GoogleLogin.as_view(), name="google_login"),
]
