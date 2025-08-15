"""Authentication serializers."""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer

User = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    """
    Custom registration serializer.

    Extends the default dj-rest-auth RegisterSerializer
    to include first_name and last_name fields.
    """

    username = None

    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)

    class Meta:  # noqa
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "password1",
            "password2",
        ]

    def save(self, request):
        """Save user with provided first and last names."""
        user = super().save(request)
        user.first_name = self.data.get("first_name", "").strip()
        user.last_name = self.data.get("last_name", "").strip()
        user.save()
        return user

class CustomLoginSerializer(LoginSerializer):
    username = None

    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)
