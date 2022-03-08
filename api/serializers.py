from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_jwt.settings import api_settings
from django.contrib.auth import authenticate
from .models import ServicesInputData, ServicesFilesInformations, VehiclesInputData


# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email',)



class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'email', 'password')



class ServicesInputDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesInputData
        fields = ('insert_date', 'columns', 'username', 'values', 'filename')         


       
class ServicesFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesFilesInformations
        fields = ('username', 'filetype', 'filename', 'columns', 'coords_columns', 'key_column', 'infos_columns','last_modified')         


       

class VehiclesInputDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiclesInputData
        fields = ('insert_date', 'columns', 'username', 'values', 'filename')         




          




# Register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        #extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], 
                                        validated_data['email'],
                                        validated_data['password'])

        return user


