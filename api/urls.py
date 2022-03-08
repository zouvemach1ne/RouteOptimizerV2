from django.contrib.auth.models import User
from django.urls import path, include
from .views import RegisterAPI, current_user, InsertVehiclesInputData, GetVehiclesInputData, UserList, InsertServicesInputData, InsertServicesFileInfo, GetServicesInputData, GetServicesFileInfo
#from knox import views as knox_views

urlpatterns = [
    #path('auth', include('knox.urls')),
    path('register/', RegisterAPI.as_view()),
    path('users/', UserList.as_view()),

    path('ins-serv/', InsertServicesInputData.as_view()),
    path('ins-vehicles/', InsertVehiclesInputData.as_view()),
    path('ins-fileinfo/', InsertServicesFileInfo.as_view()),

    path('get-serv/', GetServicesInputData.as_view()),
    path('get-vehicles/', GetVehiclesInputData.as_view()),
    path('get-fileinfo/', GetServicesFileInfo.as_view()),
    
    path('current_user/', current_user),
]





