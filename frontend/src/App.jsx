import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import VendorPage from './pages/VendorPage';
import AdminPage from './pages/AdminPage';

function App() {
  // 1. Initialize user state from localStorage so refresh doesn't log them out
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('buykala_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Initialize current page from localStorage or default to 'auth'
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('buykala_page');
    return savedPage ? savedPage : 'auth';
  });

  // 3. Sync states with localStorage and update Browser Address Bar (URL Hash)
  useEffect(() => {
    if (user) {
      localStorage.setItem('buykala_user', JSON.stringify(user));
      localStorage.setItem('buykala_page', currentPage);
      window.location.hash = currentPage; // This changes the URL to /#home, /#admin, etc.
    } else {
      localStorage.removeItem('buykala_user');
      localStorage.removeItem('buykala_page');
      window.location.hash = 'auth';
    }
  }, [user, currentPage]);

  // 4. Listen to browser back/forward buttons or manual URL bar hash edits
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && user) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('auth');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', dir: 'rtl', fontFamily: 'tahoma' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentPage === 'auth' && <AuthPage setUser={setUser} setCurrentPage={setCurrentPage} />}
        {currentPage === 'home' && <HomePage user={user} />}
        
        {/* امن‌سازی مسیرها: صفحه فقط در صورتی رندر می‌شود که کاربر نقش مجاز را داشته باشد */}
        {currentPage === 'cart' && user?.role === 'CUSTOMER' && <CartPage user={user} />}
        {currentPage === 'vendor' && user?.role === 'VENDOR' && <VendorPage user={user} />}
        {currentPage === 'admin' && user?.role === 'ADMIN' && <AdminPage user={user} />}
        
        {/* پیام خطای دسترسی غیرمجاز برای هکرها */}
        {['cart', 'vendor', 'admin'].includes(currentPage) && 
         ((currentPage === 'cart' && user?.role !== 'CUSTOMER') ||
          (currentPage === 'vendor' && user?.role !== 'VENDOR') ||
          (currentPage === 'admin' && user?.role !== 'ADMIN')) && (
          <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>
            <h2>شما اجازه دسترسی به این بخش را ندارید ⛔</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;