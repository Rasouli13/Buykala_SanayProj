import React, { useState, useEffect } from 'react';

function HomePage({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all products and categories on component mount
  useEffect(() => {
    fetch('http://localhost:1234/api/products').then(res => res.json()).then(data => setProducts(data));
    fetch('http://localhost:1234/api/categories').then(res => res.json()).then(data => setCategories(data));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user || user.role !== 'CUSTOMER') {
      setMessage('Only customers can add items to the cart');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        setMessage('کالا با موفقیت به سبد خرید اضافه شد');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add item');
      }
    } catch (err) {
      setMessage(`خطا: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#333', borderBottom: '2px solid #e03d3d', paddingBottom: '10px' }}>ویترین فروشگاه کالا</h2>
      
      {message && <div style={{ backgroundColor: '#e8f5e9', color: 'green', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px', marginTop: '20px' }}>
        
        {/* Sidebar Categories */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', height: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>دسته‌بندی‌ها</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map(cat => (
              <li key={cat.id} style={{ padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '14px', color: '#555' }}>{cat.name}</li>
            ))}
          </ul>
        </div>

        {/* Products Grid */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {products.map(prod => (
              <div key={prod.id} style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{prod.name}</h4>
                  <p style={{ fontSize: '12px', color: '#777', margin: '0 0 15px 0' }}>{prod.description || 'بدون توضیحات'}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '13px', color: '#999' }}>موجود در انبار: {prod.stock}</span>
                    <span style={{ fontWeight: 'bold', color: '#e03d3d' }}>{prod.price.toLocaleString()} تومان</span>
                  </div>
                  <button onClick={() => handleAddToCart(prod.id)} disabled={prod.stock === 0} style={{ width: '100%', backgroundColor: prod.stock === 0 ? '#ccc' : '#4caf50', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: prod.stock === 0 ? 'not-allowed' : 'pointer' }}>
                    {prod.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;