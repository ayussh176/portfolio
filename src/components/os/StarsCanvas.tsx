import { useEffect, useRef } from 'react';

const STAR_COUNT = 80;

interface Star {
  x: number; y: number;
  ox: number; oy: number;
  size: number;
  opacity: number;
  vx: number; vy: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  temporary?: boolean;
  life?: number;
}

export default function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const frameRef = useRef(0);
  const animIdRef = useRef(0);

  const initStars = (canvas: HTMLCanvasElement) => {
    starsRef.current = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      starsRef.current.push({
        x, y, ox: x, oy: y,
        size: Math.random() * 1.4 + 0.3,
        opacity: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  };

  const animate = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    frameRef.current++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const REPEL_RADIUS = 90;
    const REPEL_FORCE = 1.8;

    starsRef.current = starsRef.current.filter(star => {
      if (star.temporary) {
        star.life = (star.life ?? 120) - 1;
        if (star.life <= 0) return false;
      }
      return true;
    });

    starsRef.current.forEach(star => {
      // Twinkle
      const twinkle = star.opacity + Math.sin(frameRef.current * star.twinkleSpeed + star.twinkleOffset) * 0.08;

      // Mouse repulsion
      const dx = star.x - mx;
      const dy = star.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        star.vx += (dx / dist) * force * REPEL_FORCE * 0.08;
        star.vy += (dy / dist) * force * REPEL_FORCE * 0.08;
      }

      // Spring return to origin
      star.vx += (star.ox - star.x) * 0.015;
      star.vy += (star.oy - star.y) * 0.015;

      // Friction
      star.vx *= 0.92;
      star.vy *= 0.92;

      star.x += star.vx;
      star.y += star.vy;

      // Draw
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      const alpha = star.temporary
        ? Math.min(0.6, Math.max(0, (star.life ?? 0) / 120) * 0.6)
        : Math.max(0, Math.min(0.6, twinkle));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });

    animIdRef.current = requestAnimationFrame(() => animate(canvas));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas);
    };
    resize();

    animate(canvas);

    // Mouse tracking relative to canvas
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -999, y: -999 }; };

    // Click burst on desktop (not on windows/icons)
    const onDesktopClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.os-window') || target.closest('.os-icon') || target.closest('.os-menubar') || target.closest('.os-taskbar')) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 / 10) * i;
        const speed = Math.random() * 2.5 + 1;
        starsRef.current.push({
          x: cx, y: cy,
          ox: cx + Math.cos(angle) * 60,
          oy: cy + Math.sin(angle) * 60,
          size: Math.random() * 1.2 + 0.5,
          opacity: 0.6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          twinkleSpeed: 0.04,
          twinkleOffset: Math.random() * Math.PI * 2,
          temporary: true,
          life: 120,
        });
      }
    };

    // Regenerate on wallpaper change / reset
    const onRegenerate = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onDesktopClick);
    window.addEventListener('ayush:regenerate-stars', onRegenerate);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onDesktopClick);
      window.removeEventListener('ayush:regenerate-stars', onRegenerate);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="stars-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
