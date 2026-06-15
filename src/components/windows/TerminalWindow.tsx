import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from '../os/WindowManager';
import { useOSMenu } from '../os/OSMenuSystem';

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_COMMANDS = [
  'whoami','ls','cat','skills','git','leetcode','neofetch','hire','help','clear',
  'pwd','echo','date','uptime','projects','contact','about','experience',
  'antigravity','matrix','analytics','sudo','recruiter',
];

const STARTUP_LINES = [
  { html: '<span style="color:#7F77DD;font-weight:600">AyushOS Terminal v1.0</span>', delay: 0 },
  { html: "Type <span style='color:#5DCAA5'>help</span> for all commands. Tab to autocomplete.", delay: 80 },
  { html: '<span style="color:#30363d">─────────────────────────────────────</span>', delay: 160 },
  { html: "<span style='color:#6e7681'>Last login: " + new Date().toDateString() + " from recruiter@company.com</span>", delay: 240 },
  { html: '', delay: 320 },
];

const SKILL_BARS = [
  { name: 'Python    ', pct: 90 },
  { name: 'React     ', pct: 82 },
  { name: 'AI/ML     ', pct: 78 },
  { name: 'Flask     ', pct: 80 },
  { name: 'TypeScript', pct: 75 },
];

function makeBar(pct: number): string {
  const filled = Math.round(pct / 10);
  return '█'.repeat(filled) + '░'.repeat(10 - filled) + `  ${pct}%`;
}

function hl(text: string, color: string) {
  return `<span style="color:${color}">${text}</span>`;
}

const projectReadmes: Record<string, string> = {
  'attendx': `${hl('# AttendX — Hybrid AI Attendance System', '#7F77DD')}
Stack    :  YOLOv11 · DeepFace · ArcFace · Flask · React · Firebase
Feature  :  Randomized multi-check proxy prevention
           System re-verifies students at unpredictable intervals
           to prevent photo/video spoofing attacks.
Status   :  ${hl('✓ Production ready', '#5DCAA5')}`,
  'patientkhata': `${hl('# PatientKhata — Healthcare Records Platform', '#5DCAA5')}
Stack    :  TypeScript · Firebase · Firestore · React
Feature  :  Role-based access: Doctor / Patient / Admin
Status   :  ${hl('✓ Production ready', '#5DCAA5')}`,
  'kissankhata': `${hl('# KissanKhata — Agri-Business Management', '#FAC775')}
Stack    :  React · TypeScript · Node.js · Firestore
Feature  :  Multi-tenant inventory + order tracking
Status   :  ${hl('✓ Production ready', '#5DCAA5')}`,
  'housepricepredictor': `${hl('# House Price Predictor — ML Web App', '#F0997B')}
Stack    :  Flask · Pandas · scikit-learn · Python
Model    :  Linear Regression with feature engineering
Status   :  ${hl('✓ Production ready', '#5DCAA5')}`,
};

const windowOpenCounts: Record<string, number> = {};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TerminalWindow() {
  const { openWindow, triggerRecruiterMode } = useWindowManager();
  const { runAntigravity, runMatrixRain } = useOSMenu();
  const [lines, setLines] = useState<Array<{ html: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Startup animation ──
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STARTUP_LINES.forEach(({ html, delay }) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { html }]);
      }, delay);
      timers.push(t);
    });
    const t = setTimeout(() => {
      setReady(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 350);
    timers.push(t);
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const append = useCallback((htmlArr: string[]) => {
    setLines(prev => [...prev, ...htmlArr.map(html => ({ html }))]);
  }, []);

  const openWin = useCallback((id: string) => {
    openWindow(id);
    windowOpenCounts[id] = (windowOpenCounts[id] ?? 0) + 1;
  }, [openWindow]);

  // ── Tab autocomplete ──
  const autocomplete = useCallback((partial: string) => {
    if (!partial) return;
    const match = ALL_COMMANDS.find(cmd => cmd.startsWith(partial));
    if (match) setInputValue(match);
  }, []);

  // ── Command executor ──
  const executeCommand = useCallback((rawCmd: string) => {
    const cmd = rawCmd.trim();
    const lower = cmd.toLowerCase();
    const prompt = `<span style="color:#7F77DD">ayush@portfolio ~ $</span> <span style="color:#e6edf3">${cmd}</span>`;

    if (!cmd) { append([prompt, '']); return; }
    if (lower === 'clear') { setLines([]); return; }

    const out: string[] = [prompt];

    if (lower === 'whoami') {
      out.push(hl('Ayush Malik', '#7F77DD') + ' — B.Tech CSE @ RCOEM Nagpur (2023–2027)');
      out.push('AI/ML Engineer · Full-Stack Developer · Competitive Programmer');
      out.push('530+ LeetCode · YOLOv11 · React · Flask · Firebase');
    }
    else if (lower === 'ls' || lower === 'ls projects/') {
      out.push(
        [hl('AttendX/', '#7F77DD'), hl('PatientKhata/', '#5DCAA5'),
         hl('KissanKhata/', '#FAC775'), hl('HousePricePredictor/', '#F0997B')].join('    ')
      );
    }
    else if (lower.startsWith('cat projects/')) {
      const slug = lower.replace('cat projects/', '').replace('/readme.md', '').replace('/', '').trim();
      const readme = projectReadmes[slug];
      if (readme) out.push(readme);
      else out.push(hl('cat: No such file or directory', '#F0997B'));
    }
    else if (lower === 'skills' || lower === 'skills --list') {
      out.push(hl('[languages]', '#7F77DD') + '   Python · Java · TypeScript · JavaScript · C++ · SQL');
      out.push(hl('[frameworks]', '#5DCAA5') + '  React · Flask · Node.js · scikit-learn · Pandas · NumPy');
      out.push(hl('[ai_ml]', '#FAC775') + '      YOLOv11 · DeepFace · ArcFace · OpenCV · Computer Vision');
      out.push(hl('[databases]', '#85B7EB') + '   Firebase · Firestore · MySQL');
      out.push(hl('[tools]', '#AFA9EC') + '      Git · GitHub · Postman · VS Code');
    }
    else if (lower === 'skills --top' || lower === 'skills --graph') {
      SKILL_BARS.forEach(({ name, pct }) => {
        out.push(`${hl(name, '#e6edf3')}  ${hl(makeBar(pct), '#7F77DD')}`);
      });
    }
    else if (lower === 'git log --experience' || lower === 'experience') {
      out.push(hl('commit a3f9e2b', '#FAC775') + '  ' + hl('[HEAD → internship]', '#5DCAA5'));
      out.push('    ParkBy — Software Development Intern (2024)');
      out.push('    Built production features · Integrated REST APIs');
      out.push('');
      out.push(hl('commit 8c12d4a', '#FAC775') + '  ' + hl('[college/final-year]', '#5DCAA5'));
      out.push('    RCOEM Nagpur — B.Tech CSE (2023–2027)');
      out.push('    AI/ML specialization · Led AttendX + KissanKhata');
      out.push('');
      out.push(hl('commit 1d7a3c0', '#FAC775') + '  ' + hl('[personal/projects]', '#5DCAA5'));
      out.push('    Self-initiated — Solo Developer (2022–present)');
      out.push('    4 end-to-end systems shipped');
    }
    else if (lower === 'leetcode --stats' || lower === 'leetcode') {
      out.push('Platform        Problems   Easy    Medium   Hard');
      out.push(hl('─────────────────────────────────────────────', '#30363d'));
      out.push(`${hl('LeetCode', '#FAC775')}        530+       ~210    ~245     ~70`);
      out.push(`${hl('GeeksForGeeks', '#5DCAA5')}   300+       Institute rank: Top 5%`);
      out.push(`${hl('Codeforces', '#AFA9EC')}      Pupil      12+ contests participated`);
    }
    else if (lower === 'neofetch') {
      out.push(
        `<pre style="font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.5;margin:0">        AK              ${hl('AyushOS v1.0', '#7F77DD;font-weight:700')}
       /  \\             ${hl('─────────────────────', '#30363d')}
      / AK \\            ${hl('OS:', '#5DCAA5')} AyushOS Linux x86_64
     /______\\           ${hl('Host:', '#5DCAA5')} Portfolio Website
                        ${hl('Kernel:', '#5DCAA5')} vanilla-js 5.0.0
  ┌──────────┐          ${hl('Shell:', '#5DCAA5')} bash 5.1.0
  │ AyushOS  │          ${hl('WM:', '#5DCAA5')} AyushWM (custom)
  └──────────┘          ${hl('CPU:', '#5DCAA5')} Brain @ 3.2GHz
                        ${hl('Memory:', '#5DCAA5')} 530+ LeetCode
                        ${hl('Uptime:', '#5DCAA5')} Since RCOEM 2023</pre>`
      );
    }
    else if (lower === 'pwd') { out.push('/home/ayush/portfolio'); }
    else if (lower === 'date') {
      out.push(new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit',
        month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      }) + ' IST');
    }
    else if (lower === 'uptime') { out.push('up 4 years 2 months — since RCOEM admission 2023'); }
    else if (lower === 'echo $user') { out.push('ayush'); }
    else if (lower === 'echo $stack') {
      out.push([hl('Python','#3572A5'), hl('React','#61DAFB'), hl('Flask','#FAC775'),
                hl('Firebase','#F0997B'), hl('TypeScript','#85B7EB'), hl('ML','#5DCAA5')].join('  '));
    }
    else if (lower.startsWith('echo ')) { out.push(cmd.slice(5)); }
    else if (lower === 'hire' || lower === 'contact') {
      out.push(hl('[OK] Opening contact.sh...', '#5DCAA5'));
      setTimeout(() => openWin('contact.sh'), 600);
    }
    else if (lower === 'about') {
      out.push(hl('[OK] Opening about_me...', '#5DCAA5'));
      setTimeout(() => openWin('about_me'), 400);
    }
    else if (lower === 'projects') {
      out.push(hl('[OK] Opening projects/...', '#5DCAA5'));
      setTimeout(() => openWin('projects'), 400);
    }
    else if (lower === 'recruiter') {
      out.push('');
      out.push(`${hl('Candidate Score:', '#5DCAA5')} 92/100`);
      out.push('');
      out.push(hl('Recommended Action:', '#FAC775'));
      out.push(`  ${hl('✓', '#5DCAA5')} Review Projects`);
      out.push(`  ${hl('✓', '#5DCAA5')} Download Resume`);
      out.push(`  ${hl('✓', '#5DCAA5')} Schedule Interview`);
      out.push('');
      out.push(hl('[OK] Activating Recruiter Mode...', '#5DCAA5'));
      setTimeout(() => {
        triggerRecruiterMode();
      }, 800);
    }
    else if (lower === 'help') {
      const rows = [
        ['whoami',                       'Personal profile + stack'],
        ['ls',                           'List files and projects'],
        ['cat projects/[name]/README.md','View project details'],
        ['skills [--list|--graph]',      'Skills by category or proficiency bars'],
        ['experience',                   'git-log style work history'],
        ['leetcode --stats',             'Competitive programming stats'],
        ['neofetch',                     'System info block'],
        ['pwd',                          'Current directory'],
        ['date',                         'Current date & time (IST)'],
        ['uptime',                       'Time since OS started'],
        ['echo $USER / $STACK',          'Print env variables'],
        ['hire / contact',               'Open contact.sh'],
        ['about',                        'Open about_me'],
        ['projects',                     'Open projects/'],
        ['recruiter',                    '💼 Activate hidden Recruiter Mode'],
        ['clear',                        'Clear terminal output'],
        ['antigravity',                  '🚀 Disable gravity protocol'],
        ['matrix',                       '🌈 Initiate matrix rain'],
        ['analytics',                    'Session window open stats'],
        ['sudo hire',                    'Escalate hire request to root'],
      ];
      out.push(hl('Available Commands:', '#7F77DD'));
      rows.forEach(([c, d]) => {
        out.push(`  ${hl(c.padEnd(36), '#5DCAA5')}${hl(d, '#6e7681')}`);
      });
    }
    else if (lower === 'antigravity') {
      out.push(hl('[OK] Disabling gravity protocol...', '#F0997B'));
      setTimeout(() => runAntigravity(), 400);
    }
    else if (lower === 'matrix') {
      out.push(hl('[OK] Initiating matrix rain...', '#FAC775'));
      setTimeout(() => runMatrixRain(), 400);
    }
    else if (lower === 'analytics') {
      out.push(hl('Session Window Analytics:', '#7F77DD'));
      const ids = ['intro.sh','about_me','skills.cfg','experience','projects','cp_stats','contact.sh','terminal.sh'];
      ids.forEach(id => {
        const count = windowOpenCounts[id] ?? 0;
        out.push(`  ${id.padEnd(16)}${hl(String(count), count > 0 ? '#5DCAA5' : '#6e7681')} opens`);
      });
    }
    else if (lower === 'sudo rm -rf /' || lower === 'sudo rm -rf /*') {
      out.push(hl('Permission denied: nice try. This OS is protected by AyushShield™', '#F0997B'));
    }
    else if (lower === 'sudo hire') {
      out.push(hl('[SUDO] Password: ', '#FAC775') + '••••••••');
      setTimeout(() => {
        setLines(prev => [...prev, { html: hl('[OK] Hire request escalated to root. Check contact.sh.', '#5DCAA5') }]);
        setTimeout(() => openWin('contact.sh'), 300);
      }, 600);
    }
    else {
      out.push(hl(`bash: command not found: ${cmd}. Type 'help' for available commands.`, '#F0997B'));
    }

    out.push('');
    append(out);
  }, [append, openWin, runAntigravity, runMatrixRain]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      if (cmd) setCmdHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
      executeCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, cmdHistory.length - 1);
      setHistoryIndex(newIdx);
      if (cmdHistory.length > 0) setInputValue(cmdHistory[cmdHistory.length - 1 - newIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInputValue(cmdHistory[cmdHistory.length - 1 - newIdx] ?? '');
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autocomplete(inputValue);
    }
  };

  return (
    <div
      className="terminal"
      ref={containerRef}
      onClick={() => ready && inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
          style={{ minHeight: 16, lineHeight: '1.7', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}
        />
      ))}
      {ready && (
        <div className="terminal-input-line">
          <span className="terminal-prompt">ayush@portfolio ~ $&nbsp;</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {!inputValue && <span className="terminal-cursor" />}
        </div>
      )}
    </div>
  );
}
