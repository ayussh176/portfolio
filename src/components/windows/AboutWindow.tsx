import { useState, useEffect, useRef } from 'react';

const FILE_LINES = [
  { type: 'comment', text: '# =============================================' },
  { type: 'comment', text: '# Ayush Malik — Personal Profile' },
  { type: 'comment', text: '# =============================================' },
  { type: 'blank' },
  { type: 'quote', key: 'quote', value: '"I believe in continuous learning and staying updated with the latest technologies."' },
  { type: 'blank' },
  { type: 'kv', key: 'degree', value: 'B.Tech CSE @ RCOEM Nagpur (2023-2027), CGPA: 8.20' },
  { type: 'kv', key: 'hsc', value: 'Sarosh Jr College (2021-2023), 81%' },
  { type: 'kv', key: 'intern', value: 'Software Developer Intern @ ParkBy Technologies' },
  { type: 'kv', key: 'goal', value: 'Build scalable, innovative solutions through code' },
  { type: 'kv', key: 'target', value: 'Software Engineering roles at product companies' },
  { type: 'kv', key: 'motto', value: 'Continuous learning and exploration' },
  { type: 'blank' },
  { type: 'comment', text: '# --- Traits ---' },
  { type: 'kv', key: 'trait_1', value: 'Problem Solver — tackling complex problems efficiently' },
  { type: 'kv', key: 'trait_2', value: 'Continuous Learner — always exploring new tech' },
  { type: 'blank' },
  { type: 'comment', text: '# --- Interests ---' },
  { type: 'kv', key: 'interests', value: 'Open Source, Exploring New Stuff, Hackathons, Photography' },
  { type: 'blank' },
  { type: 'comment', text: '# --- Journey ---' },
  { type: 'kv', key: 'bio_1', value: 'Passionate CSE student with strong CS foundations' },
  { type: 'kv', key: 'bio_2', value: 'Interested in web dev, AI, and scalable apps' },
];

const STATS = [
  { value: 530, label: 'LeetCode Problems', suffix: '+', color: 'var(--teal)' },
  { value: 7, label: 'Projects Built', suffix: '', color: 'var(--blue)' },
  { value: 1, label: 'Internship', suffix: '', color: 'var(--coral)' },
  { value: 3, label: 'Coding Platforms', suffix: '', color: 'var(--amber)' },
  { value: 22, label: 'Contests', suffix: '', color: 'var(--purple)' },
  { value: 8.2, label: 'CGPA / 10', suffix: '', color: 'var(--pink)' },
];

export default function AboutWindow() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [counters, setCounters] = useState<number[]>(STATS.map(() => 0));
  const animated = useRef(false);

  // Stagger lines
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    FILE_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 50 * i));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Count-up animation
  useEffect(() => {
    if (animated.current) return;
    animated.current = true;

    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      setCounters(STATS.map(s => {
        const val = s.value * eased;
        return Number.isInteger(s.value) ? Math.floor(val) : Math.round(val * 10) / 10;
      }));

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <div>
      {/* Nano top bar */}
      <div className="nano-topbar">GNU nano 6.0&nbsp;&nbsp;&nbsp;about_me.txt</div>

      {/* File content */}
      <div className="nano-content">
        {FILE_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`nano-line stagger-in ${line.type === 'quote' ? 'nano-quote-line' : ''}`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <span className="nano-line-number">{i + 1}</span>
            <span className="nano-line-content">
              {line.type === 'comment' && <span className="nano-comment">{line.text}</span>}
              {line.type === 'blank' && <span>&nbsp;</span>}
              {line.type === 'quote' && (
                <>
                  <span className="nano-key">{line.key}</span>
                  <span className="nano-equals">&nbsp; = &nbsp;</span>
                  <span className="nano-value" style={{ color: 'var(--purple-light)' }}>{line.value}</span>
                </>
              )}
              {line.type === 'kv' && (
                <>
                  <span className="nano-key">{line.key}</span>
                  <span className="nano-equals">&nbsp; = &nbsp;</span>
                  <span className="nano-value">{line.value}</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-number" style={{ color: stat.color }}>
              {counters[i]}{stat.suffix}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Nano shortcut bar */}
      <div className="nano-shortcutbar">
        <span><span className="nano-shortcut-key">^G</span> Help</span>
        <span><span className="nano-shortcut-key">^X</span> Exit</span>
        <span><span className="nano-shortcut-key">^O</span> Write Out</span>
        <span><span className="nano-shortcut-key">^W</span> Where Is</span>
        <span><span className="nano-shortcut-key">^K</span> Cut</span>
        <span><span className="nano-shortcut-key">^U</span> Paste</span>
      </div>
    </div>
  );
}
