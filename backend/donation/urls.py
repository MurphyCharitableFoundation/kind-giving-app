"""Donation urls."""

from django.urls import path

from .views import DonationCreateAPI, DonationDetailAPI, DonationListAPI

urlpatterns = [
    path("", DonationListAPI.as_view(), name="list"),
    path("<int:donation_id>/", DonationDetailAPI.as_view(), name="detail"),
    path("create/", DonationCreateAPI.as_view(), name="create"),
]
