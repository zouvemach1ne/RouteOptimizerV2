# Generated by Django 3.2.3 on 2021-06-30 00:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20210628_1324'),
    ]

    operations = [
        migrations.CreateModel(
            name='VehiclesInputData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('insert_date', models.DateTimeField(auto_now_add=True)),
                ('username', models.CharField(max_length=50)),
                ('values', models.TextField(default='')),
                ('columns', models.TextField(default='')),
                ('filename', models.TextField(default='')),
            ],
        ),
    ]
