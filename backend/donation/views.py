"""Donation views."""

from django.contrib.auth import get_user_model
from django.http import Http404
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Donation
from .selectors import donation_get, donation_list
from .services import donation_create

User = get_user_model()


class DonationDetailAPI(APIView):
    """Donation Detail API."""

    class DonationOutputSerializer(serializers.ModelSerializer):
        """Donation Detail Output Serializer."""

        class Meta:
            model = Donation
            fields = ("id", "donor", "amount", "campaign", "payment")

    @extend_schema(responses={200: DonationOutputSerializer})
    def get(self, request, donation_id):
        donation = donation_get(donation_id)

        if not donation:
            raise Http404

        data = self.DonationOutputSerializer(donation).data

        return Response(data)


class DonationListAPI(APIView):
    """Donation List API."""

    class OutputSerializer(serializers.ModelSerializer):
        """Donation List Output Serializer."""

        class Meta:
            model = Donation
            fields = ("id", "donor", "amount", "campaign", "payment")

    @extend_schema(responses={200: DonationDetailAPI.DonationOutputSerializer})
    def get(self, request):
        donations = donation_list()

        data = DonationDetailAPI.DonationOutputSerializer(donations, many=True).data

        return Response(data)


class DonationCreateAPI(APIView):
    """Donation Create API."""

    class DonationInputSerializer(serializers.ModelSerializer):
        """Donation Create Input Serializer."""

        class Meta:
            model = Donation
            fields = ["id", "donor", "amount", "campaign"]

    @extend_schema(
        request=DonationInputSerializer,
        responses={200: DonationDetailAPI.DonationOutputSerializer},
    )
    def post(self, request):
        serializer = self.DonationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        donation = donation_create(**serializer.validated_data)

        data = DonationDetailAPI.DonationOutputSerializer(donation).data

        return Response(data)
