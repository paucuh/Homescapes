from django.urls import path
from base import views

urlpatterns = [
    path('houses/', views.getHouses, name="houses"),
    path('house/<str:pk>/', views.getHouse, name="house"),
    path('users/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register', views.registerUser, name='register'),
    path('users/profile/', views.getUserProfile, name='user-profile'),
    path('houses/create/', views.create_house, name='house-create'),
    path('users/register/', views.registerUser, name='register'),
    path('houses/search/', views.searchHouses, name='search'),
    path('user/houses/', views.getUserHouses, name='user-houses'),
    path('house/update/<str:pk>/', views.updateHouse, name='house-update'),
]
