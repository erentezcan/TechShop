# Game Zone - Professional E-Commerce Platform

Game Zone is a full-stack e-commerce application designed for purchasing digital game keys. It features a modern, responsive React frontend and a robust Django REST Framework backend.

## 🚀 Features

-   **Modern UI/UX:** Dark-themed, responsive design with glassmorphism effects and smooth animations.
-   **User Authentication:** Secure JWT-based registration and login.
-   **Guest Access:** Browsing allowed for guests, but purchasing requires login.
-   **Product Manangment:** Categories, filtering, sorting, and steam-like search.
-   **Shopping Cart:** Real-time cart management with local storage persistence.
-   **Payments:** Integrated Stripe payment gateway with Webhooks for reliability.
-   **Profile:** Order history tracking and user statistics.
-   **Admin Panel:** Full control over products, orders, and users.
-   **Performance:** Lazy loading images and server-side pagination.

## 🛠️ Technology Stack

### Frontend
-   **React 18** (Vite)
-   **React Router DOM** (Routing)
-   **Axios** (API Requests)
-   **React Toastify** (Notifications)
-   **Stripe.js** (Payments)

### Backend
-   **Django 5**
-   **Django REST Framework**
-   **SQLite** (Development DB)
-   **Simple JWT** (Authentication)
-   **Stripe Python SDK**

## 📦 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/GameZone.git
cd GameZone
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Migrations
python manage.py migrate

# Create Admin User
python manage.py createsuperuser

# Run Server
python manage.py runserver
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📷 Usage

-   **Frontend:** `http://localhost:5173`
-   **Backend API:** `http://localhost:8001/api/`
-   **Admin Panel:** `http://localhost:8001/admin/`

---
Developed with ❤️ by [Your Name]
