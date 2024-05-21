from django.shortcuts import render # type: ignore
from django.contrib.auth.models import User # type: ignore
from rest_framework import generics # type: ignore
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny # type: ignore
from .models import Note
from django.http import HttpResponse # type: ignore
def home(request):
    return HttpResponse("heello i am workingf")