from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
import os
import random
from django.core.exceptions import ValidationError

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext

def upload_image_path(instance, filename):
    new_filename = random.randint(1, 2541781232)
    name, ext = get_filename_ext(filename)
    final_filename = '{new_filename}{ext}'.format(new_filename=new_filename, ext=ext)
    return "img/{new_filename}/{final_filename}".format(new_filename=new_filename, final_filename=final_filename)

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role='buyer', **extra_fields):
        if not email:    
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')  # Default role for superuser is 'admin'
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )
    username = models.CharField(max_length=30, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    paypal_account_id = models.CharField(max_length=255, blank=True, null=True, help_text="Seller's PayPal account ID (Email or PayPal ID)")

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def clean(self):
        # Ensure that only sellers can have a PayPal account ID
        if self.role == 'seller' and not self.paypal_account_id:
            raise ValidationError('PayPal account ID is required for sellers.')
        super().clean()

class House(models.Model):
    lister = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    _id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=100, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to=upload_image_path, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    available = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
class ChatRoom(models.Model):
    buyer = models.ForeignKey(CustomUser, related_name='chat_buyer', on_delete=models.CASCADE)
    seller = models.ForeignKey(CustomUser, related_name='chat_seller', on_delete=models.CASCADE)
    house = models.ForeignKey(House, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = ('buyer', 'seller', 'house')

    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    buyer = models.ForeignKey(CustomUser, related_name='orders', on_delete=models.SET_NULL, null=True, blank=True)
    paymentMethod = models.CharField(max_length=100, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=100, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=100, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    _id = models.AutoField(primary_key=True)
    paidAt = models.DateTimeField(null=True, blank=True)  # Add paidAt field
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    house = models.ForeignKey(House, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=100, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=1000, null=True, blank=True)
    _id = models.AutoField(primary_key=True)