"""Project Serializers."""

from django.contrib.auth import get_user_model
from rest_framework import serializers

from campaign.models import Campaign
from user.models import UserGroup

from .models import ProjectAssignment
from .services import BENEFICIARY_MODEL_MAP

User = get_user_model()


class CampaignSerializer(serializers.ModelSerializer):
    """Campaign Serializer."""

    class Meta:  # noqa
        model = Campaign
        fields = "__all__"


class BeneficiarySerializer(serializers.Serializer):
    """Beneficiary Serializer."""

    assignable_type = serializers.ChoiceField(
        choices=ProjectAssignment.ASSIGNABLE_TYPE_CHOICES,
    )
    assignable_id = serializers.IntegerField()
    beneficiary = serializers.SerializerMethodField()

    class UserSerializer(serializers.ModelSerializer):
        """User Serializer."""

        name = serializers.SerializerMethodField()

        class Meta:  # noqa
            model = User
            fields = [
                "first_name",
                "last_name",
                "name",
                "email",
                "img",
                "is_group_leader",
            ]

        def get_name(self, obj):  # noqa
            return obj.first_name + obj.last_name

    class UserGroupSerializer(serializers.ModelSerializer):
        """User Group Serializer."""

        class Meta:  # noqa
            model = UserGroup
            fields = [
                "name",
                "img",
                "interest",
            ]

    def get_beneficiary(self, obj):  # noqa
        """WARNING: Extremely inefficient for large lists."""
        beneficiary_model = BENEFICIARY_MODEL_MAP.get(obj.assignable_type)

        BENEFICIARY_SERIALIZER_MAP = {
            "User": self.UserSerializer,
            "UserGroup": self.UserGroupSerializer,
        }

        if beneficiary_model:
            beneficiary = self.context[f"{obj.assignable_type}_map"].get(obj.assignable_id)

            return BENEFICIARY_SERIALIZER_MAP.get(obj.assignable_type)(beneficiary).data


class ProjectAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for ProjectAssignment."""

    assignable_type = serializers.ChoiceField(choices=ProjectAssignment.ASSIGNABLE_TYPE_CHOICES)
    assignable_id = serializers.IntegerField()

    class Meta:  # noqa
        model = ProjectAssignment
        fields = ["id", "project", "assignable_type", "assignable_id"]
        read_only_fields = ["id", "project"]
