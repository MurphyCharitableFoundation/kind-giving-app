"""Test common services."""

from django.contrib.auth import get_user_model
from django.test import TestCase

from core.services import to_money
from payment.models import Payment
from payment.services.common import (
    external_payment_capture,
    external_payment_create,
)

User = get_user_model()


class ExternalPaymentServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@example.com", password="pass")
        self.amount = "25.00"
        self.gateway_payment_id = "PAYPAL123"

    def test_external_payment_create_creates_payment(self):
        payment = external_payment_create(
            payer=self.user,
            gateway_payment_id=self.gateway_payment_id,
            amount=self.amount,
        )

        self.assertIsInstance(payment, Payment)
        self.assertEqual(payment.user, self.user)
        self.assertEqual(payment.gateway_payment_id, self.gateway_payment_id)
        self.assertEqual(payment.amount, to_money(float(self.amount)))
        self.assertEqual(payment.status, Payment.Status.PENDING)
        self.assertEqual(payment.platform, Payment.Platforms.PAYPAL)

    def test_external_payment_capture_marks_payment_completed(self):
        """Test payment capture marks payment complete."""
        payment = external_payment_create(
            payer=self.user,
            gateway_payment_id=self.gateway_payment_id,
            amount=self.amount,
        )

        def donation_capture(user, amount):
            return None

        updated_payment = external_payment_capture(payment=payment, capture_payment_func=donation_capture)

        self.assertEqual(updated_payment.status, Payment.Status.COMPLETED)
