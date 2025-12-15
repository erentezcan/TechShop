import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHome, FaUser, FaShoppingCart, FaStar, FaFire, FaCalendarAlt } from 'react-icons/fa';
import api from '../api';

const Sidebar = ({ cart, isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        api.get('categories/')
            .then(res => {
                const data = res.data.results || res.data;
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch(err => console.error("Kategori yükleme hatası:", err));
    }, []);

    const sidebarStyle = {
        width: '250px',
        padding: '20px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: '#1E1E1E',
        borderRight: '1px solid #333',
        transition: 'transform 0.3s ease-in-out',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 1000,
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: isMobile && isOpen ? '0 0 20px rgba(0,0,0,0.5)' : 'none',
        // Hide scrollbar
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none',  /* IE 10+ */
    };

    // Helper for link styling
    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        fontWeight: isActive ? 'bold' : '500',
        color: isActive ? '#fff' : '#888',
        padding: '10px 0',
        transition: 'color 0.2s ease',
        textDecoration: 'none'
    });

    return (
        <>
            <style>
                {`
                    aside::-webkit-scrollbar { 
                        display: none; 
                    }
                `}
            </style>

            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="sidebar-overlay active"
                    onClick={onClose}
                ></div>
            )}

            <aside style={sidebarStyle}>
                <div style={{ marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #333' }}>
                    <h1 style={{ letterSpacing: '2px', fontWeight: 900, fontSize: '22px', color: '#fff', margin: 0 }}>GAME ZONE</h1>
                </div>

                <nav>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <li>
                            <NavLink to="/" className="nav-item-link" end style={linkStyle}>
                                <FaHome /> Home
                            </NavLink>
                        </li>
                        {/* Sadece giriş yapmış kullanıcılar Profil görebilsin */}
                        {localStorage.getItem('access_token') && (
                            <li>
                                <NavLink to="/profile" className="nav-item-link" style={linkStyle}>
                                    <FaUser /> Profile
                                </NavLink>
                            </li>
                        )}
                        {!localStorage.getItem('access_token') && (
                            <li>
                                <NavLink to="/login" className="nav-item-link" style={linkStyle}>
                                    <FaUser /> Login / Register
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink to="/cart" className="nav-item-link" style={linkStyle}>
                                <FaShoppingCart /> Cart
                                {cart && cart.length > 0 && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        borderRadius: '12px',
                                        padding: '2px 8px',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}>
                                        {cart.length}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ color: '#555', fontSize: '12px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Browse</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--color-text)' }}>
                        <li>
                            <Link to="/?ordering=-rating" style={{ ...linkStyle({ isActive: false }), color: '#aaa', gap: '10px' }}>
                                <div style={{ background: '#333', padding: '6px', borderRadius: '6px', display: 'flex' }}><FaStar color="#FFD700" size={10} /></div>
                                Top Rated
                            </Link>
                        </li>
                        <li>
                            <Link to="/?ordering=-released" style={{ ...linkStyle({ isActive: false }), color: '#aaa', gap: '10px' }}>
                                <div style={{ background: '#333', padding: '6px', borderRadius: '6px', display: 'flex' }}><FaCalendarAlt color="#fff" size={10} /></div>
                                New Releases
                            </Link>
                        </li>
                    </ul>
                </div>

                {categories.length > 0 && (
                    <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                        <h3 style={{ color: '#555', fontSize: '12px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Genres</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text)' }}>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link
                                        to={`/?category=${cat.id}&catName=${cat.name}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#888',
                                            fontSize: '15px',
                                            display: 'block',
                                            padding: '5px 0',
                                            transition: 'color 0.2s',
                                            whiteSpace: 'nowrap',    // Prevent wrapping
                                            overflow: 'hidden',      // Hide overflow
                                            textOverflow: 'ellipsis' // Add ellipsis
                                        }}
                                        title={cat.name} // Show full name on hover
                                        onMouseOver={(e) => e.target.style.color = '#fff'}
                                        onMouseOut={(e) => e.target.style.color = '#888'}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
