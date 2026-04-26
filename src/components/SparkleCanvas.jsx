import React, { useEffect, useRef } from 'react';

const SparkleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let sparkles = [];

    const resizeSparkle = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeSparkle();
    window.addEventListener('resize', resizeSparkle);

    for (let i = 0; i < 60; i++) {
      sparkles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        opacity: Math.random(),
        opDir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.015 + 0.005),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? '#C9A84C' : '#E8C96A',
        shape: Math.random() > 0.6 ? 'diamond' : 'circle'
      });
    }

    const drawDiamond = (ctx, x, y, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    };

    const animateSparkles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.opacity += s.opDir;
        if (s.opacity > 1 || s.opacity < 0.05) s.opDir *= -1;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        ctx.globalAlpha = s.opacity * 0.6;
        ctx.fillStyle = s.color;
        if (s.shape === 'diamond') {
          drawDiamond(ctx, s.x, s.y, s.size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animateSparkles);
    };

    animateSparkles();

    return () => {
      window.removeEventListener('resize', resizeSparkle);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="sparkle-canvas" ref={canvasRef}></canvas>;
};

export default SparkleCanvas;
