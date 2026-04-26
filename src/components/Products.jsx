import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 150);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      const reveals = sectionRef.current.querySelectorAll('.reveal');
      reveals.forEach(el => revealObserver.observe(el));
    }

    return () => revealObserver.disconnect();
  }, [loading, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      // Initialize selected types with the first type option for each product
      const initialTypes = {};
      if (data) {
        data.forEach(product => {
          if (product.types && product.types.length > 0) {
            initialTypes[product.id] = product.types[0];
          }
        });
      }
      setSelectedTypes(initialTypes);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback dummy products if DB is empty or not connected
      if (products.length === 0) {
         const dummyProducts = [
           { id: '1', name: 'VERO NOIR', types: ['Eau de Parfum', 'Extrait de Parfum'], size: '100ml', price: 1500, image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800' },
           { id: '2', name: 'VERO BLANC', types: ['Eau de Parfum'], size: '100ml', price: 1200, image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800' },
         ];
         setProducts(dummyProducts);
         setSelectedTypes({ '1': 'Eau de Parfum', '2': 'Eau de Parfum' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (productId, type) => {
    setSelectedTypes(prev => ({ ...prev, [productId]: type }));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('vero_cart')) || [];
    const itemToAdd = {
      id: product.id,
      name: product.name,
      type: selectedTypes[product.id] || product.types[0],
      size: product.size,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    };

    // Check if item with same ID and type exists
    const existingItemIndex = cart.findIndex(item => item.id === itemToAdd.id && item.type === itemToAdd.type);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(itemToAdd);
    }

    localStorage.setItem('vero_cart', JSON.stringify(cart));
    
    // Dispatch a custom event to notify other components (like navbar or cart)
    window.dispatchEvent(new Event('cartUpdated'));
    alert('تم إضافة المنتج إلى العربة بنجاح!');
  };

  return (
    <>
      <section id="products" ref={sectionRef} className="products-section" style={{ position: 'relative' }}>
        <div className="spray-particles"></div>
        <div className="section-header reveal" style={{ position: 'relative', zIndex: 10 }}>
          <span className="crown-icon">👑</span>
          <h2 className="section-title">مجموعتنا الفاخرة</h2>
          <p className="section-subtitle">اختر عطرك المفضل من تشكيلتنا المميزة</p>
        </div>

        {loading ? (
          <div className="loading-products reveal" style={{ position: 'relative', zIndex: 10 }}>جاري التحميل...</div>
        ) : (
          <div className="products-grid" style={{ position: 'relative', zIndex: 10 }}>
          {products.map(product => {
            const displayImage = product.images && product.images.length > 0 
              ? product.images[0] 
              : product.image_url;

            return (
              <div key={product.id} className="product-card reveal gold-card-hover gold-glow">
                <Link to={`/product/${product.id}`} className="product-image-wrap">
                  <img src={displayImage} alt={product.name} className="product-image" loading="lazy" />
                  <div className="view-details-overlay">عرض التفاصيل</div>
                </Link>
                <div className="product-info">
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  
                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">النوع:</span>
                      <select 
                        className="product-select"
                        value={selectedTypes[product.id] || ''} 
                        onChange={(e) => handleTypeChange(product.id, e.target.value)}
                      >
                        {product.types && product.types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">الحجم:</span>
                      <span className="detail-value">{product.size}</span>
                    </div>
                    
                    <div className="detail-row price-row">
                      <span className="product-price">{product.price} EGP</span>
                    </div>
                  </div>

                  <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    إضافة إلى العربة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      <div className="wave-divider" style={{ background: '#000000' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
          <path d="M0,40 C360,0 720,60 1080,20 C1200,10 1340,50 1440,40 L1440,60 L0,60 Z" fill="var(--cream)" />
        </svg>
      </div>
    </>
  );
};

export default Products;
