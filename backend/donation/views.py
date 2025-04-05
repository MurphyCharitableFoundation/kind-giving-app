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
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Donation
            fields = ("id", "donor", "amount", "campaign", "payment")

    @extend_schema(
        responses={200: OutputSerializer},
    )
    def get(self, request, donation_id):
        donation = donation_get(donation_id)

        if not donation:
            raise Http404

        data = self.OutputSerializer(donation).data

        return Response(data)


class DonationListAPI(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Donation
            fields = ("id", "donor", "amount", "campaign", "payment")

    @extend_schema(
        responses={200: OutputSerializer},
    )
    def get(self, request):
        donations = donation_list()

        data = self.OutputSerializer(donations, many=True).data

        return Response(data)


class DonationCreateAPI(APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Donation
            fields = ["id", "donor", "amount", "campaign"]

    @extend_schema(
        request=InputSerializer,
        responses={200: DonationDetailAPI.OutputSerializer},
    )
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        donation = donation_create(**serializer.validated_data)

        data = DonationDetailAPI.OutputSerializer(donation).data

        return Response(data)
