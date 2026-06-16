import { useState, useEffect, useCallback } from 'react';
import { useWindowManager } from './WindowManager';
import { useOSMenu } from './OSMenuSystem';

interface MenuPos { x: number; y: number; }

export default function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<MenuPos>({ x: 0, y: 0 });
  const { openWindow } = useWindowManager();
  const { cycleWallpaper, toggleTheme, runAntigravity, runMatrixRain, showToast } = useOSMenu();

  const close = useCallback(() => setVisible(false), []);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.os-window') || target.closest('.os-menubar') || target.closest('.os-taskbar')) return;
    e.preventDefault();
    // Adjust position to keep menu in viewport
    const menuW = 200, menuH = 240;
    let x = e.clientX, y = e.clientY;
    if (x + menuW > window.innerWidth) x = window.innerWidth - menuW - 8;
    if (y + menuH > window.innerHeight) y = window.innerHeight - menuH - 8;
    setPosition({ x, y });
    setVisible(true);
  }, []);

  useEffect(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close);
    };
  }, [handleContextMenu, close]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, close]);

  if (!visible) return null;

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 14px',
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'background 0.1s, color 0.1s',
  };

  const Item = ({ label, icon = '›', onClick, color }: { label: string; icon?: string; onClick: () => void; color?: string }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        style={{
          ...itemStyle,
          background: hovered ? 'rgba(127,119,221,0.15)' : 'none',
          color: hovered ? '#fff' : (color ?? 'rgba(255,255,255,0.75)'),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <span style={{ width: 14, textAlign: 'center', opacity: 0.5 }}>{icon}</span>
        {label}
      </button>
    );
  };

  const Divider = () => (
    <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '2px 0' }} />
  );

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        background: '#1c2128',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
        minWidth: 200,
        zIndex: 99999,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', monospace",
        padding: '4px 0',
      }}
      onClick={e => e.stopPropagation()}
    >
      <Item
        label="Open Terminal"
        icon="💻"
        onClick={() => { openWindow('intro.sh'); close(); }}
      />
      <Divider />
      <Item
        label="Change Wallpaper"
        icon="🖼"
        onClick={() => { cycleWallpaper(); close(); }}
      />
      <Item
        label="Toggle Theme"
        icon="◑"
        onClick={() => { toggleTheme(); close(); }}
      />
      <Divider />
      <Item
        label="Refresh Desktop"
        icon="↺"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('ayush:regenerate-stars', { detail: {} }));
          showToast('[OK] Desktop refreshed', '#5DCAA5');
          close();
        }}
      />
      <Divider />
      <Item
        label="About AyushOS"
        icon="ℹ"
        onClick={() => {
          // Dispatch event to open the about modal (handled in TopMenuBar state)
          window.dispatchEvent(new Event('ayush:open-about'));
          close();
        }}
      />
      <Item
        label="View Resume PDF ↓"
        icon="📄"
        onClick={() => {
          window.open('/Resume_AyushMalik.pdf', '_blank');
          close();
        }}
      />
      <Divider />
      <Item
        label="🚀 hidden_egg.sh"
        icon=""
        color="#F0997B"
        onClick={() => { runAntigravity(); close(); }}
      />
      <Item
        label="🌈 matrix_rain.sh"
        icon=""
        color="#FAC775"
        onClick={() => { runMatrixRain(); close(); }}
      />
    </div>
  );
}
