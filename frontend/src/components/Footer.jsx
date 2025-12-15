import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook, FaDiscord } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#151515',
            padding: '40px 0',
            borderTop: '1px solid #333',
            color: '#888',
            marginTop: 'auto' // Sayfanın en altına itmek için
        }}>
            <div className="container" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px'
            }}>
                {/* Logo & Hakkımızda */}
                <div style={{ maxWidth: '600px' }}>
                    <h2 style={{ color: 'white', letterSpacing: '4px', marginBottom: '15px', fontSize: '28px', fontWeight: '900' }}>GAME ZONE</h2>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#888' }}>
                        The ultimate destination for gamers. Discover, buy, and play the latest titles with instant delivery.
                    </p>
                    <div style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
                        &copy; 2025 Game Zone Inc. All rights reserved.
                    </div>
                </div>
            </div>

            <style>{`
                .footer-link:hover {
                    color: #fff;
                    text-decoration: underline;
                }
            `}</style>
        </footer>
    );
};

const socialIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'not-allowed', // Tıklanamaz hissi
    opacity: 0.7
};

export default Footer;
