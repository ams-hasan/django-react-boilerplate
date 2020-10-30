from django.contrib.auth import authenticate
import django.contrib.auth.password_validation as validators
from django.core import exceptions
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "mobile_number")


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "mobile_number", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        password = data.get("password")
        errors = dict()
        try:
            validators.validate_password(password=password, user=User)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)
        return super(RegisterUserSerializer, self).validate(data)

    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
        except ValueError as e:
            raise serializers.ValidationError(e)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=4, max_length=32)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError(
            "Unable to log in with the provided credentials"
        )
