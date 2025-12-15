import React from 'react';
import { FaWindows, FaPlaystation, FaXbox, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GameCard = ({ product, cart, setCart }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/game/${product.id}`)}
            style={{
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            {/* Image Area */}
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                    src={product.image_url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Content Area */}
            <div style={{ padding: '15px' }}>
                {/* Platform Icons (Mock) */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', color: '#ccc', fontSize: '14px' }}>
                    <FaWindows /> <FaPlaystation /> <FaXbox />
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', lineHeight: 1.2 }}>
                    {product.name}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <span style={{
                        backgroundColor: '#333',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        {product.price} ₺
                    </span>

                    {/* Add Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const token = localStorage.getItem('access_token');

                            if (!token) {
                                toast.warn("Satın almak için giriş yapmalısınız!", {
                                    onClick: () => navigate('/login'),
                                    autoClose: 3000
                                });
                                return;
                            }

                            setCart([...cart, product]);
                            toast.success(`${product.name} sepete eklendi!`);
                            // İsteğe bağlı: Toast bildirimi burada daha şık olur
                        }}
                        style={{
                            background: 'transparent',
                            border: '1px solid #555',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            zIndex: 2
                        }}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
