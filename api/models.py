from django.db import models


class ServicesInputData(models.Model):
    insert_date  = models.DateTimeField(auto_now_add=True)
    username     = models.CharField(max_length=50, null=False)
    values       = models.TextField(default="", null=False)
    columns       = models.TextField(default="", null=False)
    filename     = models.TextField(default="", null=False)


class VehiclesInputData(models.Model):
    insert_date  = models.DateTimeField(auto_now_add=True)
    username     = models.CharField(max_length=50, null=False)
    values       = models.TextField(default="", null=False)
    columns      = models.TextField(default="", null=False)
    filename     = models.TextField(default="", null=False)


class ServicesFilesInformations(models.Model):
    username      = models.CharField(max_length=50, null=False)
    filetype      = models.TextField(default="", null=False)
    filename      = models.TextField(default="", null=False)
    columns       = models.TextField(default="", null=False)
    coords_columns= models.TextField(default="", null=False)
    key_column    = models.TextField(default="", null=False)
    infos_columns = models.TextField(default="")
    last_modified = models.DateTimeField(auto_now_add=True)

# class PendentesAgora(models.Model):
#     numos        = models.CharField(max_length=10, null=False)
#     codserv      = models.CharField(max_length=5, null=False)
#     codreg       = models.CharField(max_length=5, null=False)
#     data_venc    = models.DateTimeField(null=False)
#     qtd_envios   = models.IntegerField(default=0)
#     origem_sigod = models.CharField(max_length=10, null=False)
#     NOME_POLO    = models.TextField(default="")
#     nome_regiao  = models.TextField(default="")
#     bairro       = models.TextField(default="")
#     equipe       = models.CharField(max_length=10, null=False)
#     dias_vencido = models.IntegerField(default=0)
#     inserted_at  = models.DateTimeField(auto_now_add=True)




