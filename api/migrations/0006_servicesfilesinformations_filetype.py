# Generated by Django 3.2.3 on 2021-06-19 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20210619_1614'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicesfilesinformations',
            name='filetype',
            field=models.TextField(default=''),
        ),
    ]
