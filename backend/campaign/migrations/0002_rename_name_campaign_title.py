# Generated by Django 3.2.25 on 2025-02-06 14:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('campaign', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='campaign',
            old_name='name',
            new_name='title',
        ),
    ]
