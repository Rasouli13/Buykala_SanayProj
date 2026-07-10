import React, { useState, useEffect } from 'react';

function CartPage({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ title: 'خانه', addressLine: '', city: '', postalCode: '' });
  const [message, setMessage] = useState('');

  const fetchCart = () => {
    if (!user) return;
    fetch('http://localhost:1234/api/cart', {
      headers: { 'X-User-Id': user.id.toString() }
    }).then(res => res.json()).then(data => setCartItems(data));
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      // 1. Create shipping address first
      const addrRes = await fetch('http://localhost:1234/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id.toString() },
        body: JSON.stringify(address)
      });
      const savedAddress = await addrRes.json();

      // 2. Execute order checkout
      const orderRes = await fetch('http://localhost:1234/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id.toString() },
        body: JSON.stringify({ addressId: savedAddress.id })
      });

      if (orderRes.ok) {
        setMessage('سفارش شما با موفقیت ثبت و پرداخت شد!');
        setCartItems([]);
      } else {
        const err = await orderRes.json();
        throw new Error(err.message || 'Checkout failed');
      }
    } catch (err) {
      setMessage(`خطا در فرآیند خرید: ${err.message}`);
    }
  };

  const totalCost = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div>
      <h2 style={{ color: '#333', borderBottom: '2px solid #e03d3d', paddingBottom: '10px' }}>سبد خرید شما</h2>
      
      {message && <div style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777', marginTop: '40px' }}>سبد خرید شما در حال حاضر خالی است.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' }}>
          
          {/* Cart Items List */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{item.product.name}</h4>
                  <span style={{ fontSize: '13px', color: '#666' }}>تعداد: {item.quantity} عدد</span>
                </div>
                <span style={{ fontWeight: 'bold' }}>{(item.product.price * item.quantity).toLocaleString()} تومان</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold', fontSize: '18px', color: '#e03d3d' }}>
              <span>جمع کل فاکتور:</span>
              <span>{totalCost.toLocaleString()} تومان</span>
            </div>
          </div>

          {/* Shipping Form & Checkout */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>اطلاعات ارسال سفارش</h3>
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              <input type="text" placeholder="شهر" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="کد پستی" value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <textarea placeholder="آدرس دقیق پستی" value={address.addressLine} onChange={e => setAddress({...address, addressLine: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }} />
              <button type="submit" style={{ backgroundColor: '#e03d3d', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>تایید و پرداخت نهایی</button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

export default CartPage;