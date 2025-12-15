import React, { useState } from 'react';
import { FaTrash, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import RealPaymentModal from './RealPaymentModal';
import api from '../api';
import { toast } from 'react-toastify';

const Cart = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
        toast.info("Ürün sepetten kaldırıldı.");
    };

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);

    const handlePaymentSuccess = () => {
        // Kart bilgilerini backend'e gönder ve siparişi oluştur
        const orderData = {
            items: cart.map(item => ({
                product: item.id,
                quantity: 1,
                price: item.price
            })),
            total_price: total
        };

        api.post('orders/create/', orderData)
            .then(res => {
                console.log("Sipariş oluşturuldu:", res.data);
                setCart([]); // Sepeti boşalt
                setShowPaymentModal(false);
                toast.success("Ödeme Başarılı! Siparişiniz alındı.");
                navigate('/profile'); // Profil sayfasına yönlendir ki görsün
            })
            .catch(err => {
                console.error("Sipariş oluşturma hatası:", err);
                toast.error("Ödeme alındı ancak sipariş kaydedilirken sistemsel bir sorun oluştu.");
            });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#151515', color: 'white' }}>
            <Header />
            <div className="container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#ccc', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
                    <FaArrowLeft /> Alışverişe Dön
                </button>

                <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>Sepetim ({cart.length})</h1>

                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#202020', borderRadius: '8px' }}>
                        <h2>Sepetiniz boş.</h2>
                        <p style={{ color: '#aaa', marginTop: '10px' }}>Oyunlara göz atıp sepetinize ekleyebilirsiniz.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        {/* Cart Items */}
                        <div style={{ flex: 2 }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#202020', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                                    <img src={item.image_url} alt={item.name} loading="lazy" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, fontSize: '18px' }}>{item.name}</h3>
                                        <div style={{ color: '#aaa', fontSize: '14px' }}>Dijital Lisans</div>
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.price} TL</div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '18px' }}>
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ backgroundColor: '#202020', padding: '30px', borderRadius: '8px', position: 'sticky', top: '20px' }}>
                                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Sipariş Özeti</h2>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#ccc' }}>
                                    <span>Ara Toplam</span>
                                    <span>{total} TL</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                                    <span>Toplam</span>
                                    <span>{total} TL</span>
                                </div>
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '15px', fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                                >
                                    <FaCreditCard /> Ödeme Yap
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showPaymentModal && (
                    <RealPaymentModal
                        total={total}
                        onClose={() => setShowPaymentModal(false)}
                        onConfirm={handlePaymentSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default Cart;
