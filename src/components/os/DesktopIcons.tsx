import { useEffect, useRef, useState } from 'react';
import { useWindowManager } from './WindowManager';

const ICONS = [
  { id: 'why_hire_me.md', emoji: '📝', label: 'why_hire_me.md', accent: 'var(--teal)' },
  { id: 'intro.sh',    emoji: '💻', label: 'intro.sh',    accent: 'var(--teal)' },
  { id: 'about_me',    emoji: '👤', label: 'about_me',    accent: 'var(--purple)' },
  { id: 'skills.cfg',  emoji: '⚙️', label: 'skills.cfg',  accent: 'var(--teal)' },
  { id: 'experience',  emoji: '🌿', label: 'experience',  accent: 'var(--coral)' },
  { id: 'projects',    emoji: '📁', label: 'projects/',   accent: 'var(--blue)' },
  { id: 'certificates.crt', emoji: '📜', label: 'certificates.crt', accent: 'var(--purple)' },
  { id: 'resume.pdf',  emoji: '📄', label: 'resume.pdf',  accent: 'var(--coral)' },
  { id: 'cp_stats',    emoji: '📊', label: 'cp_stats',    accent: 'var(--amber)' },
  { id: 'contact.sh',  emoji: '📬', label: 'contact.sh',  accent: 'var(--pink)' },
  { id: 'terminal.sh', emoji: '🖥️', label: 'terminal.sh', accent: 'var(--teal)' },
];

const ICON_POSITION_STORAGE_KEY = 'ayush_desktop_icon_positions_v5';
const ICON_START_X = 12;
const ICON_START_Y = 12;
const ICON_STEP_X = 90;

function getHorizontalIconPositions() {
  const initial: Record<string, { x: number; y: number }> = {};
  ICONS.forEach((icon, i) => {
    initial[icon.id] = {
      x: ICON_START_X + i * ICON_STEP_X,
      y: ICON_START_Y,
    };
  });
  return initial;
}

interface IconButtonProps {
  id: string;
  emoji: string;
  label: string;
  accent: string;
  pos: { x: number; y: number };
  onPositionChange: (id: string, x: number, y: number) => void;
}

function IconButton({ id, emoji, label, accent, pos, onPositionChange }: IconButtonProps) {
  const { openWindow, isWindowOpen, registerIconPosition } = useWindowManager();
  const ref = useRef<HTMLButtonElement>(null);

  // Register position dynamically with WindowManager so window opening animations snap to the icon's coordinate
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    registerIconPosition(id, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, [id, pos, registerIconPosition]);

  // Handle resizing so icons staying beyond boundaries are snapped inside
  useEffect(() => {
    const handleResize = () => {
      const desktop = document.getElementById('desktop');
      const limitX = desktop ? desktop.clientWidth : window.innerWidth;
      const limitY = desktop ? desktop.clientHeight : window.innerHeight;

      let adjustedX = pos.x;
      let adjustedY = pos.y;

      if (pos.x + 80 > limitX) adjustedX = Math.max(12, limitX - 86);
      if (pos.y + 80 > limitY) adjustedY = Math.max(12, limitY - 86);

      if (adjustedX !== pos.x || adjustedY !== pos.y) {
        onPositionChange(id, adjustedX, adjustedY);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id, pos, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Only left click drags
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const startDrag = (clientX: number, clientY: number) => {
    const startX = pos.x;
    const startY = pos.y;
    const originX = clientX;
    const originY = clientY;
    let hasMoved = false;

    // Change cursor to grabbing during move
    document.body.style.cursor = 'grabbing';

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const dx = currentClientX - originX;
      const dy = currentClientY - originY;

      // Filter click vs drag with a 5px movement threshold
      if (Math.hypot(dx, dy) > 5) {
        hasMoved = true;
      }

      let newX = startX + dx;
      let newY = startY + dy;

      const desktop = document.getElementById('desktop');
      const limitX = desktop ? desktop.clientWidth : window.innerWidth;
      const limitY = desktop ? desktop.clientHeight : window.innerHeight;

      // Keep inside boundary with a 12px margin
      newX = Math.max(12, Math.min(newX, limitX - 86));
      newY = Math.max(12, Math.min(newY, limitY - 86));

      onPositionChange(id, newX, newY);
    };

    const onUp = () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      // Trigger standard click event only if drag did not occur
      if (!hasMoved) {
        openWindow(id);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  };

  const isCert = id === 'certificates.crt';
  const isPDF = id === 'resume.pdf';
  const isMD = id === 'why_hire_me.md';

  return (
    <button
      ref={ref}
      className={`os-icon ${isCert ? 'certificates-crt-icon' : ''} ${isPDF ? 'resume-pdf-icon' : ''} ${isMD ? 'why-hire-me-icon' : ''} ${isWindowOpen(id) ? 'selected' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ left: pos.x, top: pos.y }}
    >
      {isCert ? (
        <div className="linux-cert-icon-container">
          <div className="linux-cert-doc-icon">
            <svg viewBox="0 0 40 48" fill="none" className="linux-cert-svg">
              <path d="M4 2C2.9 2 2 2.9 2 4V44C2 45.1 2.9 46 4 46H36C37.1 46 38 45.1 38 44V14L26 2H4Z" fill="var(--card)" stroke="var(--purple)" strokeWidth="2"/>
              <path d="M26 2V14H38" stroke="var(--purple)" strokeWidth="2" fill="rgba(127,119,221,0.2)"/>
              <line x1="8" y1="22" x2="32" y2="22" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="28" x2="24" y2="28" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="36" r="4" fill="var(--amber)" stroke="var(--purple)" strokeWidth="1.5"/>
              <path d="M18 39L17 43L20 41.5L23 43L22 39" fill="var(--amber)" stroke="var(--purple)" strokeWidth="1"/>
            </svg>
            <div className="linux-cert-verified-badge" title="Verified Credentials">
              ✓
            </div>
          </div>
        </div>
      ) : isPDF ? (
        <div className="linux-pdf-icon-container">
          <div className="linux-pdf-doc-icon">
            <svg viewBox="0 0 40 48" fill="none" className="linux-pdf-svg">
              <path d="M4 2C2.9 2 2 2.9 2 4V44C2 45.1 2.9 46 4 46H36C37.1 46 38 45.1 38 44V14L26 2H4Z" fill="var(--card)" stroke="var(--coral)" strokeWidth="2"/>
              <path d="M26 2V14H38" stroke="var(--coral)" strokeWidth="2" fill="rgba(240,153,123,0.2)"/>
              <line x1="8" y1="20" x2="32" y2="20" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="26" x2="32" y2="26" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="32" x2="24" y2="32" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="38" x2="20" y2="38" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="linux-pdf-badge" title="PDF Document">
              PDF
            </div>
          </div>
        </div>
      ) : isMD ? (
        <div className="linux-md-icon-container">
          <div className="linux-md-doc-icon">
            <svg viewBox="0 0 40 48" fill="none" className="linux-md-svg">
              <path d="M4 2C2.9 2 2 2.9 2 4V44C2 45.1 2.9 46 4 46H36C37.1 46 38 45.1 38 44V14L26 2H4Z" fill="var(--card)" stroke="var(--teal)" strokeWidth="2"/>
              <path d="M26 2V14H38" stroke="var(--teal)" strokeWidth="2" fill="rgba(93,202,165,0.2)"/>
              <rect x="8" y="22" width="24" height="18" rx="2" stroke="var(--muted)" strokeWidth="1.5"/>
              <path d="M12 27V35M12 27L15 31L18 27V35" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 29L26 26L28 29M26 26V34" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      ) : (
        <span className="os-icon-emoji">{emoji}</span>
      )}
      <span className="os-icon-label" style={{ color: accent }}>{label}</span>
    </button>
  );
}

export default function DesktopIcons() {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    try {
      const saved = localStorage.getItem(ICON_POSITION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse saved icon positions", e);
    }
    return getHorizontalIconPositions();
  });

  const handlePositionChange = (id: string, x: number, y: number) => {
    setPositions(prev => {
      const next = { ...prev, [id]: { x, y } };
      try {
        localStorage.setItem(ICON_POSITION_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save icon positions", e);
      }
      return next;
    });
  };

  // Listen to desktop reset and recalculate the horizontal layout
  useEffect(() => {
    const handleReset = () => {
      const initial = getHorizontalIconPositions();
      setPositions(initial);
      try {
        localStorage.setItem(ICON_POSITION_STORAGE_KEY, JSON.stringify(initial));
      } catch (e) {
        console.error("Failed to save icon positions on reset", e);
      }
    };
    window.addEventListener('ayush:reset-desktop', handleReset);
    return () => window.removeEventListener('ayush:reset-desktop', handleReset);
  }, []);

  return (
    <div className="os-icons">
      {ICONS.map(icon => (
        <IconButton
          key={icon.id}
          {...icon}
          pos={positions[icon.id] || { x: 12, y: 12 }}
          onPositionChange={handlePositionChange}
        />
      ))}
    </div>
  );
}
