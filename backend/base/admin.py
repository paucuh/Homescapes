from django.contrib import admin
from .models import *

admin.site.register(House)
admin.site.register(CustomUser)
admin.site.register(ChatRoom)
admin.site.register(Message)

# Register your models here.
