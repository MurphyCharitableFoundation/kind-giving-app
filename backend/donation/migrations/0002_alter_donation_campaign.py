# Generated by Django 4.2.19 on 2025-03-10 04:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("campaign", "0001_initial"),
        ("donation", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="donation",
            name="campaign",
            field=models.ForeignKey(
                help_text="Campaign supported by donation.",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="donations",
                to="campaign.campaign",
            ),
        ),
    ]
