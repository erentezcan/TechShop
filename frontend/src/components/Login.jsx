import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setUser({ username });
      toast.success(`Hoş geldin, ${username}!`);
      navigate('/');
    } catch (error) {
      toast.error('Giriş başarısız! Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Kullanıcı Adı</label>
          <input
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white' }}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Şifre</label>
          <input
            type="password"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white' }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button className="btn-primary" style={{ width: '100%' }}>Giriş</button>
        <button type="button" style={{ background: 'none', border: 'none', color: '#aaa', marginTop: '10px', cursor: 'pointer' }} onClick={() => navigate('/register')}>Kayıt Ol</button>
      </form>
    </div>
  );
}

export default Login;