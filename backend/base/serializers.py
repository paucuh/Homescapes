from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    role = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'username', 'email', 'isAdmin', 'role']

    def get_username(self, obj):
        return obj.username

    def get__id(self, obj):
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff
    
    def get_role(self, obj):
        return obj.role
    
    def get_email(self, obj):
        return obj.email
    
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'username', 'email', 'isAdmin', 'token', 'role']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
class ChatRoomSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(many=False, read_only=True)
    seller = UserSerializer(many=False, read_only=True)
    class Meta:
        model = ChatRoom
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(many=False, read_only=True)
    room = ChatRoomSerializer(many=False, read_only=True)
    class Meta:
        model = Message
        fields = '__all__'