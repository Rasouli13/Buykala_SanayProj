import React, { useState, useEffect } from 'react';

function VendorPage({ user }) {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shopName, setShopName] = useState('');
  const [shabaNumber, setShabaNumber] = useState('');
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });
  const [message, setMessage] = useState('');

  // Check if user has an existing shop and fetch categories
  const checkShopStatus = async () => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:1234/api/shops');
      const allShops = await res.json();
      // Find shop belonging to the logged-in vendor
      const myShop = allShops.find(s => s.user && s.user.id === user.id);
      setShop(myShop);

      if (myShop && myShop.status === 'APPROVED') {
        fetchProducts(myShop.id);
      }
    } catch (err) {
      console.error("Error fetching shop details", err);
    }
  };

  const fetchProducts = (shopId) => {
    fetch(`http://localhost:1234/api/products/shop/${shopId}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    checkShopStatus();
    fetch('http://localhost:1234/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setProductForm(prev => ({ ...prev, categoryId: data[0].id }));
      });
  }, [user]);

  const handleCreateShop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1234/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id.toString() },
        body: JSON.stringify({ name: shopName, shabaNumber })
      });
      if (res.ok) {
        setMessage('درخواست ایجاد غرفه ثبت شد و در انتظار تایید مدیریت است.');
        checkShopStatus();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create shop');
      }
    } catch (err) {
      setMessage(`خطا: ${err.message}`);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:1234/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id.toString() },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        setMessage('محصول جدید با موفقیت به غرفه اضافه شد.');
        setProductForm({ name: '', description: '', price: '', stock: '', categoryId: categories[0]?.id || '' });
        fetchProducts(shop.id);
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add product');
      }
    } catch (err) {
      setMessage(`خطا: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#333', borderBottom: '2px solid #e03d3d', paddingBottom: '10px' }}>پنل مدیریت غرفه</h2>
      {message && <div style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{message}</div>}

      {/* Case 1: No Shop Exists */}
      {!shop && (
        <div style={{ maxWidth: '500px', backgroundColor: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>درخواست راه‌اندازی غرفه جدید</h3>
          <form onSubmit={handleCreateShop} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            <input type="text" placeholder="نام غرفه" value={shopName} onChange={e => setShopName(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="شماره شبا (۲۶ رقم همراه با IR)" value={shabaNumber} onChange={e => setShabaNumber(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ backgroundColor: '#e03d3d', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ثبت و ارسال به ادمین</button>
          </form>
        </div>
      )}

      {/* Case 2: Shop is Pending or Rejected */}
      {shop && shop.status !== 'APPROVED' && (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>غرفه شما: {shop.name}</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: shop.status === 'PENDING' ? '#ff9800' : '#f44336' }}>
            وضعیت غرفه: {shop.status === 'PENDING' ? 'در انتظار تایید ادمین ⏳' : 'رد شده ❌'}
          </p>
        </div>
      )}

      {/* Case 3: Shop is Approved */}
      {shop && shop.status === 'APPROVED' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* Add Product Form */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3>افزودن کالا به غرفه ({shop.name})</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              <input type="text" placeholder="نام کالا" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="توضیحات اجمالی" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="قیمت (تومان)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="موجودی انبار" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>تایید و انتشار کالا</button>
            </form>
          </div>

          {/* Current Products List */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3>کالاهای فعال در غرفه شما</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', textAlign: 'right' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>نام کالا</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>قیمت</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>موجودی</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{p.name}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{p.price.toLocaleString()} تومان</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{p.stock} عدد</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorPage;