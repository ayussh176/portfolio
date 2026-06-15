import React, {
  createContext, useContext, useState, useCallback, useRef, useEffect
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface WindowState {
  id: string;
  title: string;
  accent: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowManagerContextType {
  windows: WindowState[];
  openWindow: (id: string, triggerRecruiter?: boolean) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  isWindowOpen: (id: string) => boolean;
  registerIconPosition: (id: string, x: number, y: number) => void;
  isRecruiterMode: boolean;
  setIsRecruiterMode: React.Dispatch<React.SetStateAction<boolean>>;
  recruiterAnimationActive: boolean;
  triggerRecruiterMode: () => void;
  arrangeWindowsForRecruiter: () => void;
}

const WINDOW_CONFIGS: Record<string, { title: string; accent: string }> = {
  'intro.sh':    { title: 'ayush@portfolio:~$',                    accent: 'var(--teal)' },
  'about_me':    { title: 'GNU nano 6.0 — about_me.txt',           accent: 'var(--purple)' },
  'skills.cfg':  { title: 'ayush@portfolio: /etc/skills.cfg',      accent: 'var(--teal)' },
  'experience':  { title: 'git log --all --experience --graph',    accent: 'var(--coral)' },
  'projects':    { title: '📁 ~/projects/ — File Manager',         accent: 'var(--blue)' },
  'cp_stats':    { title: '⚡ fetch --coding-stats --all-platforms',accent: 'var(--amber)' },
  'contact.sh':  { title: '$ ./contact.sh --open-channel',         accent: 'var(--pink)' },
  'terminal.sh': { title: 'AyushOS Terminal — bash',               accent: 'var(--teal)' },
  'certificates.crt': { title: 'certificates.crt — Certificate Manager', accent: 'var(--purple)' },
  'resume.pdf': { title: 'resume.pdf — Document Viewer', accent: 'var(--coral)' },
  'why_hire_me.md': { title: 'why_hire_me.md — Markdown Viewer', accent: 'var(--teal)' },
};


// Icon position registry — global ref
const iconPositions: Record<string, { x: number; y: number }> = {};

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [recruiterAnimationActive, setRecruiterAnimationActive] = useState(false);
  const zCounter = useRef(100);
  const triggerRecruiterModeRef = useRef<() => void>(() => {});

  const registerIconPosition = useCallback((id: string, x: number, y: number) => {
    iconPositions[id] = { x, y };
  }, []);

  const getDefaultPosition = useCallback((existingCount: number) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return { x: 0, y: 0 };
    const centerX = Math.max(0, (window.innerWidth - 680) / 2 + existingCount * 30);
    const centerY = Math.max(28, 80 + existingCount * 30);
    return { x: centerX, y: centerY };
  }, []);

  const openWindow = useCallback((id: string, triggerRecruiter = true) => {
    if (id === 'why_hire_me.md' && triggerRecruiter && !isRecruiterMode && !recruiterAnimationActive) {
      triggerRecruiterModeRef.current();
      return;
    }
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        zCounter.current += 1;
        return prev.map(w =>
          w.id === id ? { ...w, isMinimized: false, zIndex: zCounter.current } : w
        );
      }
      const config = WINDOW_CONFIGS[id];
      if (!config) return prev;
      zCounter.current += 1;
      const pos = getDefaultPosition(prev.filter(w => !w.isMinimized).length);
      return [...prev, {
        id, title: config.title, accent: config.accent,
        isMinimized: false, isMaximized: false,
        zIndex: zCounter.current, position: pos,
        size: { width: 680, height: 0 },
      }];
    });
  }, [getDefaultPosition, isRecruiterMode, recruiterAnimationActive]);

  const arrangeWindowsForRecruiter = useCallback(() => {
    const W = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const H = typeof window !== 'undefined' ? window.innerHeight : 700;
    const isMobile = W < 768;

    if (isMobile) {
      const ids = ['why_hire_me.md', 'resume.pdf', 'projects', 'certificates.crt', 'contact.sh'];
      ids.forEach(id => {
        openWindow(id, false);
      });
      return;
    }

    const layouts: Record<string, { x: number; y: number; w: number; h: number }> = {
      'why_hire_me.md':   { x: 15, y: 45, w: 400, h: 300 },
      'resume.pdf':       { x: W - 415, y: 45, w: 400, h: 300 },
      'projects':         { x: (W - 440) / 2, y: (H - 60 - 300) / 2 + 30, w: 440, h: 300 },
      'certificates.crt': { x: 15, y: H - 325, w: 400, h: 280 },
      'contact.sh':       { x: W - 415, y: H - 325, w: 400, h: 280 },
    };

    setWindows(() => {
      zCounter.current += 1;
      const ids = ['why_hire_me.md', 'resume.pdf', 'projects', 'certificates.crt', 'contact.sh'];
      const nextWindows: WindowState[] = [];
      
      ids.forEach((id, index) => {
        const layout = layouts[id];
        const config = WINDOW_CONFIGS[id];
        if (config) {
          nextWindows.push({
            id,
            title: config.title,
            accent: config.accent,
            isMinimized: false,
            isMaximized: false,
            position: { x: layout.x, y: layout.y },
            size: { width: layout.w, height: layout.h },
            zIndex: zCounter.current + index,
          });
        }
      });

      zCounter.current += ids.length;
      return nextWindows;
    });
  }, [openWindow]);

  const triggerRecruiterMode = useCallback(() => {
    if (isRecruiterMode || recruiterAnimationActive) return;
    setRecruiterAnimationActive(true);
    
    // Auto-open terminal or trigger sounds could go here, let's keep it simple
    setTimeout(() => {
      setRecruiterAnimationActive(false);
      setIsRecruiterMode(true);
      arrangeWindowsForRecruiter();
    }, 3200);
  }, [isRecruiterMode, recruiterAnimationActive, arrangeWindowsForRecruiter]);

  useEffect(() => {
    triggerRecruiterModeRef.current = triggerRecruiterMode;
  }, [triggerRecruiterMode]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter.current += 1;
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: zCounter.current, isMinimized: false } : w
    ));
  }, []);

  const isWindowOpen = useCallback((id: string) => {
    return windows.some(w => w.id === id);
  }, [windows]);

  return (
    <WindowManagerContext.Provider value={{
      windows, openWindow, closeWindow, minimizeWindow, maximizeWindow,
      focusWindow, isWindowOpen, registerIconPosition,
      isRecruiterMode, setIsRecruiterMode, recruiterAnimationActive,
      triggerRecruiterMode, arrangeWindowsForRecruiter,
    }}>
      {children}
    </WindowManagerContext.Provider>
  );
}

// ─── OSWindow Component ───────────────────────────────────────────────────────
interface OSWindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export function OSWindow({ windowState, children }: OSWindowProps) {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, isRecruiterMode } = useWindowManager();
  const windowRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(windowState.position);
  const [isDragging, setIsDragging] = useState(false);
  const [animState, setAnimState] = useState<'opening' | 'open' | 'closing'>('opening');
  const dragOffset = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Sync position from state changes (reorganize / alignment updates)
  useEffect(() => {
    setPos(windowState.position);
  }, [windowState.position]);

  // ── Open animation from icon origin ──
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;

    const iconPos = iconPositions[windowState.id];
    const desktopEl = document.getElementById('desktop');
    const desktopRect = desktopEl?.getBoundingClientRect();

    let originX = '50%';
    let originY = '50%';

    if (iconPos && desktopRect) {
      const ox = iconPos.x - desktopRect.left;
      const oy = iconPos.y - desktopRect.top;
      originX = `${ox}px`;
      originY = `${oy}px`;
    }

    el.style.transformOrigin = `${originX} ${originY}`;
    el.style.transform = 'scale(0.05)';
    el.style.opacity = '0';

    // Force reflow
    void el.offsetHeight;

    el.style.transition = 'transform 280ms cubic-bezier(0.34,1.4,0.64,1), opacity 200ms ease';
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';

    const cleanup = setTimeout(() => {
      el.style.transition = '';
      el.style.transformOrigin = '';
      setAnimState('open');
    }, 300);

    return () => clearTimeout(cleanup);
  }, [windowState.id]);

  const handleClose = () => {
    const el = windowRef.current;
    if (!el || animState === 'closing') return;
    setAnimState('closing');

    const iconPos = iconPositions[windowState.id];
    const desktopEl = document.getElementById('desktop');
    const desktopRect = desktopEl?.getBoundingClientRect();

    if (iconPos && desktopRect) {
      const ox = iconPos.x - desktopRect.left;
      const oy = iconPos.y - desktopRect.top;
      el.style.transformOrigin = `${ox}px ${oy}px`;
    }

    el.style.transition = 'transform 220ms cubic-bezier(0.4,0,1,1), opacity 180ms ease';
    el.style.transform = 'scale(0.05)';
    el.style.opacity = '0';

    setTimeout(() => closeWindow(windowState.id), 230);
  };

  // ── Focus pop ──
  const handleFocus = () => {
    const activeWindows = windows.filter(w => !w.isMinimized);
    const topWindow = activeWindows.reduce((max, w) => w.zIndex > max.zIndex ? w : max, activeWindows[0]);
    const isAlreadyFocused = topWindow && topWindow.id === windowState.id;

    if (isAlreadyFocused) return;

    focusWindow(windowState.id);
    const el = windowRef.current;
    if (!el || animState !== 'open') return;
    el.style.transition = 'transform 0.15s ease';
    el.style.transform = 'scale(1.008)';
    setTimeout(() => {
      el.style.transition = 'transform 0.2s cubic-bezier(0.34,1.2,0.64,1)';
      el.style.transform = 'scale(1)';
      setTimeout(() => { if (el) el.style.transition = ''; }, 220);
    }, 150);
  };

  // ── Drag (desktop) ──
  const handleTitlebarMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    focusWindow(windowState.id);
    const el = windowRef.current;
    if (!el) return;

    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setIsDragging(true);

    // Wobble
    el.style.transition = 'transform 0.1s ease';
    el.style.transform = 'rotate(1.2deg) scale(1.01)';

    const onMove = (ev: MouseEvent) => {
      setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y });
    };
    const onUp = () => {
      setIsDragging(false);
      if (el) {
        el.style.transition = 'transform 0.3s cubic-bezier(0.34,1.4,0.64,1)';
        el.style.transform = 'rotate(0deg) scale(1)';
        setTimeout(() => { if (el) el.style.transition = ''; }, 320);
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // ── Touch swipe-down to close (mobile) ──
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - touchStartY.current;
    const el = windowRef.current;
    if (!el || dy < 0) return;
    el.style.transform = `translateY(${Math.min(dy * 0.5, 80)}px)`;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const el = windowRef.current;
    if (!el) return;
    if (dy > 60) {
      handleClose();
    } else {
      el.style.transition = 'transform 0.3s cubic-bezier(0.34,1.4,0.64,1)';
      el.style.transform = 'translateY(0)';
      setTimeout(() => { if (el) el.style.transition = ''; }, 320);
    }
  };

  if (windowState.isMinimized) return null;

  const style: React.CSSProperties = windowState.isMaximized
    ? { position: 'fixed', top: 28, left: 0, width: '100vw', height: 'calc(100vh - 60px)', zIndex: windowState.zIndex, borderRadius: 0 }
    : isMobile
    ? { position: 'fixed', top: 30, left: 0, right: 0, bottom: 44, width: '100%', zIndex: windowState.zIndex, borderRadius: 0 }
    : { position: 'absolute', left: pos.x, top: pos.y, width: windowState.size?.width || 680, zIndex: windowState.zIndex };

  const isImportant = isRecruiterMode && (windowState.id === 'why_hire_me.md' || windowState.id === 'resume.pdf');

  return (
    <div
      ref={windowRef}
      className={`os-window ${isImportant ? 'pulse-glow-window' : ''}`}
      style={style}
      onMouseDown={handleFocus}
    >
      <div
        className={`os-window-titlebar ${isDragging ? 'dragging' : ''}`}
        style={{ borderTop: `2px solid ${windowState.accent}` }}
        onMouseDown={handleTitlebarMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="os-window-dots">
          <button className="os-window-dot close" onClick={handleClose} title="Close" />
          <button className="os-window-dot minimize" onClick={() => minimizeWindow(windowState.id)} title="Minimize" />
          <button className="os-window-dot maximize" onClick={() => maximizeWindow(windowState.id)} title="Maximize" />
        </div>
        <span className="os-window-title">{windowState.title}</span>
      </div>
      <div
        className="os-window-body"
        style={windowState.isMaximized || isMobile ? { maxHeight: 'none', height: 'calc(100% - 36px)' } : {}}
      >
        {children}
      </div>
    </div>
  );
}
