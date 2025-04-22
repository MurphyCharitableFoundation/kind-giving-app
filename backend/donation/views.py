"""Donation views."""

from django.contrib.auth import get_user_model
from rest_framework import permissions, serializers
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView

from .models import Donation
from .selectors import donation_list
from .services import donation_create

User = get_user_model()


class DonationDetailAPI(RetrieveAPIView):
    """Donation Detail API."""

    class DonationOutputSerializer(serializers.ModelSerializer):
        """Donation Detail Output Serializer."""

        class Meta:  # noqa
            model = Donation
            fields = ("id", "donor", "amount", "campaign", "payment")

    lookup_url_kwarg = "donation_id"
    queryset = donation_list()
    serializer_class = DonationOutputSerializer


class DonationListCreateAPI(ListCreateAPIView):
    """Donation List API."""

    queryset = donation_list()

    class DonationInputSerializer(serializers.ModelSerializer):
        """Donation Create Input Serializer."""

        class Meta:  # noqa
            model = Donation
            fields = ["donor", "amount", "campaign"]

        def create(self, validated_data):  # noqa
            return donation_create(**validated_data)

    class DonationOutputSerializer(serializers.ModelSerializer):
        """Donation List Output Serializer."""

        class Meta:  # noqa
            model = Donation
            fields = ("id", "donor", "amount", "campaign", "payment")

    def get_permissions(self):
        """Get permissions by action."""
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        """Dynamically choose which serializer class to use."""
        if self.request.method in ["POST"]:
            return self.DonationInputSerializer
        return self.DonationOutputSerializer
