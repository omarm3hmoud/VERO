import React, { useEffect, useRef } from 'react';

const About = () => {
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
    <section id="about" ref={sectionRef}>
      <div className="about-inner">
        <div className="about-logo-wrap reveal">
          <div className="about-logo-bg">
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="VERO Logo" />
          </div>
        </div>
        <div className="about-content reveal">
          <div className="section-label">من نحن</div>
          <h2 className="section-title">قصة فيرو</h2>
          <p className="about-text">عطور فيرو ليست مجرد علامة تجارية للعطور، بل هي تعبير عن شخصيتك.</p>
          <p className="about-text">ابتكرنا فيرو لنقدم لك عطورًا عالية الجودة تجمع بين الفخامة والأناقة والثبات طويل الأمد، كل ذلك بسعر مناسب. مهمتنا بسيطة: مساعدتك على التميز برائحة تعكس جوهرك.</p>
          <p className="about-text">نختار كل عطر نقدمه بعناية فائقة ليناسب مختلف الأذواق والأنماط والمناسبات، سواءً كانت سهرة مميزة أو إطلالة يومية منعشة.</p>
          <div className="about-tagline">في فيرو، نؤمن أن العطر ليس مجرد شيء تضعه، بل هو ما يترك انطباعًا لدى الآخرين.</div>
        </div>
      </div>
    </section>
  );
};

export default About;
