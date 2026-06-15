import { useState, useEffect, useRef, useCallback } from 'react';

const BIOS_LINES = [
  'AyushOS BIOS v1.0.0  (C) 2025 Ayush Malik',
  'CPU: Brain @ 3.2GHz — 8 cores detected',
  'RAM: 530+ LeetCode problems — all mounted',
  'GPU: YOLOv11 Vision Module — initialized',
  'DISK: /dev/projects — 4 partitions found',
  'BOOT: Loading AyushOS from /dev/portfolio...',
];

const STATUS_MESSAGES = [
  'Initializing kernel...',
  'Mounting filesystem...',
  'Loading window manager...',
  'Starting AyushWM...',
  'Launching desktop environment...',
];

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [hidden, setHidden] = useState(false);
  const [stage, setStage] = useState<'bios' | 'loading' | 'flash' | 'done'>('bios');
  const [biosLines, setBiosLines] = useState<string[]>([]);
  const [barWidth, setBarWidth] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [flashBg, setFlashBg] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const skippedRef = useRef(false);

  const clearTimers = () => timersRef.current.forEach(clearTimeout);

  const runStage3 = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    clearTimers();

    // White flash
    setFlashBg(true);
    const t1 = setTimeout(() => {
      setFadeOut(true);
      const t2 = setTimeout(() => {
        setHidden(true);
        sessionStorage.setItem('ayush_booted', '1');
        onBootComplete();
      }, 380);
      timersRef.current.push(t2);
    }, 150);
    timersRef.current.push(t1);
  }, [onBootComplete]);

  useEffect(() => {
    // Skip if already booted this session
    if (sessionStorage.getItem('ayush_booted') === '1') {
      setHidden(true);
      onBootComplete();
      return;
    }

    // ── Stage 1: BIOS ──
    BIOS_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setBiosLines(prev => [...prev, line]);
      }, 180 * (i + 1));
      timersRef.current.push(t);
    });

    // After last BIOS line + 300ms pause, move to loading bar
    const biosEnd = 180 * BIOS_LINES.length + 300;
    const t2 = setTimeout(() => {
      setStage('loading');

      // Animate bar
      const t3 = setTimeout(() => setBarWidth(100), 50);
      timersRef.current.push(t3);

      // Cycle status messages
      let sIdx = 0;
      const statusInterval = setInterval(() => {
        sIdx = (sIdx + 1) % STATUS_MESSAGES.length;
        setStatusIdx(sIdx);
      }, 250);

      // After bar fills (1200ms) + 200ms pause → Stage 3
      const t4 = setTimeout(() => {
        clearInterval(statusInterval);
        runStage3();
      }, 1400);
      timersRef.current.push(t4);
    }, biosEnd);
    timersRef.current.push(t2);

    return () => clearTimers();
  }, [onBootComplete, runStage3]);

  // Skip on Enter key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') runStage3();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [runStage3]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: flashBg ? '#ffffff' : '#000000',
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: fadeOut ? 0 : 1,
        transition: fadeOut ? 'opacity 0.38s ease' : (flashBg ? 'background 0.15s ease' : 'none'),
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* ── Stage 1: BIOS ── */}
      {stage === 'bios' && (
        <div style={{ position: 'absolute', top: 40, left: 40 }}>
          {biosLines.map((line, i) => (
            <div
              key={i}
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: 11,
                lineHeight: '1.9',
                fontFamily: 'inherit',
                animation: 'bootFadeIn 0.2s ease forwards',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* ── Stage 2: Loading Bar ── */}
      {stage === 'loading' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{
            color: '#7F77DD',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'inherit',
            marginBottom: 16,
            letterSpacing: '0.05em',
          }}>
            AyushOS v1.0
          </div>
          {/* Loading bar */}
          <div style={{
            width: 260,
            height: 6,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${barWidth}%`,
              background: '#7F77DD',
              borderRadius: 3,
              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 10,
            fontFamily: 'inherit',
            marginTop: 12,
            minHeight: 16,
          }}>
            {STATUS_MESSAGES[statusIdx]}
          </div>
        </div>
      )}

      {/* ── Skip button ── */}
      {!fadeOut && (
        <button
          onClick={runStage3}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            color: 'rgba(255,255,255,0.25)',
            fontSize: 9,
            fontFamily: 'inherit',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          [ Press ENTER or click to skip ]
        </button>
      )}

      <style>{`
        @keyframes bootFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
