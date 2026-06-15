import { useState, useEffect } from 'react';

const COMMITS = [
  {
    hash: 'a3f8c21e',
    branch: 'main',
    isHead: true,
    labels: ['internship/parkby'],
    role: 'Software Developer Intern',
    company: 'ParkBy Technologies pvt ltd',
    date: 'Aug 2025 — Nov 2025',
    location: 'Remote',
    type: 'Internship',
    bullets: [
      'Developed a parking slot booking web application using the MERN stack, integrating AI-based safety features.',
      'Built and maintained the backend in Django, ensuring scalability and efficient data handling.',
      'Worked as a Project Manager, managed the agile working of the website on JIRA',
    ],
    tags: ['React', 'TypeScript', 'Django', 'Git', 'MySQL', 'JIRA'],
    certLink: 'https://ibb.co/SXxfK9Jm',
  },
  {
    hash: 'b7d2f19a',
    branch: 'volunteer',
    isHead: false,
    labels: ['nss/rbu-unit'],
    role: 'Joint Secretary',
    company: 'NSS RBU Unit',
    date: '2025 — 2026',
    location: 'Nagpur',
    type: 'Volunteer',
    bullets: [
      'Organized and managed a unit of 250 volunteers for the various social service initiatives, camps, and awareness drives.',
      'Effectively coordinated with student volunteers and university administration to execute community outreach programs.',
    ],
    tags: ['Leadership', 'Event Management', 'Team Coordination', 'Public Speaking'],
  },
  {
    hash: 'c4e9a33d',
    branch: 'education',
    isHead: false,
    labels: ['edu/btech'],
    role: 'B.Tech Computer Science Engineering',
    company: 'Shri Ramdeobaba College of Engineering and Management',
    date: '2023 — 2027',
    location: 'Nagpur',
    type: 'Education',
    bullets: [
      'Current CGPA: 8.20/10',
      'Focus areas: Data Science, Machine Learning, Web Development',
      'Active participation in coding competitions and hackathons',
    ],
    tags: ['DSA', 'Machine Learning', 'Web Development', 'Data Science'],
  },
  {
    hash: 'e1b5c78f',
    branch: 'education',
    isHead: false,
    labels: ['edu/hsc'],
    role: 'Higher Secondary Education',
    company: 'Sarosh Jr College',
    date: '2021 — 2023',
    location: 'Nagpur',
    type: 'Education',
    bullets: [
      'Percentage: 81%',
    ],
    tags: ['Science', 'Mathematics'],
  },
];

const TAG_COLORS = [
  'var(--teal)', 'var(--blue)', 'var(--amber)', 'var(--purple)',
  'var(--coral)', 'var(--pink)', 'var(--purple-light)',
];

export default function ExperienceWindow() {
  const [visibleCommits, setVisibleCommits] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set(COMMITS.map((_, i) => i)));

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    COMMITS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCommits(i + 1), 300 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const toggleExpand = (idx: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="gitlog">
      <div className="gitlog-header">$ git log --experience --oneline --graph</div>

      {COMMITS.slice(0, visibleCommits).map((commit, i) => {
        const isExpanded = expanded.has(i);
        return (
          <div
            key={i}
            className="gitlog-commit stagger-in"
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={() => toggleExpand(i)}
          >
            <div className="gitlog-hash-line">
              <span className="gitlog-graph">* </span>
              <span className="gitlog-commit-word">commit </span>
              <span className="gitlog-hash">{commit.hash}</span>
              <span className="gitlog-branch">
                &nbsp;&nbsp;({commit.isHead ? 'HEAD → ' : ''}{commit.labels.join(', ')})
              </span>
            </div>

            <div style={{ paddingLeft: 16 }}>
              <div className="gitlog-author">
                <span className="gitlog-graph">│ </span>
                Author: Ayush Malik &lt;ayushmalik852@gmail.com&gt;
              </div>
              <div className="gitlog-date">
                <span className="gitlog-graph">│ </span>
                Date:&nbsp;&nbsp; {commit.date} · {commit.location} · {commit.type}
              </div>
              <div><span className="gitlog-graph">│</span></div>
              <div>
                <span className="gitlog-graph">│ </span>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="gitlog-feat">feat: </span>
                {commit.role} @ {commit.company}
              </div>

              {isExpanded && (
                <>
                  <div><span className="gitlog-graph">│</span></div>
                  {commit.bullets.map((bullet, j) => (
                    <div key={j} className="gitlog-bullet">
                      <span className="gitlog-graph">│ </span>
                      &nbsp;&nbsp;&nbsp;&nbsp;- {bullet}
                    </div>
                  ))}
                  <div><span className="gitlog-graph">│</span></div>
                  <div style={{ paddingLeft: 0 }}>
                    <span className="gitlog-graph">│ </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;Tags:
                    <span className="gitlog-tags" style={{ display: 'inline-flex', marginLeft: 8 }}>
                      {commit.tags.map((tag, k) => (
                        <span
                          key={k}
                          className="gitlog-tag"
                          style={{ borderColor: TAG_COLORS[k % TAG_COLORS.length], color: TAG_COLORS[k % TAG_COLORS.length] }}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </div>
                  {commit.certLink && (
                    <div style={{ paddingLeft: 24, marginTop: 4 }}>
                      <span className="gitlog-graph">│ </span>
                      <a
                        href={commit.certLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--teal)', textDecoration: 'underline', fontSize: 9 }}
                        onClick={e => e.stopPropagation()}
                      >
                        📎 View Certificate
                      </a>
                    </div>
                  )}
                </>
              )}

              <div><span className="gitlog-graph">│</span></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
