"""Project Serializers."""

from rest_framework import serializers
from .models import Cause


class CauseSerializer(serializers.ModelSerializer):
    """Cause Serializer."""

    class Meta:
        model = Cause
        fields = ["id", "name", "description", "icon"]

    def validate_name(self, value):
        """Ensure name is always lowercase."""
        return value.lower()
