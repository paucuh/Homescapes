from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.core.exceptions import PermissionDenied
from django.utils import timezone

@api_view(['GET'])
def getHouses(request):
    houses = House.objects.all()
    serializer = HouseSerializer(houses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getHouse(request, pk):
    house = House.objects.get(_id=pk)
    serializer = HouseSerializer(house, many=False)
    return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('User does not exist')

        user = authenticate(username=email, password=password)
        if not user:
            raise AuthenticationFailed('Invalid password')

        # Call super AFTER validation
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# Custom permission to allow only Sellers
class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Seller'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_house(request):
    # Ensure only sellers can create
    if request.user.role.lower() != 'seller':
        return Response({'detail': 'Only sellers can create house listings.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = HouseSerializer(data=request.data)
    if serializer.is_valid():
        # Set the lister to the logged-in user
        serializer.save(lister=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # Extract the role from the request data (default to 'Buyer')
        role = data.get('role', 'buyer').lower()

        # Check if the user is a seller, then require paypal_account_id
        if role == 'seller' and not data.get('paypal_account_id'):
            return Response({'detail': 'PayPal account ID is required for sellers.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user instance
        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            role=role,  # Ensure the role is set correctly (buyer/seller)
            password=make_password(data['password']),  # Hash the password before saving
            paypal_account_id=data.get('paypal_account_id', '')  # Store PayPal ID only for sellers
        )

        # Create a token for the user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Serialize user data
        serializer = UserSerializer(user, many=False)

        return Response({
            'user': serializer.data,
            'token': access_token
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def searchHouses(request):
    query = request.GET.get('address', '')  # Capture the search keyword from the query parameters
    if query:
        houses = House.objects.filter(address__icontains=query)  # Filter houses by address
    else:
        houses = House.objects.all()  # If no search keyword is provided, return all houses

    serializer = HouseSerializer(houses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserHouses(request):
    user = request.user
    houses = House.objects.filter(lister=user)  # Filter houses by the logged-in user
    serializer = HouseSerializer(houses, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateHouse(request, pk):
    try:
        house = House.objects.get(_id=pk)
        
        # Check if the logged-in user is the lister of the house
        if house.lister != request.user:
            return Response(
                {"detail": "You are not authorized to update this listing."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Deserialize and validate the updated data
        serializer = HouseSerializer(house, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except House.DoesNotExist:
        return Response({"detail": "House not found."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteHouse(request, pk):
    try:
        house = House.objects.get(_id=pk)

        if house.lister != request.user:
            return Response(
                {"detail": "You are not authorized to delete this listing."},
                status=status.HTTP_403_FORBIDDEN
            )

        house.delete()
        return Response({"detail": "House deleted successfully."}, status=status.HTTP_200_OK)

    except House.DoesNotExist:
        return Response({"detail": "House not found."}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, room_id):
    try:
        buyer_id, seller_id = room_id.split('_')
        buyer_id, seller_id = int(buyer_id), int(seller_id)

        chat_room = ChatRoom.objects.get(buyer_id=buyer_id, seller_id=seller_id,)
    except (ValueError, ChatRoom.DoesNotExist):
        return Response({'detail': 'Chat room not found.'}, status=404)

    messages = chat_room.messages.all().order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_chat_rooms(request):
    user = request.user
    chat_rooms = ChatRoom.objects.filter(models.Q(buyer=user) | models.Q(seller=user))
    serializer = ChatRoomSerializer(chat_rooms, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order = Order.objects.create(
            buyer=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            totalPrice=data['totalPrice'],
        )

        for i in orderItems:
            house = House.objects.get(_id=i['house'])
            item = OrderItem.objects.create(
                house=house,
                order=order,
                name=i['name'],
                price=i['price'],
                image=house.image.url
            )

            house.available = False
            house.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderbyId(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.buyer == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'You are not authorized to view this order.'}, status=status.HTTP_403_FORBIDDEN)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data

    # Safely get the 'username' and 'email', default to current values if not provided
    user.username = data.get('username', user.username)  # If 'username' is not in data, use current name
    user.email = data.get('email', user.email)  # If 'email' is not in data, use current email

    # Safely handle password, update only if it's provided
    password = data.get('password', '')  # Default to an empty string if password is not provided
    if password:  # If password is not an empty string
        user.password = make_password(password)

    user.save()  # Save the user object with updated fields
    return Response(serializer.data)  # Return the serialized user data as a response

import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    print("User:", request.user)  # Debugging user info
    if request.user.role.lower() != 'buyer':
        raise PermissionDenied("You do not have permission to view these orders.")

    user = request.user
    orders = Order.objects.filter(buyer=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    order.isPaid = True
    order.paidAt = timezone.now()  # Set paidAt timestamp to now
    order.save()

    return Response({
        'message': 'Order marked as paid',
        'isPaid': order.isPaid,
        'paidAt': order.paidAt.strftime('%Y-%m-%d %H:%M:%S')  # Return formatted date
    }, status=status.HTTP_200_OK)