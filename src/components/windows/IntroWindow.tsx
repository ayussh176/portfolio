import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from '../os/WindowManager';

const PROFILE_LINES = [
  { type: 'prompt', text: 'ayush@portfolio ~ $ cat /etc/profile' },
  { type: 'blank' },
  { type: 'kv', key: 'name',     value: 'Ayush Malik' },
  { type: 'kv', key: 'college',  value: 'Shri Ramdeobaba College of Engineering and Management (B.Tech CSE, 2023–2027)' },
  { type: 'kv', key: 'focus',    value: 'Data Science · Machine Learning · Web Development' },
  { type: 'kv-status', key: 'status', value: 'Open to opportunities' },
  { type: 'kv', key: 'location', value: 'Nagpur, India' },
  { type: 'blank' },
  { type: 'prompt', text: 'ayush@portfolio ~ $ echo $STACK' },
  { type: 'blank' },
  { type: 'output', text: 'Python · Java · C · SQL · React · JavaScript · ExpressJS · Machine Learning · Data Science · Git · Firebase' },
  { type: 'blank' },
];

export default function IntroWindow() {
  const { openWindow } = useWindowManager();
  const [lines, setLines] = useState<Array<{ type: string; html: string }>>([]);
  const [typingDone, setTypingDone] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter animation
  useEffect(() => {
    let charIdx = 0;
    const revealed: Array<{ type: string; html: string }> = [];

    PROFILE_LINES.forEach((line, lineIdx) => {
      const delay = charIdx * 18;
      setTimeout(() => {
        let html = '';
        if (line.type === 'prompt') {
          html = `<span class="terminal-prompt">${line.text}</span>`;
        } else if (line.type === 'blank') {
          html = '&nbsp;';
        } else if (line.type === 'kv') {
          html = `<span class="terminal-key">${(line as { key: string }).key}</span><span class="terminal-arrow">→</span><span class="terminal-value">${(line as { value: string }).value}</span>`;
        } else if (line.type === 'kv-status') {
          html = `<span class="terminal-key">${(line as { key: string }).key}</span><span class="terminal-arrow">→</span><span class="terminal-status-dot"></span><span style="color:var(--teal)">${(line as { value: string }).value}</span>`;
        } else if (line.type === 'output') {
          html = `<span class="terminal-value">${line.text}</span>`;
        }
        revealed.push({ type: line.type, html });
        setLines([...revealed]);
        if (lineIdx === PROFILE_LINES.length - 1) {
          setTimeout(() => setTypingDone(true), 300);
        }
      }, delay);

      if (line.type === 'blank') charIdx += 1;
      else charIdx += ((line as { text?: string }).text?.length || ((line as { key?: string }).key?.length || 0) + ((line as { value?: string }).value?.length || 0) + 10);
    });
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = () => {
    if (inputRef.current && typingDone) inputRef.current.focus();
  };

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Array<{ type: string; html: string }> = [];

    newLines.push({ type: 'prompt', html: `<span class="terminal-prompt">ayush@portfolio ~ $</span> <span class="terminal-command">${cmd.trim()}</span>` });

    if (trimmed === 'whoami') {
      newLines.push({ type: 'output', html: 'Aspiring Software Developer & Problem Solver. B.Tech CSE student passionate about building innovative solutions through code.' });
    } else if (trimmed === 'ls') {
      newLines.push({ type: 'output', html: '<span style="color:var(--teal)">intro.sh</span>  <span style="color:var(--purple)">about_me</span>  <span style="color:var(--teal)">skills.cfg</span>  <span style="color:var(--coral)">experience</span>  <span style="color:var(--blue)">projects/</span>  <span style="color:var(--amber)">cp_stats</span>  <span style="color:var(--pink)">contact.sh</span>' });
    } else if (trimmed === 'hire') {
      newLines.push({ type: 'output', html: '<span style="color:var(--teal)">[OK] Smart choice. Opening contact.sh...</span>' });
      setTimeout(() => openWindow('contact.sh'), 600);
    } else if (trimmed === 'neofetch') {
      newLines.push({ type: 'output', html: `<pre style="color:var(--teal);font-size:10px;line-height:1.4">  ayush@ayushos
  ─────────────
  OS:      AyushOS v1.0
  Host:    RCOEM-Nagpur
  Kernel:  6.1.0-malik
  Shell:   bash 5.2.0
  CPU:     Human Brain (8 cores)
  Memory:  ∞ / Ambition
  CGPA:    8.20 / 10
  LeetCode: 530+ solved
  Uptime:  4 years (B.Tech)</pre>` });
    } else if (trimmed === 'sudo make me_a_developer') {
      newLines.push({ type: 'output', html: '<span style="color:var(--coral)">Permission denied. Already a developer.</span>' });
    } else if (trimmed === 'clear') {
      setLines([]);
      return;
    } else if (trimmed === 'help') {
      newLines.push({ type: 'output', html: 'Available: <span style="color:var(--teal)">ls</span> · <span style="color:var(--teal)">whoami</span> · <span style="color:var(--teal)">hire</span> · <span style="color:var(--teal)">neofetch</span> · <span style="color:var(--teal)">clear</span> — For full terminal, open <span style="color:var(--amber)">terminal.sh</span>' });
    } else if (trimmed === '') {
      return;
    } else {
      newLines.push({ type: 'output', html: `<span style="color:var(--coral)">command not found: ${cmd.trim()}. Try: ls, whoami, hire, neofetch — or open <span style="color:var(--amber)">terminal.sh</span> for full shell</span>` });
    }

    setLines(prev => [...prev, ...newLines]);
    setHistory(prev => [cmd.trim(), ...prev]);
    setHistoryIdx(-1);
  }, [openWindow]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = Math.min(historyIdx + 1, history.length - 1);
        setHistoryIdx(newIdx);
        setInputValue(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInputValue(history[newIdx]);
      } else {
        setHistoryIdx(-1);
        setInputValue('');
      }
    }
  };

  return (
    <div className="terminal" ref={containerRef} onClick={focusInput}>
      {lines.map((line, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: line.html }} style={{ minHeight: '16px' }} />
      ))}
      {typingDone && (
        <div className="terminal-input-line">
          <span className="terminal-prompt">ayush@portfolio ~ $&nbsp;</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
          />
          {!inputValue && <span className="terminal-cursor" />}
        </div>
      )}
    </div>
  );
}
