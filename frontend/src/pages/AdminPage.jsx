import React, { useState, useEffect } from 'react';

function AdminPage() {
  const [shops, setShops] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');

  const fetchAllShops = () => {
    fetch('http://localhost:1234/api/shops')
      .then(res => res.json())
      .then(data => setShops(data));
  };

  useEffect(() => {
    fetchAllShops();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1234/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });
      if (res.ok) {
        setMessage('دسته‌بندی جدید با موفقیت در سیستم ثبت شد.');
        setCategoryName('');
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create category');
      }
    } catch (err) {
      setMessage(`خطا: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (shopId, status) => {
    try {
      const res = await fetch(`http://localhost:1234/api/shops/${shopId}/status?status=${status}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setMessage(`وضعیت غرفه با موفقیت به ${status === 'APPROVED' ? 'تایید شده' : 'رد شده'} تغییر یافت.`);
        fetchAllShops();
      }
    } catch (err) {
      setMessage(`خطا در تغییر وضعیت: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
      
      {/* Category Management */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <h3>مدیریت کاتالوگ و دسته‌بندی</h3>
        {message && <div style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '8px', borderRadius: '4px', fontSize: '13px', marginBottom: '15px' }}>{message}</div>}
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <input type="text" placeholder="نام دسته‌بندی جدید (مثلا: آرایشی)" value={categoryName} onChange={e => setCategoryName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ backgroundColor: '#e03d3d', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ساخت دسته‌بندی</button>
        </form>
      </div>

      {/* Shop Verification Requests */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3>بررسی درخواست‌های احراز صلاحیت غرفه‌ها</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>نام غرفه</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>شماره شبا</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>وضعیت فعلی</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>عملیات ادمین</th>
            </tr>
          </thead>
          <tbody>
            {shops.map(s => (
              <tr key={s.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{s.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee', fontSize: '13px', color: '#666' }}>{s.shabaNumber}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: s.status === 'APPROVED' ? 'green' : s.status === 'PENDING' ? 'orange' : 'red', fontWeight: 'bold' }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  {s.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleUpdateStatus(s.id, 'APPROVED')} style={{ backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>تایید</button>
                      <button onClick={() => handleUpdateStatus(s.id, 'REJECTED')} style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>رد</button>
                    </>
                  )}
                  {s.status !== 'PENDING' && <span style={{ color: '#999', fontSize: '12px' }}>بایگانی شده</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminPage;