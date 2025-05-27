"""Campaign Serializers."""

from rest_framework import serializers

from donation.models import Donation


class DonationSerializer(serializers.ModelSerializer):
    """Donation Serializer."""

    class Meta:  # noqa
        model = Donation
        fields = ("donor", "amount", "description", "payment")
