import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setProduct(data);
        if (data && data.types && data.types.length > 0) {
          setSelectedType(data.types[0]);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('vero_cart')) || [];
    
    // Check if image exists, use first image from array, or fallback
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : product.image_url; // fallback to old format if any
      
    const itemToAdd = {
      id: product.id,
      name: product.name,
      type: selectedType,
      size: product.size,
      price: product.price,
      image_url: imageUrl,
      quantity: 1
    };

    const existingItemIndex = cart.findIndex(item => item.id === itemToAdd.id && item.type === itemToAdd.type);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(itemToAdd);
    }

    localStorage.setItem('vero_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert('تم إضافة المنتج إلى العربة بنجاح!');
  };

  if (loading) {
    return <div className="details-loading">جاري تحميل تفاصيل العطر...</div>;
  }

  if (!product) {
    return (
      <div className="details-error">
        <h2>عذراً، لم نتمكن من العثور على هذا العطر</h2>
        <Link to="/" className="back-home-btn">العودة للرئيسية</Link>
      </div>
    );
  }

  // Handle both new images array and old image_url string
  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image_url ? [product.image_url] : []);

  return (
    <div className="product-details-page">
      {/* Background spray animation effect */}
      <div className="spray-particles"></div>
      
      <div className="details-nav">
        <Link to="/" className="back-link">← العودة للمجموعة</Link>
        <div className="logo-small">VERO</div>
      </div>

      <div className="details-container">
        {/* Image Gallery */}
        <div className="details-gallery">
          <div className="main-image-wrap">
            {images.length > 0 ? (
              <img src={images[currentImageIndex]} alt={product.name} className="main-image gold-glow" />
            ) : (
              <div className="no-image">لا توجد صورة</div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="thumbnails">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img} alt={`${product.name} - view ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="details-info">
          <div className="crown-icon-small">👑</div>
          <h1 className="details-title">{product.name}</h1>
          <div className="details-price">{product.price} جنيه مصري</div>
          
          <div className="details-options">
            <div className="option-group">
              <label>التركيز (النوع)</label>
              <div className="type-buttons">
                {product.types && product.types.map(type => (
                  <button 
                    key={type}
                    className={`type-btn ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="option-group">
              <label>الحجم</label>
              <div className="size-badge">{product.size}</div>
            </div>
          </div>

          <div className="details-description">
            <h3>تفاصيل ومكونات العطر</h3>
            <p>{product.description || 'لم يتم إضافة وصف لهذا العطر حتى الآن.'}</p>
          </div>

          <button className="add-to-cart-btn large-btn" onClick={addToCart}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            إضافة إلى العربة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
