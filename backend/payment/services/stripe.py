"""Stripe services."""

from decimal import Decimal
from typing import Any, Callable, Dict
import uuid

import stripe
from django.conf import settings
from django.contrib.auth import get_user_model

from core.services import Amount, to_money

from ..models import Payment
from ..selectors import payment_get
from .common import external_payment_capture, external_payment_create
from typing import Optional

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY


def stripe_payment_create(
    *,
    payer: User,
    amount: Decimal,
    currency: str = "usd",

):
    """Create Stripe PaymentIntent and commit to database.
    
    Args:
        payer: The user making the payment
        amount: Payment amount in decimal format
        currency: Currency code (default: 'usd')
        
    Returns:
        stripe.PaymentIntent: The created PaymentIntent object with client_secret.
    """

    print(f"DEBUG: payer type: {type(payer)}, payer: {payer}")
    print(f"DEBUG: amount type: {type(amount)}, amount: {amount}")
    
    idempotency_key = f"create-{payer.id}-{uuid.uuid4()}"
    try:
        
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),
            currency=currency,
            idempotency_key=idempotency_key
        )
        print(f"DEBUG: Stripe PaymentIntent created successfully: {payment_intent.get('id')}")
    except stripe.StripeError as e:
        print(f"DEBUG: Stripe API error: {str(e)}")
        raise ValueError(f"Stripe API error: {str(e)}")

    external_payment_create(
        payer=payer,
        amount=amount,
        gateway_payment_id=payment_intent.get("id"),
        platform=Payment.Platforms.STRIPE,
        status=Payment.Status.PENDING,
    )
    return payment_intent


def stripe_payment_capture(
    *,
    payment_id: str,
    capture_payment_func: Callable[[User, Amount], Any],
) -> Dict[str, Any]:
    """Capture Stripe payment and commit to database.
    
    Retrieves a PaymentIntent from Stripe, verifies it's succeeded,
    finds the corresponding payment in the local database, and marks
    it as captured.
    
    Args:
        payment_id: Stripe PaymentIntent ID
        capture_payment_func: Callback function to execute after capture
        
    Returns:
        stripe.PaymentIntent: The created PaymentIntent object with client_secret.
        
    Raises:
        ValueError: If payment hasn't succeeded or not found in database
    """

    payment_intent = stripe.PaymentIntent.retrieve(payment_id)

    if payment_intent.status != "succeeded":
        raise ValueError(f"PaymentIntent {payment_id} has not been paid yet (status={payment_intent.status}).")

    external_payment = payment_get(gateway_payment_id=payment_id)

    if not external_payment:
        raise ValueError(f"Payment {payment_id} not found in local database.")

    external_payment_capture(
        payment=external_payment,
        capture_payment_func=capture_payment_func,
    )

    return payment_intent

def stripe_payment_cancel(payment_id: str) -> Dict[str, Any]:
    """Cancel a Stripe PaymentIntent.
    
    Args:
        payment_id: Stripe PaymentIntent ID to cancel
        
    Returns:
        Dict[str, Any]: Stripe PaymentIntent object after cancellation
    """
    try:
        payment_intent = stripe.PaymentIntent.cancel(payment_id, idempotency_key=f"cancel-{payment_id}-{uuid.uuid4()}")

    except stripe.StripeError as e:
        raise ValueError(f"Stripe API error: {str(e)}")

    external_payment = payment_get(gateway_payment_id=payment_id)

    if not external_payment:
        raise ValueError(f"Payment {payment_id} not found in local database.")
    
    external_payment.status = Payment.Status.CANCELED
    external_payment.save(update_fields=["status"])

    return payment_intent

def stripe_refund_create(
    *,
    payment_id: str,
    amount: Optional[Decimal] = None
) -> Dict[str, Any]:
    """
    Create a refund for a Stripe PaymentIntent and update local payment status.

    This function requests a refund from Stripe for the specified PaymentIntent.  
    If `amount` is not provided, a full refund is issued. After the refund is created,  
    the corresponding local Payment record is updated to `REFUNDED`.

    Args:
        payment_id (str): The Stripe PaymentIntent ID to refund.
        amount (Optional[Decimal]): Amount to refund (in decimal format).  
            If None, the full payment amount will be refunded.

    Returns:
        Dict[str, Any]: The Stripe Refund object containing refund details.

    Raises:
        ValueError: If the PaymentIntent is not found in the local database.
        stripe.error.StripeError: If Stripe API call fails.
    """

    payment_intent = stripe.PaymentIntent.retrieve(payment_id)

    try:
        refund = stripe.Refund.create(
            payment_intent=payment_id, 
            amount=int(amount * 100) if amount else None, 
            idempotency_key=f"refund-{payment_id}-{uuid.uuid4()}"
        )
    except stripe.StripeError as e:
        raise ValueError(f"Stripe API error: {str(e)}")

    external_payment = payment_get(gateway_payment_id=payment_id)
    if not external_payment:
        raise ValueError(f"Payment {payment_id} not found in local database.")
    
    external_payment.status = Payment.Status.REFUNDED
    external_payment.save(update_fields=["status"])
    return refund
