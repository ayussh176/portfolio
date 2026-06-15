import { useState, useEffect, useRef } from 'react';

const CONFIG_LINES = [
  { type: 'comment', text: '# =============================================' },
  { type: 'comment', text: '# AyushOS Skills Configuration v1.0' },
  { type: 'comment', text: `# Last updated: ${new Date().getFullYear()}` },
  { type: 'comment', text: '# =============================================' },
  { type: 'blank' },
  { type: 'section', text: '[[programming_languages]]' },
  { type: 'kv', key: 'languages', value: 'Python, Java, C, SQL' },
  { type: 'blank' },
  { type: 'section', text: '[[web_technologies]]' },
  { type: 'kv', key: 'frontend', value: 'React, HTML/CSS, JavaScript' },
  { type: 'kv', key: 'backend', value: 'ExpressJS, Flask, Django' },
  { type: 'kv', key: 'database', value: 'Firebase, MySQL' },
  { type: 'blank' },
  { type: 'section', text: '[[tools_and_platforms]]' },
  { type: 'kv', key: 'vcs', value: 'Git, GitHub' },
  { type: 'kv', key: 'methodology', value: 'Agile, JIRA' },
  { type: 'kv', key: 'os', value: 'Linux' },
  { type: 'blank' },
  { type: 'section', text: '[[data_science_and_ai]]' },
  { type: 'kv', key: 'domains', value: 'Data Science, Machine Learning, Deep Learning' },
  { type: 'blank' },
  { type: 'section', text: '[[soft_skills]]' },
  { type: 'kv', key: 'skills', value: 'Problem Solving, Data Structures, Algorithms, Leadership, Communication' },
  { type: 'blank' },
  { type: 'comment', text: '# "I believe in continuous learning and staying updated with the latest technologies."' },
];

const PROFICIENCY = [
  { name: 'Java', level: 85, color: 'var(--amber)' },
  { name: 'React', level: 85, color: 'var(--teal)' },
  { name: 'SQL', level: 80, color: 'var(--coral)' },
  { name: 'HTML/CSS', level: 80, color: 'var(--purple)' },
  { name: 'C', level: 80, color: 'var(--purple-light)' },
  { name: 'Python', level: 75, color: 'var(--blue)' },
  { name: 'ExpressJS', level: 75, color: 'var(--blue)' },
  { name: 'JavaScript', level: 75, color: 'var(--amber)' },
];

export default function SkillsWindow() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const barsRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CONFIG_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 30 * i));
    });
    // Animate bars after config lines done
    timers.push(setTimeout(() => {
      if (!barsRef.current) {
        barsRef.current = true;
        setBarsAnimated(true);
      }
    }, 30 * CONFIG_LINES.length + 200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div>
      {/* Config file */}
      <div className="config-file">
        {CONFIG_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="config-line stagger-in"
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <span className="config-line-number">{i + 1}</span>
            <span className="config-line-content">
              {line.type === 'comment' && <span className="config-comment">{line.text}</span>}
              {line.type === 'blank' && <span>&nbsp;</span>}
              {line.type === 'section' && <span className="config-section">{line.text}</span>}
              {line.type === 'kv' && (
                <>
                  <span className="config-key">{(line as { key: string }).key}</span>
                  <span className="config-comment">&nbsp; = &nbsp;</span>
                  <span className="config-value">{(line as { value: string }).value}</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Proficiency bars */}
      <div className="proficiency-section">
        <div style={{ color: 'var(--muted)', fontSize: 10, marginBottom: 12 }}>
          # proficiency_levels
        </div>
        {PROFICIENCY.map((skill, i) => (
          <div key={i} className="proficiency-bar">
            <div className="proficiency-header">
              <span className="proficiency-label">{skill.name}</span>
              <span className="proficiency-percent">{skill.level}%</span>
            </div>
            <div className="proficiency-track">
              <div
                className="proficiency-fill"
                style={{
                  backgroundColor: skill.color,
                  width: barsAnimated ? `${skill.level}%` : '0%',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
