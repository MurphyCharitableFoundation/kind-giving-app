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
from rest_framework.permissions import IsAuthenticated

from .models import Payment
from .services import (
    paypal_payment_cancel,
    paypal_payment_capture,
    paypal_payment_create,
    stripe_payment_create,
    stripe_payment_cancel,
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

    permission_classes = [IsAuthenticated]  # Temporarily disabled for testing
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
        """Create Stripe Payment.
        
        Creates a new Stripe PaymentIntent and stores the payment record
        in the local database. Returns the client_secret needed for the
        frontend to complete the payment process.
        
        Args:
            request: HTTP request containing amount and currency
            
        Returns:
            Response: JSON with client_secret for payment completion
            
        Raises:
            400: If validation fails or Stripe payment creation fails
        """
        logger.info(f"Starting Stripe payment process: amount={request.data.get('amount')}, "
                    f"currency={request.data.get('currency', 'usd')}")
        
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)


        amount = serializer.validated_data.get("amount")
        currency = serializer.validated_data.get("currency", "usd")
        user = request.user

        try:
            stripe_payment_data = stripe_payment_create(
                amount=amount,
                currency=currency,
                payer=user
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
        
@extend_schema_serializer(component_name="CancelStripePayment")
class CancelStripePaymentView(APIView):
    """Cancel Stripe Payment View."""

    permission_classes = [IsAuthenticated]

    class InputSerializer(serializers.Serializer):
        paymentId = serializers.CharField(help_text="The Stripe PaymentIntent ID to cancel.")
    
    class OutputSerializer(serializers.Serializer):
        id = serializers.CharField()
        status = serializers.CharField()

    @extend_schema(
        request=InputSerializer,
        responses={
            204: OpenApiResponse(description="Payment canceled successfully."),
            404: OpenApiResponse(description="Payment not found."),
            400: OpenApiResponse(description="Invalid request."),
        },
        examples=[
            OpenApiExample(
                name="Successful Cancel",
                value={"id": "pi_1Hh1XYZ2eZvKYlo2C0FzX0aY", "status": "canceled"},
                response_only=True,
            ),
            OpenApiExample(
                name="Payment Not Found",
                value={"error": "Payment not found."},
                response_only=True,
            ),
            OpenApiExample(
                name="Invalid Request",
                value={"error": "paymentId is required."},
                response_only=True,
            ),
        ],

    )
    def post(self, request):
        """Cancel Stripe Payment.

        Cancels a Stripe PaymentIntent that is in a cancelable state and 
        updates the corresponding payment record in the local database.
        
        Only PaymentIntents with certain statuses can be canceled:
        - requires_payment_method
        - requires_confirmation  
        - requires_action
        - processing
        - requires_capture

        Args:
            request: HTTP request containing paymentId in the request body

        Returns:
            Response: HTTP 204 (No Content) on successful cancellation
            
        Raises:
            400: If paymentId is missing or invalid, or if PaymentIntent 
                 cannot be canceled due to its current status
            404: If payment record is not found in local database
            401: If user is not authenticated (handled by permission_classes)
        """

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment_id = serializer.validated_data.get("paymentId")

        user = request.user

        logger.info(f"[Stripe] User {user.id} requested cancel of PaymentIntent {payment_id}")

        if not payment_id:
            return Response({"error": "paymentId is required."}, status=400)

        try:
            stripe_payment_cancel(payment_id=payment_id)
            return Response(status=204)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)