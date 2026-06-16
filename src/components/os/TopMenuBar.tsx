import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from './WindowManager';
import { useOSMenu } from './OSMenuSystem';

// ─── Shared dropdown styles ────────────────────────────────────────────────────
const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  background: '#1c2128',
  border: '0.5px solid rgba(255,255,255,0.12)',
  borderRadius: '0 0 8px 8px',
  minWidth: 210,
  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  fontFamily: "'JetBrains Mono', monospace",
  zIndex: 9999,
  overflow: 'hidden',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '7px 14px',
  fontSize: 10,
  color: 'rgba(255,255,255,0.7)',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  fontFamily: "'JetBrains Mono', monospace",
  transition: 'background 0.1s, color 0.1s',
};

const sectionHeader: React.CSSProperties = {
  fontSize: 8,
  color: 'rgba(255,255,255,0.25)',
  padding: '6px 14px 2px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  userSelect: 'none',
};

const separator: React.CSSProperties = {
  height: '0.5px',
  background: 'rgba(255,255,255,0.07)',
  margin: '2px 0',
};

const iconBox = (bg: string, textColor = '#fff', text = ''): React.ReactNode => (
  <span style={{
    width: 18, height: 18, borderRadius: 3, background: bg,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 8, color: textColor, flexShrink: 0, fontWeight: 700,
  }}>{text}</span>
);

const shortcutBadge = (label: string): React.ReactNode => (
  <span style={{
    fontSize: 8, color: 'rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.06)',
    padding: '1px 5px', borderRadius: 3,
    marginLeft: 'auto', flexShrink: 0,
  }}>{label}</span>
);

const externalBadge = (): React.ReactNode => (
  <span style={{
    fontSize: 8, color: '#5DCAA5',
    background: 'rgba(93,202,165,0.1)',
    padding: '1px 5px', borderRadius: 3,
    marginLeft: 'auto', flexShrink: 0,
  }}>↗</span>
);

const downloadBadge = (color = '#5DCAA5'): React.ReactNode => (
  <span style={{
    fontSize: 8, color,
    background: `${color}18`,
    padding: '1px 5px', borderRadius: 3,
    marginLeft: 'auto', flexShrink: 0,
  }}>↓</span>
);

function MenuItem({
  icon, label, right, onClick, labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onClick: () => void;
  labelColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...itemStyle,
        background: hovered ? 'rgba(127,119,221,0.15)' : 'none',
        color: hovered ? '#fff' : (labelColor ?? 'rgba(255,255,255,0.7)'),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {right}
    </button>
  );
}

// ─── About AyushOS Modal ──────────────────────────────────────────────────────
function AboutAyushOSModal({ onClose }: { onClose: () => void }) {
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 220 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    const move = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({ x: ev.clientX - offset.current.x, y: ev.clientY - offset.current.y });
    };
    const up = () => { isDragging.current = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const colors = ['#ff5f57','#febc2e','#28c840','#7F77DD','#5DCAA5','#FAC775','#F0997B','#AFA9EC'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99990, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: pos.x, top: pos.y,
          width: 560,
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 8,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          pointerEvents: 'all',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {/* Titlebar */}
        <div
          style={{ display: 'flex', alignItems: 'center', height: 36, padding: '0 12px', background: '#1c2128', borderTop: '2px solid #7F77DD', cursor: 'grab', flexShrink: 0 }}
          onMouseDown={onMouseDown}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0 }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'block' }} />
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#6e7681' }}>about_ayushos — System Info</span>
        </div>
        {/* Body */}
        {/* Body */}
        <div style={{ padding: 20, fontSize: 10, color: '#e6edf3', lineHeight: 1.8 }}>
          <div style={{ fontFamily: 'inherit', fontSize: 10, color: '#e6edf3', whiteSpace: 'pre' }}>
            {[
              ['        AM           ', 'AyushOS v1.0', '', ''],
              ['       /  \\          ───────────────────', '', '', ''],
              ['      / AM \\         ', 'OS:', '       AyushOS Linux x86_64', ''],
              ['     /______\\        ', 'Host:', '     Portfolio Website', ''],
              ['                     ', 'Kernel:', '   vanilla-js 5.0.0', ''],
              ['  ┌──────────┐       ', 'Shell:', '    bash 5.1.0', ''],
              ['  │ AyushOS  │       ', 'Resolution:', ' 1920x1080', ''],
              ['  └──────────┘       ', 'WM:', '       AyushWM (custom)', ''],
              ['                     ', 'Terminal:', ' AyushTerm', ''],
              ['                     ', 'CPU:', '      Brain @ 3.2GHz', ''],
              ['                     ', 'Memory:', '   534 LeetCode problems', ''],
              ['                     ', 'Uptime:', '   Since RCOEM 2023', ''],
              ['                     ', 'Packages:', ' React Flask Firebase YOLOv11', ''],
            ].map((row, i) => (
              <div key={i}>
                <span>{row[0]}</span>
                {row[1] && <span style={{ color: '#5DCAA5', ...(i === 0 ? { color: '#7F77DD', fontWeight: 700 } : {}) }}>{row[1]}</span>}
                <span>{row[2]}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
            {colors.map(c => (
              <span key={c} style={{ width: 20, height: 20, borderRadius: 3, background: c, display: 'block' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Keyboard Shortcuts Modal ─────────────────────────────────────────────────
function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - 280, y: window.innerHeight / 2 - 220 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    const move = (ev: MouseEvent) => { if (!isDragging.current) return; setPos({ x: ev.clientX - offset.current.x, y: ev.clientY - offset.current.y }); };
    const up = () => { isDragging.current = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const shortcuts = [
    ['Ctrl+I', 'Open intro.sh'],
    ['Ctrl+A', 'Open about_me'],
    ['Ctrl+S', 'Open skills.cfg'],
    ['Ctrl+E', 'Open experience'],
    ['Ctrl+P', 'Open projects/'],
    ['Ctrl+C', 'Open cp_stats'],
    ['Ctrl+Shift+C', 'Open contact.sh'],
    ['Escape', 'Close top window'],
    ['Right-click desktop', 'Context menu'],
    ['type hidden_egg', '🚀 hidden egg'],
    ['type matrix', '🌈 easter egg'],
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99990, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', left: pos.x, top: pos.y, width: 480,
        background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflow: 'hidden',
        pointerEvents: 'all', fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 36, padding: '0 12px', background: '#1c2128', borderTop: '2px solid #5DCAA5', cursor: 'grab' }}
          onMouseDown={onMouseDown}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0 }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'block' }} />
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#6e7681' }}>keyboard_shortcuts — Help</span>
        </div>
        <div style={{ padding: 16, fontSize: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: '#5DCAA5', padding: '4px 8px', borderBottom: '1px solid #30363d', fontSize: 9 }}>Shortcut</th>
                <th style={{ textAlign: 'left', color: '#5DCAA5', padding: '4px 8px', borderBottom: '1px solid #30363d', fontSize: 9 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map(([key, action]) => (
                <tr key={key} style={{ borderBottom: '1px solid rgba(48,54,61,0.4)' }}>
                  <td style={{ padding: '5px 8px', color: '#FAC775', fontSize: 10 }}>{key}</td>
                  <td style={{ padding: '5px 8px', color: '#e6edf3', fontSize: 10 }}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────
function CommandPalette() {
  const { closeCmdPalette, showToast, runAntigravity, runMatrixRain } = useOSMenu();
  const { openWindow, closeWindow, windows } = useWindowManager();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { closeCmdPalette(); return; }
    if (e.key !== 'Enter') return;
    const cmd = input.trim().toLowerCase();
    closeCmdPalette();

    if (cmd === 'intro' || cmd === 'intro.sh') openWindow('intro.sh');
    else if (cmd === 'about' || cmd === 'about_me') openWindow('about_me');
    else if (cmd === 'skills' || cmd === 'skills.cfg') openWindow('skills.cfg');
    else if (cmd === 'experience' || cmd === 'exp') openWindow('experience');
    else if (cmd === 'projects') openWindow('projects');
    else if (cmd === 'cp' || cmd === 'cp_stats') openWindow('cp_stats');
    else if (cmd === 'contact' || cmd === 'contact.sh') openWindow('contact.sh');
    else if (cmd === 'resume') {
      const a = document.createElement('a');
      a.href = '/Resume_AyushMalik.pdf'; a.download = 'Resume_AyushMalik.pdf'; a.click();
      showToast('📄 Downloading resume...', '#5DCAA5');
    } else if (cmd === 'closeall') {
      windows.forEach(w => closeWindow(w.id));
      showToast('[OK] All windows closed', '#5DCAA5');
    } else if (cmd === 'help') {
      showToast('Commands: intro, about, skills, experience, projects, cp, contact, resume, closeall, hidden_egg, matrix', '#AFA9EC');
    } else if (cmd === 'antigravity' || cmd === 'hidden_egg' || cmd === 'hidden') {
      runAntigravity();
    } else if (cmd === 'matrix') {
      runMatrixRain();
    } else {
      showToast(`command not found: ${input.trim()}`, '#F0997B');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={closeCmdPalette}
    >
      <div onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="$ type a command..."
          style={{
            background: '#1c2128',
            border: '0.5px solid #7F77DD',
            borderRadius: 8,
            padding: '12px 16px',
            width: 340,
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#e8eaf6',
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
}

// ─── Applications Menu ────────────────────────────────────────────────────────
function ApplicationsDropdown({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager();
  const { openCmdPalette, showToast } = useOSMenu();

  const open = (id: string) => { openWindow(id); onClose(); };

  const apps = [
    { id: 'intro.sh',   bg: '#1a1040', emoji: '💻', label: 'intro.sh',   shortcut: 'Ctrl+I' },
    { id: 'about_me',   bg: '#0a1f1a', emoji: '👤', label: 'about_me',   shortcut: 'Ctrl+A' },
    { id: 'skills.cfg', bg: '#1a1505', emoji: '⚙️', label: 'skills.cfg', shortcut: 'Ctrl+S' },
    { id: 'experience', bg: '#1a0d05', emoji: '🌿', label: 'experience', shortcut: 'Ctrl+E' },
    { id: 'projects',   bg: '#0a1525', emoji: '📁', label: 'projects/',  shortcut: 'Ctrl+P' },
    { id: 'cp_stats',   bg: '#1a0a15', emoji: '📊', label: 'cp_stats',   shortcut: 'Ctrl+C' },
    { id: 'contact.sh', bg: '#051510', emoji: '📬', label: 'contact.sh', shortcut: 'Ctrl+Shift+C' },
  ];

  return (
    <div style={dropdownStyle}>
      <div style={sectionHeader}>Portfolio</div>
      {apps.map(app => (
        <MenuItem
          key={app.id}
          icon={iconBox(app.bg, '#fff', app.emoji)}
          label={app.label}
          right={shortcutBadge(app.shortcut)}
          onClick={() => open(app.id)}
        />
      ))}
      <div style={separator} />
      <div style={sectionHeader}>Utilities</div>
      <MenuItem
        icon={iconBox('#051a0f', '#5DCAA5', '↓')}
        label="resume.pdf"
        right={downloadBadge('#5DCAA5')}
        onClick={() => {
          const a = document.createElement('a');
          a.href = '/Resume_AyushMalik.pdf'; a.download = 'Resume_AyushMalik.pdf'; a.click();
          showToast('📄 Downloading resume...', '#5DCAA5');
          onClose();
        }}
      />
      <MenuItem
        icon={iconBox('#1a1040', '#AFA9EC', '>_')}
        label="run_command..."
        onClick={() => { openCmdPalette(); onClose(); }}
      />
    </div>
  );
}

// ─── Places Menu ──────────────────────────────────────────────────────────────
function PlacesDropdown({ onClose }: { onClose: () => void }) {
  const { showToast } = useOSMenu();

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
    onClose();
  };

  const profiles = [
    { bg: '#111827', textColor: '#fff', text: 'G', label: 'GitHub', url: 'https://github.com/ayussh176' },
    { bg: '#0a1f3a', textColor: '#85B7EB', text: 'in', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ayush-malik-b864432b2/' },
    { bg: '#1a0d00', textColor: '#FAC775', text: 'LC', label: 'LeetCode', url: 'https://leetcode.com/u/ayush_176/' },
    { bg: '#001a0a', textColor: '#5DCAA5', text: 'GG', label: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/user/ayush176/' },
    { bg: '#0d001a', textColor: '#AFA9EC', text: 'CF', label: 'Codeforces', url: 'https://codeforces.com/profile/ayush_176' },
  ];

  return (
    <div style={dropdownStyle}>
      <div style={sectionHeader}>External Profiles</div>
      {profiles.map(p => (
        <MenuItem
          key={p.label}
          icon={iconBox(p.bg, p.textColor, p.text)}
          label={p.label}
          right={externalBadge()}
          onClick={() => openUrl(p.url)}
        />
      ))}
      <div style={separator} />
      <div style={sectionHeader}>Downloads</div>
      <MenuItem
        icon={iconBox('#1a1005', '#FAC775', '↓')}
        label="Resume (PDF)"
        right={downloadBadge('#FAC775')}
        onClick={() => {
          const a = document.createElement('a');
          a.href = '/Resume_AyushMalik.pdf'; a.download = 'Resume_AyushMalik.pdf'; a.click();
          showToast('📄 Downloading resume...', '#FAC775');
          onClose();
        }}
      />
    </div>
  );
}

// ─── System Menu ──────────────────────────────────────────────────────────────
function SystemDropdown({
  onClose,
  onAboutAyushOS,
  onKeyboardShortcuts,
}: {
  onClose: () => void;
  onAboutAyushOS: () => void;
  onKeyboardShortcuts: () => void;
}) {
  const { isDark, toggleTheme, cycleWallpaper, soundOn, toggleSound, runAntigravity, runMatrixRain } = useOSMenu();

  return (
    <div style={dropdownStyle}>
      <div style={sectionHeader}>Preferences</div>
      <MenuItem
        icon={iconBox('#0a1f1a', '#5DCAA5', '🖼')}
        label="Change Wallpaper"
        onClick={() => { cycleWallpaper(); onClose(); }}
      />
      <MenuItem
        icon={iconBox('#1a0d05', '#FAC775', '♪')}
        label={`Sound FX: ${soundOn ? 'ON' : 'OFF'}`}
        onClick={() => { toggleSound(); onClose(); }}
      />
      <div style={separator} />
      <div style={sectionHeader}>AyushOS</div>
      <MenuItem
        icon={iconBox('#1a1040', '#7F77DD', 'ℹ')}
        label="About AyushOS"
        onClick={() => { onAboutAyushOS(); onClose(); }}
      />
      <MenuItem
        icon={iconBox('#0a1f1a', '#5DCAA5', '⌨')}
        label="Keyboard Shortcuts"
        onClick={() => { onKeyboardShortcuts(); onClose(); }}
      />
      <MenuItem
        icon={iconBox('#1a0505', '#F0997B', '↺')}
        label="Reset Desktop"
        onClick={() => { window.dispatchEvent(new Event('ayush:reset-desktop')); onClose(); }}
      />
      <div style={separator} />
      <div style={sectionHeader}>Easter Eggs 🥚</div>
      <MenuItem
        icon={iconBox('#1a0d05', '#F0997B', '🚀')}
        label="hidden_egg.sh"
        labelColor="#F0997B"
        onClick={() => { runAntigravity(); onClose(); }}
      />
      <MenuItem
        icon={iconBox('#1a1505', '#FAC775', '🌈')}
        label="matrix_rain.sh"
        labelColor="#FAC775"
        onClick={() => { runMatrixRain(); onClose(); }}
      />
    </div>
  );
}

// ─── Mobile Hamburger Menu ────────────────────────────────────────────────────
function HamburgerMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useWindowManager();
  const { showToast } = useOSMenu();

  const sections = [
    { id: 'intro.sh',    emoji: '💻', label: 'intro.sh' },
    { id: 'about_me',    emoji: '👤', label: 'about_me' },
    { id: 'skills.cfg',  emoji: '⚙️', label: 'skills.cfg' },
    { id: 'experience',  emoji: '🌿', label: 'experience' },
    { id: 'projects',    emoji: '📁', label: 'projects/' },
    { id: 'cp_stats',    emoji: '📊', label: 'cp_stats' },
    { id: 'contact.sh',  emoji: '📬', label: 'contact.sh' },
    { id: 'terminal.sh', emoji: '🖥️', label: 'terminal.sh' },
  ];


  const profiles = [
    { emoji: 'G', label: 'GitHub',        url: 'https://github.com/ayussh176' },
    { emoji: 'in', label: 'LinkedIn',     url: 'https://www.linkedin.com/in/ayush-malik-b864432b2/' },
    { emoji: 'LC', label: 'LeetCode',     url: 'https://leetcode.com/u/ayush_176/' },
    { emoji: 'GG', label: 'GeeksForGeeks',url: 'https://www.geeksforgeeks.org/user/ayush176/' },
    { emoji: 'CF', label: 'Codeforces',   url: 'https://codeforces.com/profile/ayush_176' },
  ];

  return (
    <div className="os-hamburger-menu">
      <button className="os-hamburger-close" onClick={onClose}>✕</button>
      <div className="os-hamburger-section">Portfolio</div>
      {sections.map(s => (
        <button key={s.id} className="os-hamburger-item" onClick={() => { openWindow(s.id); onClose(); }}>
          <span style={{ fontSize: 18 }}>{s.emoji}</span>
          <span>{s.label}</span>
        </button>
      ))}
      <div className="os-hamburger-divider" />
      <div className="os-hamburger-section">External</div>
      {profiles.map(p => (
        <button key={p.label} className="os-hamburger-item" onClick={() => { window.open(p.url, '_blank', 'noopener noreferrer'); onClose(); }}>
          <span style={{ fontWeight: 700, fontSize: 11, background: '#30363d', padding: '2px 5px', borderRadius: 3 }}>{p.emoji}</span>
          <span>{p.label}</span>
          <span style={{ marginLeft: 'auto', color: '#5DCAA5', fontSize: 9 }}>↗</span>
        </button>
      ))}
      <div className="os-hamburger-divider" />
      <button className="os-hamburger-item" onClick={() => {
        const a = document.createElement('a');
        a.href = '/Resume_AyushMalik.pdf'; a.download = 'Resume_AyushMalik.pdf'; a.click();
        showToast('📄 Downloading resume...', '#5DCAA5');
        onClose();
      }}>
        <span style={{ fontSize: 14 }}>📄</span>
        <span>Resume (PDF)</span>
        <span style={{ marginLeft: 'auto', color: '#5DCAA5', fontSize: 9 }}>↓</span>
      </button>
    </div>
  );
}

// ─── Main TopMenuBar ──────────────────────────────────────────────────────────
export default function TopMenuBar() {
  const [clock, setClock] = useState('');
  const { activeDropdown, setActiveDropdown, cmdPaletteOpen } = useOSMenu();
  const { triggerRecruiterMode } = useWindowManager();
  const [showAbout, setShowAbout] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const h = now.getHours().toString().padStart(2,'0');
      const m = now.getMinutes().toString().padStart(2,'0');
      setClock(`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${h}:${m}`);
    };
    update();
    const iv = setInterval(update, 60000);
    return () => clearInterval(iv);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.os-menubar-menu-wrapper')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setActiveDropdown]);

  const toggle = useCallback((id: string) => {
    setActiveDropdown(prev => prev === id ? null : id);
  }, [setActiveDropdown]);

  const menuBtnStyle = (id: string): React.CSSProperties => ({
    color: activeDropdown === id ? '#fff' : 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    background: activeDropdown === id ? 'rgba(255,255,255,0.1)' : 'none',
    border: 'none',
    fontFamily: "'JetBrains Mono', monospace",
    position: 'relative' as const,
  });

  return (
    <>
      <header className="os-menubar">
        <div className="os-menubar-left">
          <span 
            className="os-menubar-brand" 
            onClick={triggerRecruiterMode}
            style={{ cursor: 'pointer' }}
          >
            AyushOS
          </span>

          {/* Applications */}
          <div className="os-menubar-menu-wrapper" style={{ position: 'relative' }}>
            <button style={menuBtnStyle('apps')} onClick={() => toggle('apps')}>Applications</button>
            {activeDropdown === 'apps' && (
              <ApplicationsDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </div>

          {/* Places */}
          <div className="os-menubar-menu-wrapper" style={{ position: 'relative' }}>
            <button style={menuBtnStyle('places')} onClick={() => toggle('places')}>Places</button>
            {activeDropdown === 'places' && (
              <PlacesDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </div>

          {/* System */}
          <div className="os-menubar-menu-wrapper" style={{ position: 'relative' }}>
            <button style={menuBtnStyle('system')} onClick={() => toggle('system')}>System</button>
            {activeDropdown === 'system' && (
              <SystemDropdown
                onClose={() => setActiveDropdown(null)}
                onAboutAyushOS={() => setShowAbout(true)}
                onKeyboardShortcuts={() => setShowShortcuts(true)}
              />
            )}
          </div>
        </div>

        <div className="os-menubar-right">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <span 
            onClick={triggerRecruiterMode} 
            style={{ opacity: 0.25, cursor: 'pointer', padding: '0 6px', fontSize: '10px', color: 'var(--teal)' }}
            title="Recruiter Mode"
          >
            •
          </span>
          <span className="os-menubar-clock">{clock}</span>
          {/* Hamburger — mobile only */}
          <button
            className="os-menubar-hamburger"
            onClick={() => setHamburgerOpen(o => !o)}
            aria-label="Menu"
          >☰</button>
        </div>
      </header>

      {/* Mobile hamburger menu */}
      {hamburgerOpen && <HamburgerMenu onClose={() => setHamburgerOpen(false)} />}

      {/* Modals */}
      {showAbout && <AboutAyushOSModal onClose={() => setShowAbout(false)} />}
      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}

      {/* Command Palette */}
      {cmdPaletteOpen && <CommandPalette />}
    </>
  );
}
