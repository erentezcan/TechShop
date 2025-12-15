import React, { useEffect, useState } from 'react';
import api from '../api';
import Header from './Header';
import { FaUser, FaHistory, FaGamepad, FaSignOutAlt, FaWallet } from 'react-icons/fa';
import Skeleton from './Skeleton';

function Profile({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'settings'

  // İstatistikler
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalGames: 0,
    memberSince: new Date().getFullYear()
  });

  useEffect(() => {
    api.get('my-orders/')
      .then(res => {
        const orderData = res.data;
        setOrders(orderData);

        // İstatistik Hesapla
        let spent = 0;
        let games = 0;
        orderData.forEach(o => {
          spent += parseFloat(o.total_price);
          games += o.items ? o.items.length : 0;
        });

        setStats({
          totalSpent: spent.toFixed(2),
          totalGames: games,
          memberSince: 2025
        });

        setLoading(false);
      })
      .catch(err => {
        console.error("Siparişler yüklenemedi:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', paddingBottom: '50px' }}>
      <Header />

      <div className="container" style={{ marginTop: '40px', maxWidth: '1200px', margin: '40px auto', display: 'flex', gap: '30px', padding: '0 20px' }}>

        {/* SOL TARA: Sidebar / User Card */}
        <div style={{ flex: '0 0 300px' }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            border: '1px solid #333',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #00ff88, #00b8ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: '900',
              color: '#000',
              margin: '0 auto 20px auto',
              boxShadow: '0 10px 30px rgba(0, 255, 136, 0.3)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>{user.username}</h2>
            <div style={{ color: '#00ff88', fontSize: '14px', marginBottom: '30px', fontWeight: 'bold' }}>PRO MEMBER</div>

            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', color: activeTab === 'orders' ? '#00ff88' : '#888' }} onClick={() => activeTab !== 'orders' && setActiveTab('orders')}>
                <FaHistory /> Order History
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                color: '#ff4444',
                border: '1px solid #ff4444',
                borderRadius: '12px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ff4444';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
                e.currentTarget.style.color = '#ff4444';
              }}
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        {/* SAĞ TARA: İstatistikler ve İçerik */}
        <div style={{ flex: 1 }}>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={statCardStyle}>
              <div style={iconBoxStyle}><FaWallet color="#00ff88" /></div>
              <div>
                <div style={{ color: '#888', fontSize: '12px' }}>Total Spent</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalSpent} ₺</div>
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={iconBoxStyle}><FaGamepad color="#00b8ff" /></div>
              <div>
                <div style={{ color: '#888', fontSize: '12px' }}>Games Owned</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalGames}</div>
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={iconBoxStyle}><FaUser color="#ff00cc" /></div>
              <div>
                <div style={{ color: '#888', fontSize: '12px' }}>Account Age</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>New</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <h3 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Recent Activity</h3>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Skeleton type="title" style={{ width: '100px' }} />
                    <Skeleton type="text" style={{ width: '80px' }} />
                  </div>
                  <Skeleton type="text" />
                  <Skeleton type="text" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#1a1a1a', borderRadius: '15px', color: '#666', border: '1px dashed #333' }}>
              Henüz bir siparişiniz bulunmuyor.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {orders.map((order, index) => (
                <div key={order.id} style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #333',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  transition: 'all 0.2s'
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#555';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a2a', paddingBottom: '10px' }}>
                    <div>
                      <span style={{ color: '#00ff88', fontWeight: 'bold', marginRight: '10px' }}>#{order.id}</span>
                      <span style={{ color: '#888', fontSize: '14px' }}>{formatDate(order.created_at)}</span>
                    </div>
                    <span style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                      COMPLETED
                    </span>
                  </div>

                  <div>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                        <div style={{ width: '50px', height: '30px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                          <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, fontWeight: '500' }}>{item.product_name || item.name || "Product"}</div>
                        <div style={{ color: '#ccc' }}>{item.price} ₺</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                    Total: <span style={{ color: '#00ff88' }}>{order.total_price} ₺</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Styles
const statCardStyle = {
  backgroundColor: '#1a1a1a',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #333',
  display: 'flex',
  alignItems: 'center',
  gap: '20px'
};

const iconBoxStyle = {
  width: '50px',
  height: '50px',
  backgroundColor: '#252525',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px'
};

export default Profile;
