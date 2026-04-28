import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { preloadFrames } from './utils/frameLoader';
import Loader from './components/Loader';
import SparkleCanvas from './components/SparkleCanvas';
import Navbar from './components/Navbar';
import ScrollAnimation from './components/ScrollAnimation';
import Products from './components/Products';
import Specs from './components/Specs';
import Features from './components/Features';
import Order from './components/Order';
import About from './components/About';
import Footer from './components/Footer';
import DeveloperCredit from './components/DeveloperCredit';
import Admin from './components/Admin';
import CartModal from './components/CartModal';
import ProductDetails from './components/ProductDetails';

function MainWebsite() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    preloadFrames(
      (progress) => setLoadingProgress(progress),
      () => {
        setIsLoading(false);
        setTimeout(() => setIsHidden(true), 600);
      }
    );

    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = window.scrollY / total;
      const progressEl = document.getElementById('scroll-progress');
      if (progressEl) {
        progressEl.style.transform = `scaleX(${pct})`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Loader progress={loadingProgress} isHidden={isHidden} />
      
      {!isLoading && (
        <div id="scroll-progress" style={{ transform: 'scaleX(0)' }}></div>
      )}
      
      <SparkleCanvas />
      
      {!isLoading && (
        <>
          <Navbar onOpenCart={() => setIsCartOpen(true)} />
          <ScrollAnimation />
          <Specs />
          <Products />
          <Features />
          <Order />
          <About />
          <Footer />
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <DeveloperCredit />
        </>
      )}
    </>
  );
}
function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
