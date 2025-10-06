"""Payment Serializers"""

from rest_framework import serializers


class StripePaymentInputSerializer(serializers.Serializer):  # noqa
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0.50,
        help_text="Payment amount in decimal format (e.g. 10.50)",
    )
    currency = serializers.CharField(default="usd", required=False)


class StripePaymentOutputSerializer(serializers.Serializer):  # noqa
    client_secret = serializers.CharField()
