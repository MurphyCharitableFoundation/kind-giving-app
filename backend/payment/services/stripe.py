from decimal import Decimal
import stripe
import requests
from django.conf import settings
from core.services import Amount, to_money
from typing import Any, Callable, Dict, Optional

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from ..models import Payment
from .common import external_payment_capture, external_payment_create
from ..selectors import payment_get

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY


def stripe_payment_create(
    *,
    payer: User,
    amount: Decimal, currency: str="usd"):
    payment_intent= stripe.PaymentIntent.create(
        amount=int(amount * 100), 
        currency=currency
    )

    money_amount = to_money(amount)
    external_payment_create(
        payer=payer,
        amount=money_amount,
        gateway_payment_id=payment_intent.get("id"),
        platform=Payment.Platforms.STRIPE,
    )
    return payment_intent

def stripe_payment_capture(
    *,
    payment_id: str,
    capture_payment_func: Callable[[User, Amount], Any],
) -> Dict[str, Any]:
    """Capture Stripe payment and commit to database."""

    payment_intent = stripe.PaymentIntent.retrieve(payment_id)
   
    if payment_intent.status != 'succeeded':
        raise ValueError(f"PaymentIntent {payment_id} has not been paid yet (status={payment_intent.status}).")

    external_payment = payment_get(gateway_payment_id=payment_id)

    if not external_payment:
        raise ValueError(f"Payment {payment_id} not found in local database.")

    external_payment_capture(
        payment=external_payment,
        capture_payment_func=capture_payment_func,
    )

    return payment_intent