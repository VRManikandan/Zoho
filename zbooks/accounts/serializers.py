from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ("id","email","full_name","phone","role","password")
    def create(self, validated):
        pwd = validated.pop("password")
        user = User(**validated)
        user.set_password(pwd)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","email","full_name","phone","role","is_active","created_at")
