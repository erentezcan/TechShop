import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import Header from './Header';
import GameCard from './GameCard';
import Skeleton from './Skeleton';

const Home = ({ cart, setCart }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // URL parametrelerini dinle (örn: ?category=1 veya ?ordering=-rating)
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('category');
    const ordering = searchParams.get('ordering');
    const categoryName = searchParams.get('catName') || 'New and trending';

    // Filtre değişince sıfırla
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        fetchProducts(1, true);
    }, [categoryId, ordering]);

    const fetchProducts = (pageAuth, isReset = false) => {
        let query = `products/?page=${pageAuth}`;
        const params = new URLSearchParams();
        if (categoryId) params.append('category', categoryId);
        if (ordering) params.append('ordering', ordering);

        const queryString = params.toString();
        if (queryString) {
            query += `&${queryString}`;
        }

        api.get(query)
            .then(res => {
                const newProducts = res.data.results || [];

                if (isReset) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }

                // Eğer gelen veri sayısı sayfa başı limitinden azsa veya next linki yoksa
                if (!res.data.next) {
                    setHasMore(false);
                }

                setLoading(false);
                setLoadingMore(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setError(err.message);
                setLoading(false);
                setLoadingMore(false);
            });
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setLoadingMore(true);
        fetchProducts(nextPage, false);
    };

    // Başlığı belirle
    let pageTitle = "New and trending";
    if (ordering === '-rating') pageTitle = "Top Rated Games";
    if (categoryId && categoryName !== 'New and trending') pageTitle = `${categoryName} Games`;

    return (
        <div>
            <Header />

            <div style={{ marginBottom: '40px' }}>
                <h1 className="section-title">{pageTitle}</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                    {ordering === '-rating' ? 'Highest scoring games on our platform' : 'Based on player counts and release date'}
                </p>

                {loading && (
                    <div className="grid-games">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n}>
                                <Skeleton type="card" />
                                <Skeleton type="title" />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Skeleton type="text" style={{ width: '40%' }} />
                                    <Skeleton type="text" style={{ width: '20%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div style={{ padding: '20px', backgroundColor: '#330000', color: '#ff4444', borderRadius: '8px' }}>
                        <h3>Error: {error}</h3>
                    </div>
                )}

                {!loading && (
                    <>
                        <div className="grid-games">
                            {products.map(product => (
                                <GameCard key={product.id} product={product} cart={cart} setCart={setCart} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && products.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="btn-primary"
                                    style={{
                                        padding: '12px 40px',
                                        fontSize: '16px',
                                        backgroundColor: '#333',
                                        color: 'white',
                                        border: '1px solid #555'
                                    }}
                                >
                                    {loadingMore ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!loading && products.length === 0 && (
                    <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
                        No games found in this category.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
