# Generated by Django 3.2.3 on 2021-06-19 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_data_servicesinputdata_values'),
    ]

    operations = [
        migrations.CreateModel(
            name='ServicesFilesInformations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=50)),
                ('filename', models.TextField(default='')),
                ('columns', models.TextField(default='')),
                ('last_modified', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='servicesinputdata',
            name='columns',
        ),
    ]
