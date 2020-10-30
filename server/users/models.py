from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The email must be set")
        if "first_name" not in extra_fields or not extra_fields["first_name"]:
            raise ValueError("First name must be set")
        if "last_name" not in extra_fields or not extra_fields["last_name"]:
            raise ValueError("Last name must be set")
        if not password:
            raise ValueError("The password must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_staff", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    mobile_number = PhoneNumberField(
        _("mobile number"),
        unique=True,
        null=True,
        blank=True,
        validators=[MinLengthValidator(7),
                    MaxLengthValidator(15)],
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
    objects = UserManager()
