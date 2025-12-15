from django.urls import path
from .views import (
    CategoryListAPIView,
    ProductListAPIView, 
    ProductDetailAPIView, 
    OrderCreateAPIView, 
    RegisterView, 
    CreatePaymentIntent,
    MyOrderListAPIView,
    SteamSearchAPIView,
    StripeWebhookView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Kategoriler
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),

    # Ürünler
    path('products/', ProductListAPIView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
    
    # Sipariş ve Ödeme
    path('orders/create/', OrderCreateAPIView.as_view(), name='order-create'),
    path('create-payment-intent/', CreatePaymentIntent.as_view(), name='create-payment-intent'),
    path('webhook/stripe/', StripeWebhookView.as_view(), name='stripe-webhook'),
    
    # Profil (Sipariş Geçmişi)
    path('my-orders/', MyOrderListAPIView.as_view(), name='my-orders'),
    
    # Steam Arama
    path('search/steam/', SteamSearchAPIView.as_view(), name='search-steam'),

    # Auth (Giriş/Kayıt)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]