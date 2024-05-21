from django.contrib import admin # type: ignore
from django.urls import path, include # type: ignore
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # type: ignore
from . import views
urlpatterns = [
   path('',views.home,name='home')
]