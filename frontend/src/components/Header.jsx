import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [term, setTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && term.trim()) {
            navigate(`/search?q=${encodeURIComponent(term)}`);
        }
    };

    return (
        <header style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <input
                type="text"
                placeholder="Search..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={handleSearch}
                style={{
                    flex: 1,
                    padding: '12px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    backgroundColor: '#3b3b3b',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                }}
            />
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {localStorage.getItem('access_token') ? (
                    <button
                        onClick={() => navigate('/profile')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ fontWeight: 'bold' }}>MY LIBRARY</span>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #00ff88, #00b8ff)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}>
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid white',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'black';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'white';
                        }}
                    >
                        Login / Register
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
