from django.shortcuts import render
from rest_framework import generics, permissions, serializers, status
from rest_framework import response
from rest_framework.response import Response

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .serializers import UserSerializer, VehiclesInputDataSerializer, ServicesInputDataSerializer, UserSerializerWithToken, RegisterSerializer, ServicesFilesSerializer
from .models import ServicesInputData, ServicesFilesInformations, VehiclesInputData





@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class InsertServicesInputData(APIView):
    serializer_class = ServicesInputDataSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_url_kwarg = 'username'

    def post(self, request):
        user = request.GET.get(self.lookup_url_kwarg)
        serializer = self.serializer_class(data=request.data, many=True)
        if serializer.is_valid():
            ServicesInputData.objects.all().filter(username=user).delete()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InsertVehiclesInputData(APIView):
    serializer_class = VehiclesInputDataSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_url_kwarg = 'username'

    def post(self, request):
        user = request.GET.get(self.lookup_url_kwarg)
        serializer = self.serializer_class(data=request.data, many=True)
        if serializer.is_valid():
            VehiclesInputData.objects.all().filter(username=user).delete()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class InsertServicesFileInfo(APIView):
    serializer_class = ServicesFilesSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_url_kwarg_username = 'username'

    def post(self, request):
        user  = request.GET.get(self.lookup_url_kwarg_username)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            ServicesFilesInformations.objects.all().filter(username=user, filetype=serializer.validated_data["filetype"]).delete() # 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



        

class GetServicesInputData(generics.ListAPIView):
    serializer_class = ServicesInputDataSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = ServicesInputData.objects
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        user = request.GET.get(self.lookup_url_kwarg)
        services = ServicesInputData.objects.all()
        if user != None:
            services = services.filter(username=user)
        serializer = self.serializer_class(services, many=True)
        
        return Response(serializer.data)


class GetVehiclesInputData(generics.ListAPIView):
    serializer_class = VehiclesInputDataSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = VehiclesInputData.objects
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        user = request.GET.get(self.lookup_url_kwarg)
        services = VehiclesInputData.objects.all()
        if user != None:
            services = services.filter(username=user)
        serializer = self.serializer_class(services, many=True)
        
        return Response(serializer.data)




class GetServicesFileInfo(generics.ListAPIView):
    serializer_class = ServicesFilesSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = ServicesFilesInformations.objects
    lookup_url_kwarg = 'username'
    lookup_url_kwarg_filetype = 'filetype'


    def get(self, request, format=None):
        user  = request.GET.get(self.lookup_url_kwarg)
        ftype = request.GET.get(self.lookup_url_kwarg_filetype)
        services = ServicesFilesInformations.objects.all()
        if user != None:
            services = services.filter(username=user)
        if ftype != None:
            services = services.filter(filetype=ftype)
        serializer = self.serializer_class(services, many=True)
        
        return Response(serializer.data)


# # User login
# class UserAPI(generics.GenericAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             return Response({'user': serializer.data, "status": status.HTTP_200_OK}, status=status.HTTP_200_OK)
#         else:
#             return Response({'user': serializer.errors, "status": status.HTTP_406_NOT_ACCEPTABLE}, status=status.HTTP_406_NOT_ACCEPTABLE)

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"callback":UserSerializer(user, context=self.get_serializer_context()), "status": status.HTTP_200_OK}, status=status.HTTP_200_OK)
        else:
            return Response({"callback":serializer.errors, "status":status.HTTP_406_NOT_ACCEPTABLE}, status=status.HTTP_406_NOT_ACCEPTABLE)

