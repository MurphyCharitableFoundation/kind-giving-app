"""Project Serializers."""

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from user.models import UserGroup

from .models import ProjectAssignment
from .services import BENEFICIARY_MODEL_MAP

User = get_user_model()


class BeneficiarySerializer(serializers.Serializer):
    """Beneficiary Serializer."""

    assignable_type = serializers.CharField()
    assignable_id = serializers.IntegerField()
    beneficiary = serializers.SerializerMethodField()

    class UserSerializer(serializers.ModelSerializer):
        """User Serializer."""

        class Meta:  # noqa
            model = User
            exclude = ["bank_account"]

    class UserGroupSerializer(serializers.ModelSerializer):
        """User Group Serializer."""

        class Meta:  # noqa
            model = UserGroup
            exclude = ["bank_account"]

    def get_beneficiary(self, obj):  # noqa
        """WARNING: Extremely inefficient for large lists."""
        beneficiary_model = BENEFICIARY_MODEL_MAP.get(obj.assignable_type)

        BENEFICIARY_SERIALIZER_MAP = {
            "User": self.UserSerializer,
            "UserGroup": self.UserGroupSerializer,
        }

        if beneficiary_model:
            beneficiary = get_object_or_404(beneficiary_model, id=obj.assignable_id)

            return BENEFICIARY_SERIALIZER_MAP.get(obj.assignable_type)(beneficiary).data


class ProjectAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for ProjectAssignment."""

    assignable_type = serializers.ChoiceField(choices=ProjectAssignment.ASSIGNABLE_TYPE_CHOICES)
    assignable_id = serializers.IntegerField()

    class Meta:  # noqa
        model = ProjectAssignment
        fields = ["id", "project", "assignable_type", "assignable_id"]
        read_only_fields = ["id", "project"]
