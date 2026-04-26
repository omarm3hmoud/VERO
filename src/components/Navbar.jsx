import React, { useEffect, useState } from 'react';

const Navbar = ({ onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const loadCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('vero_cart')) || [];
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    loadCartCount();
    window.addEventListener('cartUpdated', loadCartCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', loadCartCount);
    };
  }, []);

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <a href="#" className="nav-brand">
        <img src="/logo.jpg" alt="VERO Logo" />
        <span>VERO</span>
      </a>
      <ul className="nav-links">
        <li><a href="#scroll-anim-section">العطر</a></li>
        <li><a href="#products">المنتجات</a></li>
        <li><a href="#features">المميزات</a></li>
        <li><a href="#about">عنا</a></li>
        <li><a href="#order">اطلب الآن</a></li>
      </ul>
      <button onClick={onOpenCart} className="nav-cta cart-nav-btn">
        <span className="cart-icon-text">عربة التسوق 🛒</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </nav>
  );
};

export default Navbar;
