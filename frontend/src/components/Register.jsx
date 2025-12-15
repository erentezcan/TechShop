import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('register/', { username, password, email });
      toast.success('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      navigate('/login');
    } catch (error) {
      toast.error('Kayıt başarısız! Lütfen bilgileri kontrol edin.');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Kullanıcı Adı</label>
          <input
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white' }}
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>E-posta</label>
          <input
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white' }}
            value={email}
            onChange={e => setEmail(e.target.value)}
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
        <button className="btn-primary" style={{ width: '100%' }}>Kayıt Ol</button>
      </form>
    </div>
  );
}

export default Register;