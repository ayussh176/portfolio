import React, {
  createContext, useContext, useState, useEffect, useCallback, useRef
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OSMenuContextType {
  // Toast
  showToast: (message: string, color?: string) => void;
  // Theme
  isDark: boolean;
  toggleTheme: () => void;
  // Wallpaper
  wallpaperIndex: number;
  cycleWallpaper: () => void;
  // Sound FX
  soundOn: boolean;
  toggleSound: () => void;
  playClickSound: () => void;
  // Easter eggs
  runAntigravity: () => void;
  runMatrixRain: () => void;
  // Command palette
  cmdPaletteOpen: boolean;
  openCmdPalette: () => void;
  closeCmdPalette: () => void;
  // Dropdown management
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  closeAllDropdowns: () => void;
}

const OSMenuContext = createContext<OSMenuContextType | null>(null);

export function useOSMenu() {
  const ctx = useContext(OSMenuContext);
  if (!ctx) throw new Error('useOSMenu must be used inside OSMenuProvider');
  return ctx;
}

const WALLPAPERS = [
  '#0d1117', // deep space black (default)
  '#0a0f1e', // midnight blue
  '#0f0d17', // deep purple
  '#061a0f', // forest dark
  '#1a0d05', // ember dark
];

// ─── Provider ────────────────────────────────────────────────────────────────
export function OSMenuProvider({
  children,
  openWindow,
  closeAllWindows,
}: {
  children: React.ReactNode;
  openWindow: (id: string) => void;
  closeAllWindows: () => void;
}) {
  // ── Persisted state ──
  const [isDark, setIsDark] = useState(() => {
    return (localStorage.getItem('ayush_theme') ?? 'dark') === 'dark';
  });
  const [wallpaperIndex, setWallpaperIndex] = useState(() => {
    return parseInt(localStorage.getItem('ayush_wallpaper_index') ?? '0', 10);
  });
  const [soundOn, setSoundOn] = useState(() => {
    return (localStorage.getItem('ayush_sound') ?? 'on') === 'on';
  });

  // ── Local state ──
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ── Apply theme / wallpaper on load and change ──
  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDark);
    // Set desktop bg
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.style.setProperty('--wallpaper-bg', WALLPAPERS[wallpaperIndex]);
    }
    document.documentElement.style.setProperty(
      '--bg-override', WALLPAPERS[wallpaperIndex]
    );
  }, [isDark, wallpaperIndex]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('ayush_theme', next ? 'dark' : 'light');
      showToast(
        next ? '🌑 Switched to Dark Mode' : '☀️ Switched to Light Mode',
        next ? '#AFA9EC' : '#FAC775'
      );
      return next;
    });
  }, []);

  const cycleWallpaper = useCallback(() => {
    setWallpaperIndex(prev => {
      const next = (prev + 1) % WALLPAPERS.length;
      localStorage.setItem('ayush_wallpaper_index', String(next));
      // Regenerate stars signal via custom event
      window.dispatchEvent(new CustomEvent('ayush:regenerate-stars', {
        detail: { bg: WALLPAPERS[next] }
      }));
      showToast('🎨 Wallpaper changed', '#5DCAA5');
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      const next = !prev;
      localStorage.setItem('ayush_sound', next ? 'on' : 'off');
      showToast(`🔊 Sound FX: ${next ? 'ON' : 'OFF'}`, next ? '#5DCAA5' : '#F0997B');
      return next;
    });
  }, []);

  const playClickSound = useCallback(() => {
    if (!soundOn) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) { /* ignore */ }
  }, [soundOn]);

  // ── Toast ──
  const showToast = useCallback((message: string, color: string = '#AFA9EC') => {
    const existing = document.getElementById('ayush-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'ayush-toast';
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 60px;
      right: 20px;
      background: #1c2128;
      border: 0.5px solid ${color}55;
      border-radius: 8px;
      padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: ${color};
      z-index: 99999;
      transform: translateX(120px);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      max-width: 260px;
      line-height: 1.6;
      pointer-events: none;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
      });
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(120px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }, []);

  // ── Reset Desktop ──
  const resetDesktop = useCallback(() => {
    closeAllWindows();
    setWallpaperIndex(0);
    setIsDark(true);
    localStorage.setItem('ayush_theme', 'dark');
    localStorage.setItem('ayush_wallpaper_index', '0');
    document.body.classList.remove('light-mode');
    window.dispatchEvent(new CustomEvent('ayush:regenerate-stars', {
      detail: { bg: WALLPAPERS[0] }
    }));
    showToast('[OK] Desktop reset to defaults', '#5DCAA5');
  }, [closeAllWindows, showToast]);

  // Expose reset via event
  useEffect(() => {
    const handler = () => resetDesktop();
    window.addEventListener('ayush:reset-desktop', handler);
    return () => window.removeEventListener('ayush:reset-desktop', handler);
  }, [resetDesktop]);

  // ── Dropdown helpers ──
  const closeAllDropdowns = useCallback(() => setActiveDropdown(null), []);

  // ── Cmd palette ──
  const openCmdPalette = useCallback(() => {
    setCmdPaletteOpen(true);
    setActiveDropdown(null);
  }, []);
  const closeCmdPalette = useCallback(() => setCmdPaletteOpen(false), []);

  // ── Easter egg: Antigravity ──
  const runAntigravity = useCallback(() => {
    setActiveDropdown(null);
    showToast(
      '🚀 hidden_egg.sh — gravity disabled<br/>Press ESC or wait 6s to restore',
      '#F0997B'
    );

    // Optionally write to terminal if open
    const termOutput = document.querySelector('.terminal') as HTMLElement;
    if (termOutput) {
      const lines = [
        '[system@AyushOS] $ ./hidden_egg.sh',
        '[INFO] Locating gravity module...',
        '[OK]   Gravity module disabled. Stand by.',
        '[WARN] All desktop objects are now weightless.',
      ];
      lines.forEach((text, i) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.textContent = text;
          div.style.color = i === 2 ? '#5DCAA5' : i === 3 ? '#FAC775' : '#e6edf3';
          termOutput.appendChild(div);
          termOutput.scrollTop = termOutput.scrollHeight;
        }, i * 200);
      });
    }

    // Collect icons
    const icons = Array.from(document.querySelectorAll('.os-icon')) as HTMLElement[];
    const desktop = document.getElementById('desktop');
    if (!desktop || icons.length === 0) return;

    const desktopRect = desktop.getBoundingClientRect();

    // Snapshot positions
    icons.forEach(icon => {
      const rect = icon.getBoundingClientRect();
      icon.style.position = 'absolute';
      icon.style.left = `${rect.left - desktopRect.left}px`;
      icon.style.top = `${rect.top - desktopRect.top}px`;
    });

    // Launch icons
    icons.forEach((icon, i) => {
      const delay = i * 80 + Math.random() * 150;
      const randomX = (Math.random() - 0.5) * 500;
      const randomDeg = Math.random() * 720 - 360;
      setTimeout(() => {
        icon.style.transition = 'transform 1400ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 1200ms ease';
        icon.style.transform = `translate(${randomX}px, -700px) rotate(${randomDeg}deg) scale(0.2)`;
        icon.style.opacity = '0';
      }, delay);
    });

    // Restore
    const restoreGravity = () => {
      document.removeEventListener('keydown', escHandler);
      icons.forEach(icon => {
        icon.style.transition = 'transform 900ms cubic-bezier(0.34,1.56,0.64,1), opacity 400ms ease';
        icon.style.transform = 'translate(0,0) rotate(0deg) scale(1)';
        icon.style.opacity = '1';
        setTimeout(() => {
          icon.style.position = '';
          icon.style.left = '';
          icon.style.top = '';
          icon.style.transition = '';
          icon.style.transform = '';
          icon.style.opacity = '';
        }, 950);
      });
      const toastEl = document.getElementById('ayush-toast');
      if (toastEl) toastEl.remove();
      if (termOutput) {
        setTimeout(() => {
          const div = document.createElement('div');
          div.textContent = '[OK] Gravity restored. All objects returned to orbit.';
          div.style.color = '#5DCAA5';
          termOutput.appendChild(div);
          termOutput.scrollTop = termOutput.scrollHeight;
        }, 950);
      }
    };

    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        restoreGravity();
      }
    };
    document.addEventListener('keydown', escHandler);
    setTimeout(restoreGravity, 6000);
  }, [showToast]);

  // ── Easter egg: Matrix Rain ──
  const runMatrixRain = useCallback(() => {
    setActiveDropdown(null);
    if (document.getElementById('matrix-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 8888;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    requestAnimationFrame(() => {
      canvas.style.opacity = '0.85';
    });

    const ctx = canvas.getContext('2d')!;
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(13,17,23,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00ff41';
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const matrixInterval = setInterval(drawMatrix, 40);

    showToast(
      '🌈 matrix_rain.sh — initiated<br/>Press ESC to exit the matrix',
      '#FAC775'
    );

    const stopMatrix = () => {
      document.removeEventListener('keydown', matrixEsc);
      clearInterval(matrixInterval);
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 500);
      const toastEl = document.getElementById('ayush-toast');
      if (toastEl) toastEl.remove();
    };

    const matrixEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopMatrix();
    };
    document.addEventListener('keydown', matrixEsc);
    setTimeout(stopMatrix, 6000);
  }, [showToast]);

  // ── Global keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Command palette Escape
      if (e.key === 'Escape') {
        if (cmdPaletteOpen) { closeCmdPalette(); return; }
        return;
      }
      if (!e.ctrlKey && !e.metaKey) return;

      if (e.key === 'i' || e.key === 'I') { e.preventDefault(); openWindow('intro.sh'); }
      else if (e.key === 'a' || e.key === 'A') { e.preventDefault(); openWindow('about_me'); }
      else if (e.key === 's' || e.key === 'S') { e.preventDefault(); openWindow('skills.cfg'); }
      else if (e.key === 'e' || e.key === 'E') { e.preventDefault(); openWindow('experience'); }
      else if (e.key === 'p' || e.key === 'P') { e.preventDefault(); openWindow('projects'); }
      else if ((e.key === 'c' || e.key === 'C') && e.shiftKey) { e.preventDefault(); openWindow('contact.sh'); }
      else if (e.key === 'c' || e.key === 'C') { e.preventDefault(); openWindow('cp_stats'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cmdPaletteOpen, openWindow, closeCmdPalette]);

  const value: OSMenuContextType = {
    showToast,
    isDark,
    toggleTheme,
    wallpaperIndex,
    cycleWallpaper,
    soundOn,
    toggleSound,
    playClickSound,
    runAntigravity,
    runMatrixRain,
    cmdPaletteOpen,
    openCmdPalette,
    closeCmdPalette,
    activeDropdown,
    setActiveDropdown,
    closeAllDropdowns,
  };

  return (
    <OSMenuContext.Provider value={value}>
      {children}
    </OSMenuContext.Provider>
  );
}
