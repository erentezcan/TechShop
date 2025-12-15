import stripe
import requests
from django.conf import settings
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated 
from .models import Product, Order, Category
from .serializers import ProductSerializer, OrderSerializer, RegisterSerializer, CategorySerializer
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# --- GÜVENLİK GÜNCELLEMESİ ---
stripe.api_key = settings.STRIPE_SECRET_KEY
endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')

# 0. KATEGORİ LİSTELEME
class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)

from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

# 1. ÜRÜN LİSTELEME
class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filtreleme: Kategori
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category) # ID'ye göre filtrele
            
        # Sıralama: "ordering" (?ordering=-rating gibi)
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            queryset = queryset.order_by(ordering)
            
        return queryset

class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

# 2. SİPARİŞ OLUŞTURMA
class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 3. KAYIT OLMA
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# 4. ÖDEME OLUŞTURMA (GERÇEK MOD)
class CreatePaymentIntent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            amount = data.get('amount', 100)
            
            # Frontend "123.45" gibi string yollayabilir, float yapıp 100 ile çarpıp int yapıyoruz.
            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),
                currency='try',
                metadata={'integration_check': 'accept_a_payment'},
            )
            return Response({'clientSecret': intent.client_secret})
        except Exception as e:
            print(f"Stripe Hatası: {str(e)}")
            return Response({'error': str(e)}, status=400)

# 5. SİPARİŞ GEÇMİŞİ
class MyOrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

# 6. STEAM ARAMA (YENİ)
class SteamSearchAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        term = request.query_params.get('term', '')
        if not term:
            return Response({'error': 'No search term provided'}, status=400)
            
        print(f"--- Local Search: {term} ---")
        
        # Sadece Yerel Veritabanı Araması
        results = []
        try:
            # Yerel ürünleri ara
            products = Product.objects.filter(name__icontains=term)
            
            for prod in products:
                results.append({
                    'id': prod.id,
                    'name': prod.name,
                    'price': float(prod.price) if prod.price else 0.0,
                    'price_formatted': f"{prod.price} TL" if prod.price else "Free",
                    'image': prod.image_url,
                    'source': 'local',
                    'rating': prod.rating
                })
                
        except Exception as e:
            print(f"Search Error: {e}")
            return Response({'error': str(e)}, status=500)

        return Response({'results': results, 'total': len(results)})

# 7. WEBHOOK (RELIABILITY)
@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    permission_classes = (AllowAny,) # Stripe'dan geleceği için public olmalı

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return Response({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError as e:
            return Response({'error': 'Invalid signature'}, status=400)

        # Eventleri dinle
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            print(f"💰 Ödeme Başarılı: {payment_intent['id']}")
            # BURADA: Order.objects.get(...) ile siparişi bulup is_paid=True yapabiliriz.
            # Şimdilik logluyoruz.

        return Response({'status': 'success'})