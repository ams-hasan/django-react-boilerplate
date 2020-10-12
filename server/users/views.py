from django.contrib.auth import user_logged_out

from rest_framework.authtoken.models import Token
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response

from .models import User
from .permissions import IsSameUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [permissions.IsAdminUser]
        elif (
            self.action == "update"
            or self.action == "partial_update"
            or self.action == "destroy"
        ):
            permission_classes = [IsSameUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if user:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class LoginAPI(views.APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"user": UserSerializer(user).data, "token": token.key},
                status=status.HTTP_200_OK,
            )
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class LogoutAPI(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        Token.objects.filter(user=request.user).delete()
        user_logged_out.send(
            sender=request.user.__class__, request=request, user=request.user
        )
        return Response(status=status.HTTP_200_OK)