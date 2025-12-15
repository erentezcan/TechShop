from django.contrib import admin
from .models import Category, Product, Order, OrderItem

# Kategoriler
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

# Ürünler
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Sadece var olan alanları listele
    list_display = ['name', 'price', 'category', 'rating']
    list_editable = ['price'] # Fiyatı listeden hızlıca değiştirebilirsin
    search_fields = ['name'] # Arama çubuğu ekle
    list_filter = ['category']

# Sipariş Detayları (Inline)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # Boş satır gösterme
    readonly_fields = ['product', 'price', 'quantity']
    can_delete = False

# Siparişler
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'is_paid', 'created_at']
    list_filter = ['created_at', 'is_paid']
    search_fields = ['user__username', 'id']
    inlines = [OrderItemInline] # Siparişin içindeki ürünleri göster