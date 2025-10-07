"""Payment URLs."""

from django.urls import path

from .views import (
    CancelPayPalPaymentView,
    CapturePayPalPaymentView,
    CreatePayPalPaymentView,
    CreateStripePaymentView,
    CancelStripePaymentView,
)
from .StripeWebhookView import StripeWebhookView

urlpatterns = [
    path(
        "paypal/create/",
        CreatePayPalPaymentView.as_view(),
        name="paypal-create",
    ),
    path(
        "paypal/capture/",
        CapturePayPalPaymentView.as_view(),
        name="paypal-capture",
    ),
    path(
        "paypal/cancel/",
        CancelPayPalPaymentView.as_view(),
        name="paypal-cancel",
    ),
    path(
        "stripe/create/",
        CreateStripePaymentView.as_view(),
        name="stripe-create",
    ),
    path(
        "stripe/cancel/",
        CancelStripePaymentView.as_view(),
        name="stripe-cancel",
    ),
    path("stripe/webhook/", 
         StripeWebhookView.as_view(), 
         name="stripe-webhook"
    ),
]
