import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Header from './Header';
import { FaStar, FaCalendar, FaGlobe, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GameDetails = ({ cart, setCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox State

  useEffect(() => {
    api.get(`products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    // Auth Check
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.warn("Satın almak için giriş yapmalısınız!", {
        onClick: () => navigate('/login'),
        autoClose: 3000
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success('Sepete eklendi!');
  };

  if (loading) return <div style={{ padding: '40px' }}>Yükleniyor...</div>;
  if (!product) return <div style={{ padding: '40px' }}>Oyun bulunamadı.</div>;

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div style={{ position: 'relative', minHeight: '500px', marginBottom: '40px' }}>
        {/* Background Image with Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${product.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(21,21,21,0.5) 0%, rgba(21,21,21,1) 100%)',
          zIndex: -1
        }}></div>

        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back
        </button>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Left Info */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', fontSize: '14px', color: '#ccc' }}>
              {product.released && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'white', color: 'black', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {product.released.split('-')[0]}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaStar color="orange" /> {product.rating}
              </span>
            </div>

            <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: 1.1, marginBottom: '20px' }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              {product.price === 0 || product.price === 0.0 ? (
                <a
                  href={product.store_url || product.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: '15px 30px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', backgroundColor: '#28a745', color: 'white' }}
                >
                  Play for Free <FaGlobe />
                </a>
              ) : (
                <button
                  onClick={addToCart}
                  className="btn-primary"
                  style={{ padding: '15px 30px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  Add to Cart <span style={{ opacity: 0.7 }}>{product.price} TL</span>
                </button>
              )}

              {product.website && product.price !== 0 && (
                <a href={product.website} target="_blank" rel="noreferrer" style={{ padding: '15px 20px', border: '1px solid #555', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none' }}>
                  Visit Website <FaGlobe />
                </a>
              )}
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '10px', color: '#ccc' }}>About</h3>
              <p style={{ lineHeight: 1.6, color: '#ddd', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>
          </div>

          {/* Right Gallery (Screenshots) */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '20px', color: '#ccc' }}>Screenshots</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {product.screenshots && product.screenshots.map((shot, index) => (
                <img
                  key={index}
                  src={shot}
                  alt={`Screenshot ${index}`}
                  loading="lazy"
                  style={{ width: '100%', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => setSelectedImage(shot)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <img
            src={selectedImage}
            alt="Full Screen"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
          />
        </div>
      )}
    </div>
  );
};

export default GameDetails;