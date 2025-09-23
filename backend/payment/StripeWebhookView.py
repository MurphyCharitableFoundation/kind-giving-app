import stripe
import logging
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Payment
from .services.stripe import stripe_payment_capture
from .selectors import payment_get

logger = logging.getLogger("payment")
stripe.api_key = settings.STRIPE_SECRET_KEY

@extend_schema(exclude=True)
@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    """Handle Stripe Webhook events."""

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Stripe webhook signature verification failed: {e}")
            return HttpResponse(status=400)

        event_type = event["type"]
        data = event["data"]["object"]

        if event_type == "payment_intent.succeeded":
            payment_id = data["id"]
            stripe_payment_capture(
                payment_id=payment_id,
                capture_payment_func=lambda user, amount: logger.info(
                    f"Credited {amount} to {user}"
                ),
            )
            logger.info(f"PaymentIntent {payment_id} succeeded.")

        elif event_type == "payment_intent.payment_failed":
            payment_id = data["id"]
            error_msg = data["last_payment_error"]["message"] if data.get("last_payment_error") else "Unknown error"
            payment = payment_get(gateway_payment_id=payment_id)
            if payment:
                payment.status = Payment.Status.FAILED
                payment.save(update_fields=["status"])
                logger.warning(f"PaymentIntent {payment_id} failed: {error_msg}")
            else:
                logger.warning(f"PaymentIntent {payment_id} failed but not found in DB.")

        elif event_type == "charge.refunded":
            charge_id = data["id"]
            payment = payment_get(gateway_payment_id=charge_id)
            if payment:
                payment.status = Payment.Status.REFUNDED
                payment.save(update_fields=["status"])
                logger.info(f"Charge {charge_id} refunded.")
            else:
                logger.warning(f"Refund event for charge {charge_id} not found in DB.")

        else:
            logger.debug(f"Unhandled Stripe event: {event_type}")

        return JsonResponse({"status": "ok"})
