import React, { useEffect, useRef } from 'react';

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) {
      const reveals = sectionRef.current.querySelectorAll('.reveal');
      reveals.forEach(el => revealObserver.observe(el));
    }

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      <section id="features" ref={sectionRef}>
        <div className="section-label reveal">لماذا فيرو؟</div>
        <h2 className="section-title reveal">ما يميزنا</h2>
        <p className="section-sub reveal">كل تفصيلة في عطورنا مُختارة بعناية لتمنحك تجربة لا تُنسى</p>
        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">💎</div>
            <div className="feature-title">جودة فاخرة</div>
            <div className="feature-desc">نختار أجود المواد الخام من أفضل المصادر العالمية لضمان عطر يليق بك</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">🌿</div>
            <div className="feature-title">مكونات طبيعية</div>
            <div className="feature-desc">تركيبات تعتمد على المكونات الطبيعية والزيوت العطرية النقية الأصيلة</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">⏳</div>
            <div className="feature-title">ثبات استثنائي</div>
            <div className="feature-desc">رائحة تظل معك طوال اليوم — تبدأ قوية وتبقى أنيقة حتى آخر اللحظة</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">🎁</div>
            <div className="feature-title">تغليف فاخر</div>
            <div className="feature-desc">كل زجاجة تحفة فنية — تصميم راقٍ يجعلها هدية مثالية في أي مناسبة</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">🚚</div>
            <div className="feature-title">توصيل لباب بيتك</div>
            <div className="feature-desc">نوصّل لجميع محافظات مصر — سريع وآمن ومضمون حتى يصلك عطرك بأمان</div>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">💬</div>
            <div className="feature-title">خدمة عملاء على مدار الساعة</div>
            <div className="feature-desc">فريقنا دائماً موجود على واتساب للمساعدة في اختيار العطر المثالي ليك</div>
          </div>
        </div>
      </section>

      <div className="wave-divider" style={{ background: 'var(--cream)' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
          <path d="M0,30 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,60 L0,60 Z" fill="#000000" />
        </svg>
      </div>
    </>
  );
};

export default Features;
