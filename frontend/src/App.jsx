import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import VendorPage from './pages/VendorPage';
import AdminPage from './pages/AdminPage';

function App() {
  // Pure React states for routing and global user session
  const [currentPage, setCurrentPage] = useState('auth');
  const [user, setUser] = useState(null); // Stores: { id, phoneNumber, role }

  // Safe logout mechanism
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('auth');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', dir: 'rtl', fontFamily: 'tahoma' }}>
      {/* React Navigation Component */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />
      
      {/* Conditional Rendering - The core React feature for SPAs */}
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentPage === 'auth' && <AuthPage setUser={setUser} setCurrentPage={setCurrentPage} />}
        {currentPage === 'home' && <HomePage user={user} />}
        {currentPage === 'cart' && <CartPage user={user} />}
        {currentPage === 'vendor' && <VendorPage user={user} />}
        {currentPage === 'admin' && <AdminPage user={user} />}
      </main>
    </div>
  );
}

export default App;