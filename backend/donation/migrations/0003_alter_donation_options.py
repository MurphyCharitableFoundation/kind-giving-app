# Generated by Django 4.2.19 on 2025-05-30 18:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('donation', '0002_alter_donation_campaign'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='donation',
            options={'ordering': ['-created']},
        ),
    ]
