import React, { useEffect, useRef } from 'react';

const Specs = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const countUp = (el, target, suffix) => {
      const duration = 1800;
      const start = performance.now();
      el.classList.add('counting');
      const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else {
          el.textContent = target + suffix;
          el.classList.remove('counting');
        }
      };
      requestAnimationFrame(tick);
    };

    const specObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          countUp(el, target, suffix);
          specObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) {
      const specNums = sectionRef.current.querySelectorAll('.spec-num');
      specNums.forEach(el => specObserver.observe(el));

      const reveals = sectionRef.current.querySelectorAll('.reveal');
      reveals.forEach(el => revealObserver.observe(el));
    }

    return () => {
      specObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return (
    <>
      <section id="specs" ref={sectionRef}>
        <div className="specs-label reveal">بالأرقام</div>
        <h2 className="specs-title reveal">فيرو في أرقام</h2>
        <p className="specs-sub reveal">جودة لا تُقارن، بثقة تُعاش</p>
        <div className="specs-grid">
          <div className="spec-card reveal">
            <div className="spec-icon">🌹</div>
            <div className="spec-num" data-target="6" data-suffix="+">0</div>
            <div className="spec-label">عطر مختلف</div>
          </div>
          <div className="spec-card reveal">
            <div className="spec-icon">⏱</div>
            <div className="spec-num" data-target="12" data-suffix="+">0</div>
            <div className="spec-label">ساعة ثبات</div>
          </div>
          <div className="spec-card reveal">
            <div className="spec-icon">✨</div>
            <div className="spec-num" data-target="100" data-suffix="٪">0</div>
            <div className="spec-label">مواد فاخرة</div>
          </div>
          <div className="spec-card reveal">
            <div className="spec-icon">🚀</div>
            <div className="spec-num" data-target="24" data-suffix="h">0</div>
            <div className="spec-label">توصيل سريع</div>
          </div>
        </div>
      </section>

      <div className="wave-divider" style={{ background: 'var(--cream)' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
          <path d="M0,40 C360,0 720,60 1080,20 C1200,10 1340,50 1440,40 L1440,60 L0,60 Z" fill="#000000" />
        </svg>
      </div>
    </>
  );
};

export default Specs;
