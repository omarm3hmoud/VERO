import React, { useEffect, useRef, useState } from 'react';
import { TOTAL_FRAMES, frames } from '../utils/frameLoader';

const SNAP_ZONES = [0.1, 0.28, 0.52, 0.75];
const SNAP_MARGIN = 0.02;
const HOLD_MS = 600;

const ScrollAnimation = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const annoCardsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let currentFrame = 0;
    let needsDraw = false;
    let snapLocked = false;
    let lastSnap = -1;
    let snapTimeout = null;

    const drawFrame = (idx) => {
      const img = frames[idx];
      if (!img || !img.complete) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      // Removed gradient fill so canvas remains transparent where the image is not drawn
      // This allows mixBlendMode: 'multiply' to blend the frame background perfectly

      const isMobile = W < 768;
      // Increase mobile scale so it appears larger
      const scale = isMobile
        ? Math.min(W / img.naturalWidth, H / img.naturalHeight) * 2.5
        : Math.max(W / img.naturalWidth, H / img.naturalHeight);
      
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      const sx = (W - sw) / 2;
      const sy = (H - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh);
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      drawFrame(currentFrame);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawFrame(0);

    const handleScroll = () => {
      if (!frames.length) return;
      const section = sectionRef.current;
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / sectionH));

      // Direct DOM manipulation instead of React state for smooth 60fps
      if (heroOverlayRef.current) {
        heroOverlayRef.current.style.opacity = Math.max(0, 1 - p * 10);
        heroOverlayRef.current.style.pointerEvents = p > 0.1 ? 'none' : 'auto';
      }

      annoCardsRef.current.forEach((card) => {
        if (!card) return;
        const show = parseFloat(card.dataset.show);
        const hide = parseFloat(card.dataset.hide);
        if (p >= show && p < hide) {
          card.classList.add('visible');
        } else {
          card.classList.remove('visible');
        }
      });

      const frameIdx = Math.min(Math.floor(p * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
      if (frameIdx !== currentFrame) {
        currentFrame = frameIdx;
        if (!needsDraw) {
          needsDraw = true;
          requestAnimationFrame(() => {
            drawFrame(currentFrame);
            needsDraw = false;
          });
        }
      }

      // Snap logic removed for smoother scrolling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(snapTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      <section id="scroll-anim-section" ref={sectionRef}>
        <div id="sticky-wrap">
          <canvas 
            id="product-canvas" 
            ref={canvasRef}
            style={{ 
              mixBlendMode: 'multiply',
              filter: 'contrast(1.08) brightness(1.03)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
            }}
          ></canvas>

          {/* Hero Content Overlay */}
          <div 
            ref={heroOverlayRef}
            style={{ 
              opacity: 1,
              pointerEvents: 'auto',
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              paddingTop: '60px',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="hero-orb1"></div>
            <div className="hero-orb2"></div>
            <div className="hero-badge">Luxury Perfumes</div>
            <h1 className="hero-title">
              <span className="gold-text">VERO</span><br />
              <span className="light-text">عبّر عن حضورك</span>
            </h1>
            <p className="hero-sub">عطور فاخرة تجمع بين الأناقة والثبات — لأن رائحتك هي أول ما يُذكر عنك</p>
            <div className="hero-buttons">
              <a href="#order" className="btn-primary">اطلب عطرك الآن ✦</a>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })} 
                className="btn-secondary"
              >
                اكتشف العطر
              </button>
            </div>
            <div className="scroll-hint">
              <span>اسكرول للاكتشاف</span>
              <div className="scroll-mouse"></div>
            </div>
          </div>

          <div 
            ref={el => annoCardsRef.current[0] = el}
            className="anno-card" 
            data-pos="right" 
            data-show="0.1" 
            data-hide="0.28"
          >
            <div className="anno-num">01 — الدوران</div>
            <div className="anno-title">360° صناعة متكاملة</div>
            <div className="anno-desc">تصميم فريد يُعبّر عن الفخامة من كل زاوية</div>
            <div className="anno-stat">360<span style={{ fontSize: '18px' }}>°</span></div>
            <div className="anno-stat-label">زاوية مثالية</div>
          </div>

          <div 
            ref={el => annoCardsRef.current[1] = el}
            className="anno-card" 
            data-pos="left" 
            data-show="0.28" 
            data-hide="0.50"
          >
            <div className="anno-num">02 — الغطاء</div>
            <div className="anno-title">خشب طبيعي فاخر</div>
            <div className="anno-desc">غطاء من خشب البلوط الطبيعي — لمسة دفء وأصالة</div>
          </div>

          <div 
            ref={el => annoCardsRef.current[2] = el}
            className="anno-card" 
            data-pos="right2" 
            data-show="0.52" 
            data-hide="0.75"
          >
            <div className="anno-num">03 — البخة</div>
            <div className="anno-title">انتشار واسع ومتوازن</div>
            <div className="anno-desc">رذاذ ناعم يغطي مساحة واسعة لأثر يدوم</div>
            <div className="anno-stat">12<span style={{ fontSize: '18px' }}>+</span></div>
            <div className="anno-stat-label">ساعة ثبات</div>
          </div>

          <div 
            ref={el => annoCardsRef.current[3] = el}
            className="anno-card" 
            data-pos="left2" 
            data-show="0.75" 
            data-hide="0.95"
          >
            <div className="anno-num">04 — الثبات</div>
            <div className="anno-title">رائحة تبقى معك</div>
            <div className="anno-desc">تركيبة مركّزة فاخرة تضمن ثباتًا طوال اليوم</div>
          </div>
        </div>
      </section>

      <div className="wave-divider scroll-wave" style={{ background: '#FAF0D7', position: 'relative', zIndex: 20 }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
          <path d="M0,20 C360,60 720,0 1080,30 C1200,45 1340,10 1440,20 L1440,60 L0,60 Z" fill="#FFFDF7" />
        </svg>
      </div>
    </>
  );
};

export default ScrollAnimation;
