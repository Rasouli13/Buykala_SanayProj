import React, { useState } from 'react';

function AuthPage({ setUser, setCurrentPage }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:1234/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // On successful registration, set global user state
      setUser({ id: data.id, phoneNumber: data.phoneNumber, role: data.role });
      
      // Redirect based on user role
      if (data.role === 'ADMIN') setCurrentPage('admin');
      else if (data.role === 'VENDOR') setCurrentPage('vendor');
      else setCurrentPage('home');

    } catch (err) {
      setError(err.message || 'Connection error with backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>ثبت‌نام و ورود به سیستم</h2>
      
      {error && <div style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>شماره موبایل:</label>
          <input type="text" placeholder="مثال: 09123456789" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>رمز عبور:</label>
          <input type="password" placeholder="رمز عبور خود را وارد کنید" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>نقش در سیستم:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
            <option value="CUSTOMER">مشتری (خریدار)</option>
            <option value="VENDOR">غرفه‌دار (فروشنده)</option>
            <option value="ADMIN">مدیر سیستم (ادمین)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ backgroundColor: '#e03d3d', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
          {loading ? 'در حال پردازش...' : 'ورود / ثبت‌نام'}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;