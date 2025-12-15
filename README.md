# TechShop - Profesyonel E-Ticaret Platformu

TechShop, dijital oyun anahtarları satın almak için tasarlanmış tam kapsamlı bir e-ticaret uygulamasıdır. Modern, duyarlı bir React ön yüzü ve sağlam bir Django REST Framework arka yüzüne sahiptir.

## 🚀 Özellikler

-   **Modern Arayüz (UI/UX):** Karanlık temalı, cam efektli (glassmorphism) ve akıcı animasyonlara sahip duyarlı tasarım.
-   **Kullanıcı Doğrulama:** Güvenli, JWT tabanlı kayıt olma ve giriş yapma sistemi.
-   **Misafir Erişimi:** Misafirler ürünleri gezebilir, ancak satın alma işlemi için giriş yapmaları gerekir.
-   **Ürün Yönetimi:** Kategoriler, filtreleme, sıralama ve Steam benzeri arama motoru.
-   **Alışveriş Sepeti:** Yerel depolama (Local Storage) ile kalıcı, gerçek zamanlı sepet yönetimi.
-   **Ödeme Sistemi:** Güvenilirlik için Webhook desteğiyle entegre edilmiş Stripe ödeme altyapısı.
-   **Profil Sayfası:** Sipariş geçmişi takibi ve kullanıcı istatistikleri.
-   **Yönetim Paneli:** Ürünler, siparişler ve kullanıcılar üzerinde tam kontrol sağlayan Admin paneli.
-   **Performans:** Görseller için "Lazy Loading" (Tembel Yükleme) ve sunucu taraflı sayfalama (Pagination).

## 🛠️ Teknoloji Yığını

### Frontend (Ön Yüz)
-   **React 18** (Vite altyapısı ile)
-   **React Router DOM** (Sayfa Yönlendirme)
-   **Axios** (API İstekleri)
-   **React Toastify** (Bildirimler)
-   **Stripe.js** (Ödeme Arayüzü)

### Backend (Arka Yüz)
-   **Django 5**
-   **Django REST Framework**
-   **SQLite** (Geliştirme Veritabanı)
-   **Simple JWT** (Token Tabanlı Kimlik Doğrulama)
-   **Stripe Python SDK**

## 📦 Kurulum Rehberi

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/erentezcan/TechShop.git
cd TechShop
```

### 2. Backend Kurulumu
```bash
cd backend
python -m venv venv
# Windows için
venv\Scripts\activate
# Mac/Linux için
source venv/bin/activate

pip install -r requirements.txt

# Veritabanı Göçleri (Migrations)
python manage.py migrate

# Yönetici (Admin) Oluşturma
python manage.py createsuperuser

# Sunucuyu Başlatma
python manage.py runserver
```

### 3. Frontend Kurulumu
Yeni bir terminal açın:
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Çevresel Değişkenler (.env)

`backend/` klasörü içinde bir `.env` dosyası oluşturun ve şu bilgileri ekleyin:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📷 Kullanım

-   **Frontend (Site):** `http://localhost:5173`
-   **Backend API:** `http://localhost:8001/api/`
-   **Admin Paneli:** `http://localhost:8001/admin/`

---
[Eren Tezcan] tarafından ❤️ ile geliştirildi.
