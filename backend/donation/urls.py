"""Donation urls."""

from django.urls import path

from .views import DonationDetailAPI, DonationListCreateAPI

urlpatterns = [
    path("", DonationListCreateAPI.as_view(), name="list-create"),
    path("<int:donation_id>/", DonationDetailAPI.as_view(), name="detail"),
]
