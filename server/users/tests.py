from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User
from .serializers import UserSerializer


class RegistrationTestCase(APITestCase):
    def test_register_fails_without_email(self):
        test_user = {"first_name": "Jane", "last_name": "Doe", "password": "password"}
        initial_user_count = User.objects.count()
        register_url = reverse("register")
        response = self.client.post(register_url, test_user, "json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), initial_user_count)

    def test_register_fails_without_last_name(self):
        test_user = {
            "email": "jane@mail.com",
            "first_name": "Jane",
            "password": "password",
        }
        initial_user_count = User.objects.count()
        register_url = reverse("register")
        response = self.client.post(register_url, test_user, "json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), initial_user_count)

    def test_register_succeeds_with_all_info(self):
        test_user = {
            "email": "jane@mail.com",
            "first_name": "Jane",
            "last_name": "Doe",
            "password": "password",
        }
        initial_user_count = User.objects.count()
        register_url = reverse("register")
        response = self.client.post(register_url, test_user, "json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], test_user["email"])
        self.assertEqual(response.data["first_name"], test_user["first_name"])
        self.assertEqual(User.objects.count(), initial_user_count + 1)


class LoginTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="john@mail.com",
            first_name="John",
            last_name="Doe",
            password="password",
        )

    def test_login_fails_without_correct_password(self):
        login_user = {"email": "john@mail.com", "password": "wrongpass"}
        login_url = reverse("login")
        response = self.client.post(login_url, login_user, "json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_succeeds_with_correct_info(self):
        login_user = {"email": "john@mail.com", "password": "password"}
        login_url = reverse("login")
        response = self.client.post(login_url, login_user, "json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["first_name"], self.user.first_name)
        self.assertEqual(response.data["user"]["last_name"], self.user.last_name)


class UserTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="john@mail.com",
            first_name="John",
            last_name="Doe",
            password="password",
        )
        self.user2 = User.objects.create_superuser(
            email="jane@mail.com",
            first_name="Jane",
            last_name="Doe",
            password="password",
        )
        self.serialized_user = UserSerializer(self.user)

    def test_cannot_view_user_list_without_login(self):
        users_url = reverse("users-list")
        response = self.client.get(users_url, None, "json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_can_view_list_if_logged_in(self):
        self.client.login(email="john@mail.com", password="password")
        users_url = reverse("users-list")
        response = self.client.get(users_url, None, "json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.serialized_user.data, response.data)

    def test_cannot_update_if_not_same_user(self):
        self.client.login(email="john@mail.com", password="password")
        users_url = reverse("users-detail", args=[self.user2.id])
        response = self.client.patch(users_url, {"first_name": "Janice"}, "json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_update_if_same_user(self):
        self.client.login(email="jane@mail.com", password="password")
        users_url = reverse("users-detail", args=[self.user2.id])
        response = self.client.patch(users_url, {"first_name": "Janice"}, "json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Janice")
        self.assertEqual(response.data["last_name"], self.user2.last_name)

    def test_cannot_create_user_without_admin(self):
        new_user = {
            "email": "new@mail.com",
            "first_name": "new",
            "last_name": "name",
            "password": "password",
        }
        self.client.login(email="john@mail.com", password="password")
        users_url = reverse("users-list")
        initial_user_count = User.objects.count()
        response = self.client.post(users_url, new_user, "json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), initial_user_count)

    def test_can_create_user_if_admin(self):
        new_user = {
            "email": "new@mail.com",
            "first_name": "new",
            "last_name": "name",
            "password": "password",
        }
        self.client.login(email="jane@mail.com", password="password")
        users_url = reverse("users-list")
        initial_user_count = User.objects.count()
        response = self.client.post(users_url, new_user, "json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), initial_user_count + 1)
        self.assertEqual(response.data["email"], new_user["email"])
        self.assertEqual(response.data["first_name"], new_user["first_name"])
