import { useState, useEffect, useRef } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';

const INITIAL_PLATFORMS = [
  {
    name: 'LeetCode',
    link: 'https://leetcode.com/u/ayush_176/',
    mainStat: 530,
    mainLabel: 'Problems Solved',
    suffix: '+',
    color: 'var(--amber)',
    substats: ['Easy: 210+', 'Medium: 285+', 'Hard: 30+'],
  },
  {
    name: 'CodeChef',
    link: 'https://www.codechef.com/users/ayush_176',
    mainStat: 1497,
    mainLabel: 'Rating',
    suffix: '',
    color: 'var(--teal)',
    substats: ['2 Stars', '22 Contests'],
  },
  {
    name: 'HackerRank',
    link: 'https://www.hackerrank.com/profile/ayushmalik852',
    mainStat: 4,
    mainLabel: 'Badges',
    suffix: '',
    color: 'var(--purple)',
    substats: ['Level: Silver'],
  },
];

const DSA_TOPICS = [
  'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue',
  'Trees', 'Graphs', 'Dynamic Programming', 'Greedy',
  'Binary Search', 'Two Pointers', 'Sliding Window',
  'Recursion', 'Backtracking', 'Hashing', 'Sorting', 'Math', 'Heap'
];

const INITIAL_DIFFICULTY = [
  { label: 'Easy', count: 210, max: 530, color: 'var(--teal)' },
  { label: 'Medium', count: 285, max: 530, color: 'var(--amber)' },
  { label: 'Hard', count: 30, max: 530, color: 'var(--coral)' },
];

export default function CpStatsWindow() {
  const [platformsData, setPlatformsData] = useState(INITIAL_PLATFORMS);
  const [difficultyData, setDifficultyData] = useState(INITIAL_DIFFICULTY);
  const [counters, setCounters] = useState<number[]>(INITIAL_PLATFORMS.map(() => 0));
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [calendarData, setCalendarData] = useState<{date: string, count: number, level: number}[]>([]);
  const animated = useRef(false);

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        const [solvedRes, calendarRes] = await Promise.all([
          fetch('https://alfa-leetcode-api.onrender.com/ayush_176/solved'),
          fetch('https://alfa-leetcode-api.onrender.com/ayush_176/calendar')
        ]);
        
        const solved = await solvedRes.json();
        const calendar = await calendarRes.json();
        
        if (solved && solved.solvedProblem) {
          setPlatformsData(prev => {
            const next = [...prev];
            next[0] = {
              ...next[0],
              mainStat: solved.solvedProblem,
              suffix: '',
              substats: [`Easy: ${solved.easySolved}`, `Medium: ${solved.mediumSolved}`, `Hard: ${solved.hardSolved}`]
            };
            return next;
          });
          
          setDifficultyData([
            { label: 'Easy', count: solved.easySolved, max: solved.solvedProblem, color: 'var(--teal)' },
            { label: 'Medium', count: solved.mediumSolved, max: solved.solvedProblem, color: 'var(--amber)' },
            { label: 'Hard', count: solved.hardSolved, max: solved.solvedProblem, color: 'var(--coral)' },
          ]);
        }
        
        if (calendar && calendar.submissionCalendar) {
          const calObj = JSON.parse(calendar.submissionCalendar);
          const dataMap = new Map();
          
          for (const [timestamp, count] of Object.entries(calObj)) {
            const dateStr = new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0];
            const numCount = count as number;
            
            let level = 0;
            if (numCount > 0) level = 1;
            if (numCount >= 3) level = 2;
            if (numCount >= 6) level = 3;
            if (numCount >= 10) level = 4;
            
            if (dataMap.has(dateStr)) {
              const existing = dataMap.get(dateStr);
              existing.count += numCount;
              existing.level = Math.max(existing.level, level);
            } else {
              dataMap.set(dateStr, { date: dateStr, count: numCount, level });
            }
          }
          
          const sortedData = Array.from(dataMap.values()).sort((a: any, b: any) => a.date.localeCompare(b.date));
          setCalendarData(sortedData);
        }
      } catch (err) {
        console.error("Failed to fetch LeetCode data", err);
      }
    };
    
    fetchLeetCodeData();
  }, []);

  useEffect(() => {
    if (animated.current) {
      // Just update counters if already animated
      setCounters(platformsData.map(p => p.mainStat));
      return;
    }
    animated.current = true;

    const duration = 1500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters(platformsData.map(p => Math.floor(p.mainStat * eased)));

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Animate bars
    setTimeout(() => setBarsAnimated(true), 400);
  }, [platformsData]);

  return (
    <div className="sysmon">
      {/* Platform Cards */}
      <div className="sysmon-cards">
        {platformsData.map((platform, i) => (
          <a
            key={platform.name}
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            className="sysmon-card"
            style={{ borderColor: platform.color, textDecoration: 'none', color: 'inherit' }}
          >
            <div className="sysmon-card-name">{platform.name}</div>
            <div className="sysmon-card-number" style={{ color: platform.color }}>
              {counters[i]}{platform.suffix}
            </div>
            <div className="sysmon-card-substats">
              {platform.substats.map((s, j) => (
                <div key={j}>{s}</div>
              ))}
            </div>
          </a>
        ))}
      </div>

      {/* Difficulty Bars */}
      <div className="difficulty-bars">
        <div style={{ color: 'var(--muted)', fontSize: 9, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          LeetCode Breakdown
        </div>
        {difficultyData.map((d, i) => (
          <div key={i} className="difficulty-bar">
            <span className="difficulty-label">{d.label}</span>
            <div className="difficulty-track">
              <div
                className="difficulty-fill"
                style={{
                  backgroundColor: d.color,
                  width: barsAnimated ? `${(d.count / d.max) * 100}%` : '0%',
                }}
              />
            </div>
            <span className="difficulty-count">{d.count}</span>
          </div>
        ))}
      </div>

      {/* DSA Topics */}
      <div className="dsa-topics">
        <div className="dsa-topics-header"># mastered_topics</div>
        <div className="dsa-pills">
          {DSA_TOPICS.map(topic => (
            <span key={topic} className="dsa-pill">{topic}</span>
          ))}
        </div>
      </div>

      {/* Activity Grid */}
      <div className="activity-grid-container" style={{ marginTop: 24 }}>
        <div className="activity-grid-label" style={{ marginBottom: 12 }}># leetcode_heatmap — last year</div>
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          {calendarData.length > 0 ? (
            <ActivityCalendar 
              data={calendarData} 
              theme={{
                light: ['#1c2128', '#1a3a2a', '#2d6a4f', '#40916c', '#5DCAA5'],
                dark: ['#1c2128', '#1a3a2a', '#2d6a4f', '#40916c', '#5DCAA5'],
              }}
              colorScheme="dark"
              blockSize={10}
              blockRadius={2}
              blockMargin={4}
              fontSize={10}
              hideMonthLabels={false}
              hideColorLegend={false}
            />
          ) : (
            <div style={{ height: 100, display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: 11 }}>
              [INFO] Fetching real-time LeetCode calendar data...
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div style={{
        marginTop: 16,
        padding: '12px 0',
        borderTop: '1px solid var(--border)',
        fontSize: 10,
        color: 'var(--muted)',
      }}>
        <div>contests_total&nbsp;&nbsp; = <span style={{ color: 'var(--white)' }}>22</span></div>
        <div>platform_count&nbsp; = <span style={{ color: 'var(--white)' }}>3</span></div>
        <div>codechef_stars&nbsp; = <span style={{ color: 'var(--white)' }}>⭐⭐</span></div>
        <div>hackerrank_level = <span style={{ color: 'var(--white)' }}>Silver</span></div>
      </div>
    </div>
  );
}
