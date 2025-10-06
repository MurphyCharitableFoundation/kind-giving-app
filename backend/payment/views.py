"""Payment Views."""

import logging

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.urls import reverse
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    OpenApiResponse,
    extend_schema,
    extend_schema_serializer,
)
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .services import (
    paypal_payment_cancel,
    paypal_payment_capture,
    paypal_payment_create,
    stripe_payment_create,
)

logger = logging.getLogger("payment")
User = get_user_model()


@extend_schema_serializer(component_name="CreatePayPalPayment")
class CreatePayPalPaymentView(APIView):
    """Create PayPal Payment View."""

    class InputSerializer(serializers.Serializer):
        """PayPal Payment Input Serializer."""

        amount = serializers.CharField()
        currency = serializers.CharField(default="USD", required=False)
        payer_id = serializers.IntegerField()

    class OutputSerializer(serializers.Serializer):
        """PayPal Payment Output Serializer."""

        id = serializers.CharField()
        status = serializers.CharField(required=False)
        links = serializers.ListField(child=serializers.DictField(), required=False)

    @extend_schema(
        request=InputSerializer,
        responses={
            201: OutputSerializer,
            400: OpenApiResponse(description="Invalid or missing input."),
        },
        examples=[
            OpenApiExample(
                name="Valid Request",
                value={"amount": "10.00", "currency": "USD", "payer_id": 1},
                request_only=True,
            ),
            OpenApiExample(
                name="Valid Response",
                value={
                    "id": "7DL65867YS292100Y",
                    "status": "PAYER_ACTION_REQUIRED",
                    "payment_source": {"paypal": {}},
                    "links": [
                        {
                            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/7DL65867YS292100Y",  # noqa
                            "rel": "self",
                            "method": "GET",
                        },
                        {
                            "href": "https://www.sandbox.paypal.com/checkoutnow?token=7DL65867YS292100Y",  # noqa
                            "rel": "payer-action",
                            "method": "GET",
                        },
                    ],
                },
                response_only=True,
            ),
        ],
    )
    def post(self, request):
        """Create PayPal Payment."""
        amount = request.data.get("amount")
        currency = request.data.get("currency", "USD")
        payer_id = request.data.get("payer_id")
        return_url = request.build_absolute_uri(reverse("paypal-capture"))
        cancel_url = request.build_absolute_uri(reverse("paypal-cancel"))

        if not amount:
            return Response({"amount": "Amount is required."}, status=400)

        payer = get_object_or_404(User, pk=payer_id)
        paypal_payment_data = paypal_payment_create(
            payer=payer,
            amount=amount,
            currency=currency,
            return_url=return_url,
            cancel_url=cancel_url,
        )

        return Response(paypal_payment_data, status=201)


@extend_schema_serializer(component_name="CapturePayPalPayment")
class CapturePayPalPaymentView(APIView):
    """Execute PayPal Payment View."""

    class InputSerializer(serializers.Serializer):
        """Input for capturing PayPal payment."""

        token = serializers.CharField(help_text="PayPal PaymentID or Token returned after user approval.")

    class OutputSerializer(serializers.Serializer):
        """Output for captured PayPal payment response."""

        id = serializers.CharField()
        status = serializers.CharField()
        amount = serializers.DictField(required=False)
        links = serializers.ListField(child=serializers.DictField(), required=False)

    @extend_schema(
        request=InputSerializer,
        parameters=[
            OpenApiParameter(
                name="token",
                type=str,
                location=OpenApiParameter.QUERY,
                required=True,
                description="PayPal order ID used to capture the payment.",
            )
        ],
        responses={
            200: OutputSerializer,
            400: OpenApiResponse(description="Capture failed or bad request."),
            404: OpenApiResponse(description="Payment not found."),
        },
        examples=[
            OpenApiExample(
                name="Successful Capture",
                value={
                    "id": "6DL65867YS292100Y",
                    "status": "COMPLETED",
                    "payment_source": {
                        "paypal": {
                            "email_address": "lender@mcf.com",
                            "account_id": "TAE6M66KTEVRW",
                            "account_status": "VERIFIED",
                            "name": {"given_name": "John", "surname": "Doe"},
                            "address": {"country_code": "US"},
                        }
                    },
                    "purchase_units": [
                        {
                            "reference_id": "default",
                            "shipping": {
                                "name": {"full_name": "John Doe"},
                                "address": {
                                    "address_line_1": "1 Main St",
                                    "admin_area_2": "San Jose",
                                    "admin_area_1": "CA",
                                    "postal_code": "95131",
                                    "country_code": "US",
                                },
                            },
                            "payments": {
                                "captures": [
                                    {
                                        "id": "2D909796HK759514R",
                                        "status": "COMPLETED",
                                        "amount": {
                                            "currency_code": "USD",
                                            "value": "200.00",
                                        },
                                        "final_capture": True,
                                        "seller_protection": {
                                            "status": "ELIGIBLE",
                                            "dispute_categories": [
                                                "ITEM_NOT_RECEIVED",
                                                "UNAUTHORIZED_TRANSACTION",
                                            ],
                                        },
                                        "seller_receivable_breakdown": {
                                            "gross_amount": {
                                                "currency_code": "USD",
                                                "value": "200.00",
                                            },
                                            "paypal_fee": {
                                                "currency_code": "USD",
                                                "value": "6.10",
                                            },
                                            "net_amount": {
                                                "currency_code": "USD",
                                                "value": "193.90",
                                            },
                                            "receivable_amount": {
                                                "currency_code": "CAD",
                                                "value": "266.20",
                                            },
                                            "exchange_rate": {
                                                "source_currency": "USD",
                                                "target_currency": "CAD",
                                                "value": "1.37288780487805",
                                            },
                                        },
                                        "links": [
                                            {
                                                "href": "https://api.sandbox.paypal.com/v2/payments/captures/2D909796HK759514R",  # noqa
                                                "rel": "self",
                                                "method": "GET",
                                            },
                                            {
                                                "href": "https://api.sandbox.paypal.com/v2/payments/captures/2D909796HK759514R/refund",  # noqa
                                                "rel": "refund",
                                                "method": "POST",
                                            },
                                            {
                                                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/6DL65867YS292100Y",  # noqa
                                                "rel": "up",
                                                "method": "GET",
                                            },
                                        ],
                                        "create_time": "2025-04-11T21:53:08Z",
                                        "update_time": "2025-04-11T21:53:08Z",
                                    }
                                ]
                            },
                        }
                    ],
                    "payer": {
                        "name": {"given_name": "John", "surname": "Doe"},
                        "email_address": "lender@mcf.com",
                        "payer_id": "TAE6M66KTEVRW",
                        "address": {"country_code": "US"},
                    },
                    "links": [
                        {
                            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/6DL65867YS292100Y",  # noqa
                            "rel": "self",
                            "method": "GET",
                        }
                    ],
                },
                response_only=True,
            )
        ],
    )
    def get(self, request):
        """Capture PayPal Payment."""
        try:
            token = request.GET.get("token")
            paypal_payment_capture_data = paypal_payment_capture(
                payment_id=token,
                capture_payment_func=lambda user, amount: None,
            )
            return Response(paypal_payment_capture_data)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


@extend_schema_serializer(component_name="CancelPayPalPayment")
class CancelPayPalPaymentView(APIView):
    """Cancel PayPal Payment View."""

    class InputSerializer(serializers.Serializer):
        """Cancel PayPal Payment Input."""

        paymentId = serializers.CharField(help_text="The PayPal payment ID to cancel.")

    class OutputSerializer(serializers.Serializer):
        """Cancel PayPal Payment Output."""

        message = serializers.CharField()

    @extend_schema(
        request=InputSerializer,
        parameters=[
            OpenApiParameter(
                name="paymentId",
                type=str,
                location=OpenApiParameter.QUERY,
                required=True,
                description="The PayPal payment ID to cancel.",
            ),
        ],
        responses={
            200: OutputSerializer,
            400: OpenApiResponse(description="Cancel failed or bad request."),
            404: OpenApiResponse(description="Payment not found."),
        },
        examples=[
            OpenApiExample(
                name="Successful Cancel",
                value={"message": "Payment canceled."},
                response_only=True,
            ),
        ],
    )
    def get(self, request):
        """Cencel PayPal Payment."""
        try:
            payment_id = request.GET.get("paymentId")
            paypal_payment_cancel(payment_id=payment_id)
            return Response(
                {"message": "Payment canceled."},
                status=200,
            )
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


@extend_schema_serializer(component_name="CreateStripePayment")
class CreateStripePaymentView(APIView):
    """Create Stripe Payment View."""

    class InputSerializer(serializers.Serializer):  # noqa
        amount = serializers.DecimalField(
            max_digits=10,
            decimal_places=2,
            min_value=0.50,
            help_text="Payment amount in decimal format (e.g. 10.50)",
        )
        currency = serializers.CharField(default="usd", required=False)

    class OutputSerializer(serializers.Serializer):  # noqa
        client_secret = serializers.CharField()

    @extend_schema(
        request=InputSerializer,
        responses={
            201: OutputSerializer,
            400: OpenApiResponse(description="Invalid or missing input."),
        },
        examples=[
            OpenApiExample(
                name="Valid Request",
                value={"amount": "20.00", "currency": "usd"},
                request_only=True,
            ),
            OpenApiExample(
                name="Valid Response",
                value={"client_secret": "some_client_secret_value"},
                response_only=True,
            ),
        ],
    )
    def post(self, request):
        """Create Stripe Payment."""
        logger.info(
            f"Starting Stripe payment process: amount={request.data.get('amount')}, "
            f"currency={request.data.get('currency', 'usd')}"
        )

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        amount = serializer.validated_data.get("amount")
        currency = serializer.validated_data.get("currency", "usd")

        try:
            stripe_payment_data = stripe_payment_create(
                amount=amount,
                currency=currency,
            )

            logger.info(
                f"Stripe PaymentIntent criado: id={stripe_payment_data.id}, "
                f"amount={amount}, currency={currency}, user={request.user}"
            )

            output_serializer = self.OutputSerializer(data={"client_secret": stripe_payment_data.get("client_secret")})

            output_serializer.is_valid(raise_exception=True)

            return Response(output_serializer.data, status=201)

        except Exception:
            logger.error("Stripe payment failed", exc_info=True)
            return Response({"error": "Stripe payment failed"}, status=400)
