import React from 'react';

function Navbar({ currentPage, setCurrentPage, user, onLogout }) {
  return (
    <nav style={{ backgroundColor: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#e03d3d', marginLeft: '20px' }}>بای کالا (BuyKala)</span>
        
        {user && (
          <>
            <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 'home' ? '#e03d3d' : '#333', fontWeight: currentPage === 'home' ? 'bold' : 'normal' }}>صفحه اصلی</button>
            {user.role === 'CUSTOMER' && (
              <button onClick={() => setCurrentPage('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 'cart' ? '#e03d3d' : '#333', fontWeight: currentPage === 'cart' ? 'bold' : 'normal' }}>سبد خرید</button>
            )}
            {user.role === 'VENDOR' && (
              <button onClick={() => setCurrentPage('vendor')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 'vendor' ? '#e03d3d' : '#333', fontWeight: currentPage === 'vendor' ? 'bold' : 'normal' }}>پنل غرفه‌دار</button>
            )}
            {user.role === 'ADMIN' && (
              <button onClick={() => setCurrentPage('admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 'admin' ? '#e03d3d' : '#333', fontWeight: currentPage === 'admin' ? 'bold' : 'normal' }}>پنل مدیریت</button>
            )}
          </>
        )}
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>خوش آمدید ({user.phoneNumber})</span>
            <button onClick={onLogout} style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>خروج</button>
          </div>
        ) : (
          <span style={{ fontSize: '14px', color: '#666' }}>لطفاً وارد سیستم شوید</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;