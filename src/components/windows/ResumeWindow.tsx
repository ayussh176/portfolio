import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../os/WindowManager';

export default function ResumeWindow() {
  const { openWindow } = useWindowManager();
  const [zoom, setZoom] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadCount, setDownloadCount] = useState(() => {
    try {
      const saved = localStorage.getItem('ayush_resume_downloads');
      return saved ? parseInt(saved, 10) : 47;
    } catch (e) {
      console.error('Failed to access localStorage', e);
      return 47;
    }
  });

  // Downloading console terminal overlay state
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadingRef = useRef(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const triggerDownload = () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloading(true);
    setTerminalLines([]);

    const script = [
      'ayush@portfolio ~ $ ./downloading_resume.sh',
      '[INFO] Resolving Resume_AyushMalik.pdf...',
      '[INFO] Size: 173.8 KB',
      '[INFO] Connecting to local server on port 8081...',
      'Downloading: [================================>] 100%',
      '[OK] Connection established.',
      '[OK] Resume downloaded successfully.'
    ];

    let lineIdx = 0;
    const runTerminalLine = () => {
      if (lineIdx < script.length) {
        const lineToAppend = script[lineIdx];
        setTerminalLines(prev => [...prev, lineToAppend]);
        lineIdx++;
        const delay = lineIdx === 5 ? 400 : 200;
        terminalTimerRef.current = setTimeout(runTerminalLine, delay);
      } else {
        // Download finish
        terminalTimerRef.current = setTimeout(() => {
          setIsDownloading(false);
          downloadingRef.current = false;
          // Increment download stats
          setDownloadCount(prev => {
            const next = prev + 1;
            try {
              localStorage.setItem('ayush_resume_downloads', next.toString());
            } catch (e) {
              console.error('Failed to set localStorage', e);
            }
            return next;
          });
          // Trigger actual PDF file download
          const link = document.createElement('a');
          link.href = '/Resume_AyushMalik.pdf';
          link.download = 'Resume_AyushMalik.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 600);
      }
    };

    runTerminalLine();
  };

  const triggerPrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error('Failed to enter fullscreen', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Keyboard Shortcuts Handler using stable handler refs
  const triggerDownloadRef = useRef(triggerDownload);
  const triggerPrintRef = useRef(triggerPrint);
  const toggleFullscreenRef = useRef(toggleFullscreen);

  useEffect(() => {
    triggerDownloadRef.current = triggerDownload;
    triggerPrintRef.current = triggerPrint;
    toggleFullscreenRef.current = toggleFullscreen;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl key is pressed
      if (e.ctrlKey) {
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          triggerDownloadRef.current();
        } else if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          triggerPrintRef.current();
        }
      } else if (e.key.toLowerCase() === 'f') {
        // Toggle Fullscreen (if search / input elements are not focused)
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          toggleFullscreenRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleAction = () => {
      triggerDownloadRef.current();
    };
    window.addEventListener('ayush:download-resume-action', handleAction);
    return () => window.removeEventListener('ayush:download-resume-action', handleAction);
  }, []);

  // Scroll spy to update page counter in bottom bar
  const handleScroll = () => {
    const viewport = viewportRef.current;
    const p1 = page1Ref.current;
    const p2 = page2Ref.current;
    if (!viewport || !p1 || !p2) return;

    const viewportCenter = viewport.scrollTop + viewport.clientHeight / 2;
    const p2Top = p2.offsetTop;

    if (viewportCenter >= p2Top) {
      setActivePage(2);
    } else {
      setActivePage(1);
    }
  };

  const scrollToPage = (pageNumber: number) => {
    const target = pageNumber === 1 ? page1Ref.current : page2Ref.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActivePage(pageNumber);
    }
  };

  // Clean up terminal timers
  useEffect(() => {
    return () => {
      if (terminalTimerRef.current) clearTimeout(terminalTimerRef.current);
    };
  }, []);

  const triggerShare = () => {
    const url = `${window.location.origin}/Resume_AyushMalik.pdf`;
    navigator.clipboard.writeText(url).then(() => {
      // Trigger global custom event toast
      const event = new CustomEvent('ayush:show-toast', {
        detail: { message: '📋 Link to PDF copied to clipboard!' }
      });
      window.dispatchEvent(event);
    }).catch(err => {
      console.error('Failed to copy', err);
    });
  };

  // Listen for native escape/exit fullscreen
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const zoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const zoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <div ref={containerRef} className="pdf-window relative">
      {/* Left Thumbnail Sidebar */}
      <aside className="pdf-sidebar">
        <div className="pdf-sidebar-title">📄 Pages</div>
        <button
          className={`pdf-thumbnail-btn ${activePage === 1 ? 'active' : ''}`}
          onClick={() => scrollToPage(1)}
        >
          <div className="pdf-thumbnail-sheet">
            <div className="pdf-thumbnail-line header" />
            <div className="pdf-thumbnail-line" />
            <div className="pdf-thumbnail-line short" />
            <div className="pdf-thumbnail-line" />
            <div className="pdf-thumbnail-line" />
          </div>
          <span className="pdf-thumbnail-label">Page 1</span>
        </button>
        <button
          className={`pdf-thumbnail-btn ${activePage === 2 ? 'active' : ''}`}
          onClick={() => scrollToPage(2)}
        >
          <div className="pdf-thumbnail-sheet">
            <div className="pdf-thumbnail-line header" style={{ background: 'var(--coral)' }} />
            <div className="pdf-thumbnail-line" />
            <div className="pdf-thumbnail-line" />
            <div className="pdf-thumbnail-line short" />
            <div className="pdf-thumbnail-line" />
          </div>
          <span className="pdf-thumbnail-label">Page 2</span>
        </button>
      </aside>

      {/* Main Content Viewer */}
      <main className="pdf-main">
        {/* Top Action Toolbar */}
        <header className="pdf-toolbar">
          <div className="pdf-toolbar-group">
            <button className="pdf-toolbar-btn primary" onClick={triggerDownload} title="Download PDF (Ctrl+D)">
              <span>💾</span>
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button className="pdf-toolbar-btn" onClick={triggerPrint} title="Print Resume (Ctrl+P)">
              <span>🖨️</span>
              <span className="hidden sm:inline">Print</span>
            </button>
            <button className="pdf-toolbar-btn" onClick={triggerShare} title="Copy shareable PDF link">
              <span>🔗</span>
              <span className="hidden sm:inline">Share Link</span>
            </button>
          </div>

          <div className="pdf-toolbar-group">
            <button className="pdf-toolbar-btn" onClick={zoomOut} title="Zoom Out" disabled={zoom <= 0.5}>
              <span>➖</span>
            </button>
            <span style={{ fontSize: '9px', color: 'var(--muted)', minWidth: '32px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button className="pdf-toolbar-btn" onClick={zoomIn} title="Zoom In" disabled={zoom >= 1.5}>
              <span>➕</span>
            </button>
            <button className="pdf-toolbar-btn" onClick={resetZoom} title="Reset Zoom" style={{ fontSize: '8px' }}>
              Reset
            </button>
            <div className="pdf-toolbar-divider" />
            <button className="pdf-toolbar-btn" onClick={toggleFullscreen} title="Toggle Fullscreen (F)">
              <span>{isFullscreen ? '⏹️' : '🖥️'}</span>
              <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Viewport Pane */}
        <section
          ref={viewportRef}
          className="pdf-viewport"
          onScroll={handleScroll}
        >
          {/* Recruiter Quick Snapshot Banner */}
          <div className="pdf-snapshot-banner">
            <div className="pdf-snapshot-title">Candidate Snapshot</div>
            <div className="pdf-snapshot-grid">
              <div className="pdf-snapshot-item">
                <span className="pdf-snapshot-item-check">✓</span>
                <span>AI/ML Engineer</span>
              </div>
              <div className="pdf-snapshot-item">
                <span className="pdf-snapshot-item-check">✓</span>
                <span>Full Stack Developer</span>
              </div>
              <div className="pdf-snapshot-item">
                <span className="pdf-snapshot-item-check">✓</span>
                <span>500+ LeetCode Problems</span>
              </div>
              <div className="pdf-snapshot-item">
                <span className="pdf-snapshot-item-check">✓</span>
                <span>Software Development Intern</span>
              </div>
              <div className="pdf-snapshot-item" style={{ gridColumn: 'span 2' }}>
                <span className="pdf-snapshot-item-check">✓</span>
                <span>Multiple Production-Grade Projects</span>
              </div>
            </div>
          </div>

          {/* HTML Resume Page 1 */}
          <div
            ref={page1Ref}
            className="pdf-resume-page"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Page Header */}
            <div className="resume-header">
              <div className="resume-name">Ayush Malik</div>
              <div className="resume-title-sub">AI/ML Engineer & Full Stack Web Developer</div>
              <div className="resume-contact-info">
                <span>📍 Nagpur, Maharashtra</span>
                <span>📧 ayushmalik852@gmail.com</span>
                <span>📞 +91 91724 16301</span>
                <span>🌐 ayush-portfolio176.netlify.app</span>
                <span>🔗 github.com/ayussh176</span>
              </div>
            </div>

            {/* Education Section */}
            <div className="resume-section">
              <div className="resume-section-title">Education</div>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>Shri Ramdeobaba College of Engineering and Management (RCOEM)</span>
                  <span>Nagpur, India</span>
                </div>
                <div className="resume-item-subheader">
                  <span>B.Tech in Computer Science and Engineering</span>
                  <span>2023 – 2027 (Expected)</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Current CGPA: 8.20 / 10.00</li>
                  <li className="resume-bullet">Core Courses: Data Structures & Algorithms, OOPs, Database Management Systems, Discrete Mathematics.</li>
                </ul>
              </div>
            </div>

            {/* Experience Section */}
            <div className="resume-section">
              <div className="resume-section-title">Experience</div>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>Software Development Intern</span>
                  <span>Nagpur, India</span>
                </div>
                <div className="resume-item-subheader">
                  <span>Pesticide & Agribusiness Management Portal</span>
                  <span>Winter 2024 – 2025</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Designed and engineered role-based administrative portals for distributors and sales staff.</li>
                  <li className="resume-bullet">Utilized React, TypeScript, and Firebase for real-time order ledger updates and product schemes.</li>
                  <li className="resume-bullet">Implemented document exports to PDF/Excel, reducing inventory tracking overhead.</li>
                </ul>
              </div>
            </div>

            {/* Technical Skills Section */}
            <div className="resume-section">
              <div className="resume-section-title">Technical Skills</div>
              <div className="resume-skills-grid">
                <div className="resume-skills-category">
                  <strong>Languages:</strong> Python, Java, C, SQL, JavaScript, HTML/CSS
                </div>
                <div className="resume-skills-category">
                  <strong>Frameworks:</strong> React.js, Express.js, Flask, Django
                </div>
                <div className="resume-skills-category">
                  <strong>Databases:</strong> Firebase, MySQL, PostgreSQL, MongoDB
                </div>
                <div className="resume-skills-category">
                  <strong>Tools:</strong> Git, GitHub, Linux Shell, JIRA, Agile Methods
                </div>
              </div>
            </div>
          </div>

          {/* HTML Resume Page 2 */}
          <div
            ref={page2Ref}
            className="pdf-resume-page"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Projects Section */}
            <div className="resume-section">
              <div className="resume-section-title">Projects</div>
              
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>Kissan Khata Portal</span>
                  <span>React, Firebase, Tailwind</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Built a pesticide distributor management platform with secure user authentication and inventory audit tables.</li>
                  <li className="resume-bullet">Integrated real-time database synchronizations and complex schema validation pipelines.</li>
                </ul>
              </div>

              <div className="resume-item">
                <div className="resume-item-header">
                  <span>PatientKhata</span>
                  <span>React, Node.js, Firebase</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Designed a clinic-focused patient health ledger, enabling doctors to log visits, prescriptions, and billing.</li>
                  <li className="resume-bullet">Secured data integrity using strict Firestore security rules and client-side form sanitization.</li>
                </ul>
              </div>

              <div className="resume-item">
                <div className="resume-item-header">
                  <span>Bengaluru Property Valuation Engine</span>
                  <span>Machine Learning, Flask, HTML</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Trained a linear regression valuation model on housing datasets, achieving consistent predictions.</li>
                  <li className="resume-bullet">Deployed a Flask API backend integrated with a responsive web interface.</li>
                </ul>
              </div>
            </div>

            {/* Competitive Programming & Achievements Section */}
            <div className="resume-section">
              <div className="resume-section-title">Achievements & Profiles</div>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>LeetCode Profiling</span>
                  <span>530+ Problems Solved</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Solved 530+ coding challenges focusing on Dynamic Programming, Graphs, and Hash Tables.</li>
                </ul>
              </div>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>CodeChef Rating</span>
                  <span>1497 Rating (2-Star)</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Participated in 22+ live algorithmic contests with competitive rankings.</li>
                </ul>
              </div>
              <div className="resume-item">
                <div className="resume-item-header">
                  <span>HackerRank Badges</span>
                  <span>Silver Badge in Problem Solving</span>
                </div>
                <ul className="resume-bullet-list">
                  <li className="resume-bullet">Earned certifications in Advanced SQL querying and Java fundamentals.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Recruiter CTA Button */}
        <button
          className="pdf-recruiter-cta"
          onClick={() => openWindow('contact.sh')}
          title="Send a message to Ayush"
        >
          <span>💬</span> Interested? Contact Ayush
        </button>

        {/* Bottom Status Bar */}
        <footer className="pdf-statusbar">
          <span>Page {activePage} of 2</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Downloads: {downloadCount} times</span>
            <span>Last updated: June 2026</span>
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>
        </footer>

        {/* Terminal downloading_resume.sh Overlay */}
        {isDownloading && (
          <div className="pdf-terminal-overlay">
            {terminalLines.map((line, i) => {
              if (!line || typeof line !== 'string') return null;
              const isPrompt = line.startsWith('ayush@');
              const isOk = line.startsWith('[OK]');
              return (
                <div key={i} className="pdf-terminal-line">
                  {isPrompt ? (
                    <>
                      <span className="pdf-terminal-prompt">ayush@portfolio ~ $</span>{' '}
                      <span>{line.substring(20)}</span>
                    </>
                  ) : isOk ? (
                    <span style={{ color: 'var(--teal)' }}>{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              );
            })}
            {/* Terminal blinking cursor */}
            <div className="pdf-terminal-line">
              <span className="pdf-terminal-prompt">ayush@portfolio ~ $</span>
              <span className="terminal-cursor" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
