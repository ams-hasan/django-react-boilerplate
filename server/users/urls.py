from django.urls import path
from rest_framework import routers, views

from .views import UserViewSet, RegisterAPI, LoginAPI, LogoutAPI

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("register/", RegisterAPI.as_view(), name="register"),
    path("login/", LoginAPI.as_view(), name="login"),
    path("logout/", LogoutAPI.as_view(), name="logout"),
]

urlpatterns += router.urls
