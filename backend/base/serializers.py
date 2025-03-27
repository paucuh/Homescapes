from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

class HouseSerializer(serializers.ModelSerializer):
    lister = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = House
        fields = '__all__'

    def get_lister(self, obj):
        return obj.lister.username

    def create(self, validated_data):
        validated_data['available'] = True
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    role = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    paypal_account_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'username', 'email', 'isAdmin', 'role', 'paypal_account_id']

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
    
    def get_paypal_account_id(self, obj):
        return obj.paypal_account_id
    
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

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    buyer = serializers.SerializerMethodField(read_only=True)
    paidAt = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = ['_id', 'paymentMethod', 'taxPrice', 'totalPrice', 'isPaid', 'created_at', 'orderItems', 'buyer', 'paidAt']

    def get_orderItems(self, obj):
        items = OrderItem.objects.filter(order=obj)
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data
    
    def get_buyer(self, obj):
        buyer = obj.buyer
        if buyer:
            serializer = UserSerializer(buyer, many=False)
            return serializer.data
        return None
    
    def get_paidAt(self, obj):
        return obj.paidAt

