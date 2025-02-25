from django.contrib import admin
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ("id", "donor", "amount", "campaign")
    search_fields = ("donor__email", "campaign")
    ordering = ("-amount",)
    list_filter = ("donor",)
