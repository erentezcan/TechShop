import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { FaLock, FaCreditCard } from 'react-icons/fa';

// --- ⚠️ BURAYI DÜZENLE ⚠️ ---
// Stripe panelinden aldığın 'Publishable Key'i (pk_test_...) buraya yapıştır.
const stripePromise = loadStripe("pk_test_51ScSJNHUmAxGfErhG7ZObew7Tlf5Bcu9z0Irmwr1h8PfY0Qk2CTgbyuLhKpVZF01hHwPjPIL0HaB4g3XPV0qGkxS00h14sPjX2");

const CheckoutForm = ({ total, onClose, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Backend'den izin iste
    axios.post("http://127.0.0.1:8001/api/create-payment-intent/", { amount: total })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => {
        console.error("Ödeme hatası:", err);
        setError("Sunucuya bağlanılamadı veya anahtar hatalı.");
      });
  }, [total]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setProcessing(false);
      return;
    }

    // Kart bilgilerini Stripe'a gönder
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: "Gamer User" },
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        onPaymentSuccess(); // Başarılı!
      }
    }
  };

  // Kart Stili
  const cardElementOptions = {
    style: {
      base: {
        color: "#ffffff",
        fontFamily: '"Segoe UI", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": { color: "#888" },
        iconColor: "#6dc849",
      },
      invalid: { color: "#ff4d4d", iconColor: "#ff4d4d" },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="payment-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCreditCard size={24} color="#6dc849" />
          <h2 style={{ margin: 0, fontSize: '20px', color: 'white' }}>Kart Bilgileri</h2>
        </div>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>İptal</button>
      </div>

      <div className="stripe-card-container" style={{
        backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #444'
      }}>
        <CardElement options={cardElementOptions} />
      </div>

      {error && <div className="payment-error" style={{ color: '#ff4d4d', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

      <button className="pay-btn" disabled={!stripe || processing || !clientSecret} style={{
        width: '100%', padding: '15px', backgroundColor: '#6dc849', border: 'none', borderRadius: '8px',
        color: 'black', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        opacity: (!stripe || processing || !clientSecret) ? 0.7 : 1
      }}>
        {processing ? (
          <>
            <span className="spinner-border" style={{ marginRight: '10px' }}></span>
            İşleniyor...
          </>
        ) : (
          <>
            {total} TL Öde <FaLock size={14} />
          </>
        )}
      </button>
    </form>
  );
};

const RealPaymentModal = ({ total, onClose, onConfirm }) => (
  <div className="payment-overlay" style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  }}>
    <div className="payment-card fade-in" style={{
      backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '450px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #333'
    }}>
      <Elements stripe={stripePromise}>
        <CheckoutForm total={total} onClose={onClose} onPaymentSuccess={onConfirm} />
      </Elements>
    </div>
  </div>
);

export default RealPaymentModal;