"""Project Mixins."""

from django.contrib.auth import get_user_model
from django.http import Http404
from django.shortcuts import get_object_or_404

from .models import Project
from .services import BENEFICIARY_MODEL_MAP, Beneficiary

User = get_user_model()


class BeneficiaryResolutionMixin:
    """Resolve Beneficiary from request."""

    def get_project(self, project_id: int) -> Project:  # noqa
        return get_object_or_404(Project, id=project_id)

    def get_beneficiary(
        self,
        assignable_type: str,
        assignable_id: int,
    ) -> Beneficiary:  # noqa
        beneficiary_model = BENEFICIARY_MODEL_MAP.get(assignable_type)

        if not beneficiary_model:
            raise Http404

        return get_object_or_404(beneficiary_model, id=assignable_id)


class PrefetchBeneficiaryMixin:
    """Prefetch related User and UserGroup instances for serializer context."""

    def get_serializer_context(self):
        """Add plausible prefetched User and UserGroup instances."""
        context = super().get_serializer_context()
        qs = self.get_queryset()

        assignable_ids = qs.values_list("assignable_id", flat=True)
        assignable_types = qs.values_list("assignable_type", flat=True).distinct()

        for beneficiary_type, beneficiary_model in BENEFICIARY_MODEL_MAP.items():
            if beneficiary_type in assignable_types:
                beneficiaries = beneficiary_model.objects.filter(id__in=assignable_ids)
                context[f"{beneficiary_type}_map"] = {beneficiary.id: beneficiary for beneficiary in beneficiaries}

        return context
