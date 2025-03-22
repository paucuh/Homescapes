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

@api_view(['POST'])
def registerUser(request):
    data = request.data
    user = CustomUser.objects.create_user(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        role=data.get('role', 'Buyer')
    )
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


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
@permission_classes([IsAuthenticated, IsSeller])
def create_house(request):
    serializer = HouseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # Create the user instance
        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'Buyer'),  # Default to Buyer if not passed
            password=make_password(data['password'])  # Hash the password before saving
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