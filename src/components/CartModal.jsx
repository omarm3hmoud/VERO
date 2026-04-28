import React, { useEffect, useState } from 'react';

const CartModal = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    address: ''
  });

  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false);

  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('vero_cart')) || [];
      setCartItems(savedCart);
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsCheckoutExpanded(false); // Reset checkout expansion when opening
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('cartUpdated', loadCart);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('vero_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    if (updatedCart.length === 0) setIsCheckoutExpanded(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('عربة التسوق فارغة!');
      return;
    }

    let message = `مرحباً، أريد تأكيد طلب جديد من VERO Luxury Perfumes 👑\n\n`;
    message += `*بيانات العميل:*\n`;
    message += `- الاسم: ${formData.name}\n`;
    message += `- رقم الهاتف: ${formData.phone}\n`;
    message += `- المحافظة: ${formData.governorate}\n`;
    message += `- العنوان التفصيلي: ${formData.address}\n\n`;
    
    message += `*المنتجات المطلوبة:*\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.type}) - ${item.size}\n`;
      message += `   الكمية: ${item.quantity} | السعر: ${item.price * item.quantity} ج.م\n`;
      if (item.image_url) {
        message += `   صورة المنتج: ${item.image_url}\n`;
      }
    });

    message += `\n*الإجمالي:* ${calculateTotal()} ج.م`;
    message += `\n\nشكراً لكم.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201096720689?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close-btn" onClick={onClose}>✕</button>
        
        <div className="cart-modal-header">
          <h2>عربة التسوق وإتمام الطلب</h2>
        </div>

        <div className="cart-modal-body">
          <div className="cart-section">
            <h3 className="checkout-section-title">المنتجات في العربة</h3>
            {cartItems.length === 0 ? (
              <div className="empty-cart">عربة التسوق فارغة حالياً</div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.type}-${index}`} className="cart-item">
                    <img src={item.image_url} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">{item.type} | {item.size}</div>
                      <div className="cart-item-price">{item.price} ج.م × {item.quantity}</div>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(index)} title="حذف">✕</button>
                  </div>
                ))}
                <div className="cart-total">
                  <span>الإجمالي:</span>
                  <span>{calculateTotal()} ج.م</span>
                </div>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="checkout-form-section">
              <h3 className="checkout-section-title" onClick={() => setIsCheckoutExpanded(!isCheckoutExpanded)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                بيانات التوصيل
                <span>{isCheckoutExpanded ? '▲' : '▼'}</span>
              </h3>
              
              {!isCheckoutExpanded ? (
                <button 
                  className="whatsapp-btn" 
                  onClick={() => setIsCheckoutExpanded(true)}
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  متابعة لإتمام الطلب
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="checkout-form">
                  <div className="form-group">
                    <input type="text" name="name" placeholder="الاسم بالكامل" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <input type="tel" name="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="governorate" placeholder="المحافظة" value={formData.governorate} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <textarea name="address" placeholder="العنوان بالتفصيل" value={formData.address} onChange={handleInputChange} required rows="3"></textarea>
                  </div>

                  <button type="submit" className="whatsapp-btn" disabled={cartItems.length === 0}>
                    تأكيد الطلب عبر واتساب
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
