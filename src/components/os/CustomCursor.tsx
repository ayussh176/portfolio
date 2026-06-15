import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const hBarRef = useRef<HTMLDivElement>(null);
  const vBarRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const hBar = hBarRef.current;
    const vBar = vBarRef.current;
    const dot = dotRef.current;
    if (!cursor || !hBar || !vBar || !dot) return;

    // ── Track mouse ──
    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      spawnTrailDot(e.clientX, e.clientY);
    };

    const onMouseLeave = () => { cursor.style.opacity = '0'; };
    const onMouseEnter = () => { cursor.style.opacity = '1'; };

    // ── Trail dots ──
    const spawnTrailDot = (x: number, y: number) => {
      const now = Date.now();
      if (now - lastTrailTime.current < 30) return;
      lastTrailTime.current = now;

      const d = document.createElement('div');
      d.style.cssText = `
        position:fixed;left:${x}px;top:${y}px;
        width:3px;height:3px;background:#7F77DD;border-radius:50%;
        pointer-events:none;z-index:999998;
        transform:translate(-50%,-50%);opacity:0.6;
        transition:opacity 0.5s ease,transform 0.5s ease;
      `;
      document.body.appendChild(d);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          d.style.opacity = '0';
          d.style.transform = 'translate(-50%,-50%) scale(0.2)';
        });
      });
      setTimeout(() => d.remove(), 520);
    };

    // ── Hover state helpers ──
    const setSize = (w: number, h: number) => {
      cursor.style.width = w + 'px';
      cursor.style.height = h + 'px';
    };
    const setColor = (color: string) => {
      hBar.style.background = color;
      vBar.style.background = color;
    };
    const setDot = (size: number) => {
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
    };
    const reset = () => { setSize(18, 18); setColor('#7F77DD'); setDot(3); };

    // ── Icon hover ──
    const iconEnter = () => { setSize(24, 24); setColor('#5DCAA5'); };
    const iconLeave = () => reset();

    // ── Titlebar hover (draggable indicator) ──
    const titlebarEnter = () => { setSize(22, 22); setColor('#FAC775'); };
    const titlebarLeave = () => reset();

    // ── Button / menu item hover ──
    const btnEnter = () => { setSize(14, 14); setDot(6); };
    const btnLeave = () => reset();

    // Delegate hover listeners using event delegation on document
    const onDocMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('.os-icon')) { iconEnter(); return; }
      if (t.closest('.os-window-titlebar')) { titlebarEnter(); return; }
      if (
        t.tagName === 'BUTTON' ||
        t.closest('button') ||
        t.closest('.os-context-menu-item') ||
        t.closest('.os-menubar-menu-wrapper button')
      ) { btnEnter(); return; }
      reset();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onDocMouseOver);

    // Titlebar leave needs explicit tracking
    document.addEventListener('mouseout', (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('.os-window-titlebar')) titlebarLeave();
      if (t.closest('.os-icon')) iconLeave();
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onDocMouseOver);
    };
  }, []);

  return (
    <>
      {/* Global cursor: none */}
      <style>{`
        *, *::before, *::after { cursor: none !important; }
        input, textarea, select { cursor: text !important; }
      `}</style>

      <div
        ref={cursorRef}
        id="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 18,
          height: 18,
          pointerEvents: 'none',
          zIndex: 999999,
          transform: 'translate(-50%,-50%)',
          transition: 'width 0.15s ease, height 0.15s ease, opacity 0.2s ease',
        }}
      >
        {/* Horizontal bar */}
        <div
          ref={hBarRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: 1.5,
            background: '#7F77DD',
            transform: 'translateY(-50%)',
            transition: 'background 0.15s ease',
          }}
        />
        {/* Vertical bar */}
        <div
          ref={vBarRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            height: '100%',
            width: 1.5,
            background: '#7F77DD',
            transform: 'translateX(-50%)',
            transition: 'background 0.15s ease',
          }}
        />
        {/* Center dot */}
        <div
          ref={dotRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 3,
            height: 3,
            background: '#AFA9EC',
            borderRadius: '50%',
            transform: 'translate(-50%,-50%)',
            transition: 'width 0.15s ease, height 0.15s ease',
          }}
        />
      </div>
    </>
  );
}
