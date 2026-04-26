import React, { useEffect, useRef } from 'react';

const Order = () => {
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
      <section id="order" ref={sectionRef}>
        <div className="order-card reveal">
          <span className="crown-icon">👑</span>
          <h2 className="order-title">اطلب عطرك الآن</h2>
          <p className="order-sub">خطوات بسيطة وعطرك في طريقه إليك</p>
          <div className="order-steps">
            <div className="order-step">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">تصفح المنتجات وأضفها للعربة</div>
                <div className="step-desc">اختر عطرك المفضل من قسم المنتجات وأضفه إلى عربة التسوق الخاصة بك في أعلى الصفحة</div>
              </div>
            </div>
            <div className="order-step">
              <div className="step-num">2</div>
              <div className="step-content">
                <div className="step-title">تأكيد الطلب عبر الواتساب</div>
                <div className="step-desc">افتح العربة، أدخل بياناتك واضغط تأكيد ليتم إرسال الطلب مباشرة لفريقنا على الواتساب</div>
              </div>
            </div>
            <div className="order-step">
              <div className="step-num">3</div>
              <div className="step-content">
                <div className="step-title">التوصيل لبابك 🎁</div>
                <div className="step-desc">عطرك هيوصلك في تغليف فاخر — استلام وادفع الباقي عند الاستلام</div>
              </div>
            </div>
          </div>
          <div className="order-cta-wrap">
            <a href="https://wa.me/201096720689" className="whatsapp-btn" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              تواصل معنا للاستفسارات
            </a>
            <div className="deposit-note">يتطلب مقدم بسيط لتأكيد الطلب — والباقي عند الاستلام</div>
          </div>
        </div>
      </section>

      <div className="wave-divider" style={{ background: '#000000' }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px', display: 'block' }}>
          <path d="M0,20 C480,70 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--cream)" />
        </svg>
      </div>
    </>
  );
};

export default Order;
