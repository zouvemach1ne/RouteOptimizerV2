# Generated by Django 3.2.3 on 2021-06-19 23:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_servicesfilesinformations_filetype'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicesinputdata',
            name='columns',
            field=models.TextField(default=''),
        ),
    ]