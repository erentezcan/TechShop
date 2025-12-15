import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import Header from './Header';

const SteamSearch = () => {
    const [searchParams] = useSearchParams();
    const term = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (term) {
            setLoading(true);
            setError(null);
            api.get(`search/steam/?term=${term}`)
                .then(res => {
                    setResults(res.data.results || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Arama sırasında bir hata oluştu: ' + err.message);
                    setLoading(false);
                });
        }
    }, [term]);

    return (
        <div style={{ paddingBottom: '50px', minHeight: '100vh', backgroundColor: '#121212' }}>
            <Header />

            <div style={{ marginTop: '40px', maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{
                    marginBottom: '40px',
                    borderBottom: '1px solid #333',
                    paddingBottom: '20px',
                    textAlign: 'center'
                }}>
                    <h1 className="section-title" style={{ margin: '0 0 10px 0', fontSize: '3rem' }}>Search Results</h1>
                    <span style={{ color: '#888', fontSize: '1.2rem' }}>for "{term}"</span>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#00ff88', fontSize: '1.2rem' }}>
                        <div className="spinner" style={{ marginBottom: '15px' }}>⚡</div>
                        Aranıyor...
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {!loading && !error && results.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                        <h2>Sonuç bulunamadı :(</h2>
                        <p>Kütüphanemizde "{term}" ile eşleşen bir oyun yok.</p>
                    </div>
                )}

                <div className="grid-games" style={{ gap: '30px' }}>
                    {results.map((game, index) => (
                        <div key={game.id} className="game-card" style={{
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            animation: `fadeIn 0.5s ease forwards ${index * 0.1}s`,
                            opacity: 0,
                            transform: 'translateY(20px)',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            borderRadius: '16px',
                            overflow: 'hidden'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.4)';
                                e.currentTarget.style.borderColor = '#00ff88';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#333';
                            }}
                        >
                            <div className="game-image-container" style={{ height: '220px', overflow: 'hidden' }}>
                                <img
                                    src={game.image}
                                    alt={game.name}
                                    className="game-image"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            <div className="game-info" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '140px' }}>
                                <h3 className="game-title" style={{
                                    fontSize: '1.4rem',
                                    marginBottom: '10px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: '700'
                                }}>
                                    {game.name}
                                </h3>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="game-price" style={{ color: '#00ff88', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {game.price_formatted}
                                    </span>

                                    <a href={`/game/${game.id}`} className="view-btn" style={{
                                        textDecoration: 'none',
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        padding: '10px 24px',
                                        borderRadius: '30px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#00ff88';
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = '#fff';
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        Buy Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spinner {
                    animation: spin 1s infinite linear;
                    font-size: 2rem;
                    display: inline-block;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SteamSearch;
