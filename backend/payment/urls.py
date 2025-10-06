"""Payment URLs."""

from django.urls import path

from .views import (
    CancelPayPalPaymentView,
    CapturePayPalPaymentView,
    CreatePayPalPaymentView,
)

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
]
