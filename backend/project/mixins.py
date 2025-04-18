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
