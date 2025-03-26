from django.contrib import admin
from .models import *

admin.site.register(House)
admin.site.register(CustomUser)
admin.site.register(ChatRoom)
admin.site.register(Message)
admin.site.register(Order)
admin.site.register(OrderItem)

# Register your models here.
