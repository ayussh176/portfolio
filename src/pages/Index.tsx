import { useEffect, useState, useRef } from 'react';
import React from 'react';
import TopMenuBar from '@/components/os/TopMenuBar';
import Taskbar from '@/components/os/Taskbar';
import DesktopIcons from '@/components/os/DesktopIcons';
import StarsCanvas from '@/components/os/StarsCanvas';
import BootScreen from '@/components/os/BootScreen';
import ContextMenu from '@/components/os/ContextMenu';
import CustomCursor from '@/components/os/CustomCursor';
import { OSMenuProvider } from '@/components/os/OSMenuSystem';
import { useWindowManager, OSWindow } from '@/components/os/WindowManager';

// Window content components
import IntroWindow from '@/components/windows/IntroWindow';
import AboutWindow from '@/components/windows/AboutWindow';
import ExperienceWindow from '@/components/windows/ExperienceWindow';
import SkillsWindow from '@/components/windows/SkillsWindow';
import ProjectsWindow from '@/components/windows/ProjectsWindow';
import CpStatsWindow from '@/components/windows/CpStatsWindow';
import ContactWindow from '@/components/windows/ContactWindow';
import TerminalWindow from '@/components/windows/TerminalWindow';
import CertificatesWindow from '@/components/windows/CertificatesWindow';
import ResumeWindow from '@/components/windows/ResumeWindow';
import WhyHireMeWindow from '@/components/windows/WhyHireMeWindow';


const WINDOW_CONTENT: Record<string, React.ComponentType> = {
  'intro.sh':    IntroWindow,
  'about_me':    AboutWindow,
  'skills.cfg':  SkillsWindow,
  'experience':  ExperienceWindow,
  'projects':    ProjectsWindow,
  'cp_stats':    CpStatsWindow,
  'contact.sh':  ContactWindow,
  'terminal.sh': TerminalWindow,
  'certificates.crt': CertificatesWindow,
  'resume.pdf': ResumeWindow,
  'why_hire_me.md': WhyHireMeWindow,
};


const WALLPAPERS = ['#0d1117','#0a0f1e','#0f0d17','#061a0f','#1a0d05'];

function MatrixRainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cols = Math.floor(canvas.width / 18);
    const drops = Array(cols).fill(1);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZaiueo';

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#5DCAA5';
      ctx.font = '11px monospace';

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 18, y * 11);

        if (y * 11 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.12,
      }}
    />
  );
}

function RecruiterModeOverlay() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      'Recruiter Mode Activated...',
      'Analyzing candidate profile...',
      'Loading strongest evidence...',
      'Optimizing hiring workflow...',
      '[OK]'
    ];
    let idx = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const printNext = () => {
      if (idx < sequence.length) {
        setLogs(prev => [...prev, sequence[idx]]);
        idx++;
        const delay = idx === 5 ? 400 : 600;
        const t = setTimeout(printNext, delay);
        timers.push(t);
      }
    };

    printNext();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="recruiter-activation-overlay">
      <div className="recruiter-overlay-content">
        {logs.map((log, i) => (
          <div key={i} className={`recruiter-overlay-line ${log === '[OK]' ? 'success' : ''}`}>
            {log}
          </div>
        ))}
        {logs.length < 5 && (
          <div className="recruiter-overlay-line">
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

function Desktop() {
  const {
    windows, openWindow, closeWindow,
    isRecruiterMode, setIsRecruiterMode,
    recruiterAnimationActive, triggerRecruiterMode
  } = useWindowManager();

  const [wallpaperIndex, setWallpaperIndex] = useState(() =>
    parseInt(localStorage.getItem('ayush_wallpaper_index') ?? '0', 10)
  );
  // Boot completion controls desktop fade-in
  const alreadyBooted = sessionStorage.getItem('ayush_booted') === '1';
  const [desktopVisible, setDesktopVisible] = useState(alreadyBooted);

  // Sync body class for recruiter-mode
  useEffect(() => {
    document.body.classList.toggle('recruiter-mode', isRecruiterMode);
  }, [isRecruiterMode]);

  // Apply body class + saved theme
  useEffect(() => {
    document.body.classList.add('ayushos');
    const theme = localStorage.getItem('ayush_theme') ?? 'dark';
    document.body.classList.toggle('light-mode', theme === 'light');
    return () => {
      document.body.classList.remove('ayushos');
      document.body.classList.remove('light-mode');
      document.body.classList.remove('mobile-mode');
      document.body.classList.remove('recruiter-mode');
    };
  }, []);

  // Keyboard Shortcut Ctrl+Shift+H to trigger recruiter mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        triggerRecruiterMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerRecruiterMode]);

  // Mobile mode detection
  useEffect(() => {
    const check = () => {
      document.body.classList.toggle('mobile-mode', window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Listen for wallpaper changes
  useEffect(() => {
    const handler = () => {
      const idx = parseInt(localStorage.getItem('ayush_wallpaper_index') ?? '0', 10);
      setWallpaperIndex(idx);
    };
    window.addEventListener('ayush:regenerate-stars', handler);
    return () => window.removeEventListener('ayush:regenerate-stars', handler);
  }, []);

  // Listen for reset-desktop
  useEffect(() => {
    const handler = () => setWallpaperIndex(0);
    window.addEventListener('ayush:reset-desktop', handler);
    return () => window.removeEventListener('ayush:reset-desktop', handler);
  }, []);

  // Auto-open intro.sh after boot
  useEffect(() => {
    if (!desktopVisible) return;
    const timer = setTimeout(() => {
      // In recruiter mode, let the arrangeWindowsForRecruiter take precedence
      if (!isRecruiterMode) {
        openWindow('intro.sh');
      }
    }, alreadyBooted ? 100 : 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopVisible, isRecruiterMode]);

  const closeAllWindows = () => windows.forEach(w => closeWindow(w.id));

  const handleBootComplete = () => {
    setDesktopVisible(true);
  };

  const handleDownloadResume = () => {
    openWindow('resume.pdf');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('ayush:download-resume-action'));
    }, 450);
  };

  return (
    <OSMenuProvider openWindow={openWindow} closeAllWindows={closeAllWindows}>
      {/* Custom cursor — hidden on touch devices via CSS */}
      <CustomCursor />

      {/* Boot screen — passes callback for fade-in */}
      <BootScreen onBootComplete={handleBootComplete} />

      {/* Recruiter Activation overlay logs sequence */}
      {recruiterAnimationActive && <RecruiterModeOverlay />}

      {/* Stars background */}
      <StarsCanvas />

      {/* Top menu bar */}
      <TopMenuBar />

      {/* Main desktop — fades in after boot */}
      <div
        className="os-desktop"
        id="desktop"
        style={{
          backgroundColor: WALLPAPERS[wallpaperIndex],
          opacity: desktopVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {isRecruiterMode && <MatrixRainOverlay />}

        {/* Conky-like system widgets for hiring details on wallpaper */}
        {isRecruiterMode && (
          <div className="desktop-conky-widget animate-fade-in">
            <div className="conky-header">HIRING DASHBOARD</div>
            <div className="conky-divider">━━━━━━━━━━━━━━━━━━</div>
            <div className="conky-row">
              <span className="conky-label">Top Skills:</span>
              <span className="conky-val">AI/ML, React, Firebase, Python</span>
            </div>
            <div className="conky-row">
              <span className="conky-label">Experience:</span>
              <span className="conky-val">Software Development Intern</span>
            </div>
            <div className="conky-row">
              <span className="conky-label">Projects:</span>
              <span className="conky-val">4+ Production Systems</span>
            </div>
            <div className="conky-row">
              <span className="conky-label">LeetCode:</span>
              <span className="conky-val">500+ Solved Problems</span>
            </div>
            <div className="conky-row status">
              <span className="conky-label">Status:</span>
              <span className="conky-val status-badge">OPEN TO WORK</span>
            </div>
            <div className="conky-divider">━━━━━━━━━━━━━━━━━━</div>
          </div>
        )}

        <DesktopIcons />

        {windows.map(windowState => {
          const ContentComponent = WINDOW_CONTENT[windowState.id];
          if (!ContentComponent) return null;
          return (
            <OSWindow key={windowState.id} windowState={windowState}>
              <ContentComponent />
            </OSWindow>
          );
        })}

        {/* Floating recruiter CTA dock */}
        {isRecruiterMode && (
          <div className="recruiter-cta-dock animate-fade-in">
            <div className="cta-dock-title">⚡ Recruiter Quick Actions</div>
            <div className="cta-dock-buttons">
              <button onClick={() => openWindow('contact.sh')} className="cta-dock-btn primary">
                <span>📅</span> Schedule Interview
              </button>
              <button onClick={handleDownloadResume} className="cta-dock-btn">
                <span>📄</span> Download Resume
              </button>
              <button onClick={() => openWindow('projects')} className="cta-dock-btn">
                <span>📁</span> View Projects
              </button>
              <button onClick={() => openWindow('contact.sh')} className="cta-dock-btn">
                <span>📬</span> Contact Candidate
              </button>
            </div>
            <button 
              onClick={() => setIsRecruiterMode(false)} 
              className="cta-dock-close"
              title="Exit Recruiter Mode"
            >
              ✕ Exit Mode
            </button>
          </div>
        )}
      </div>

      <Taskbar />
      <ContextMenu />
    </OSMenuProvider>
  );
}

const Index = () => {
  return <Desktop />;
};

export default Index;
