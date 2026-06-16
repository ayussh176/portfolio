import React, { useState, useEffect, useRef } from 'react';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  verificationUrl: string;
  category: string;
  skills: string[];
  imagePath: string;
  verified: boolean;
}

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    name: 'LeetCode 100 Days Badge 2026',
    issuer: 'LeetCode',
    date: '2026',
    credentialId: 'LC-100-DAYS-2026',
    verificationUrl: 'https://leetcode.com/u/ayush_176/',
    category: 'cp',
    skills: ['Competitive Programming', 'Algorithms', 'Problem Solving', 'Data Structures'],
    imagePath: '/assets/certificates/leetcode_100_days_2026.png',
    verified: true
  },
  {
    id: 2,
    name: 'LeetCode 50 Days Badge 2026',
    issuer: 'LeetCode',
    date: '2026',
    credentialId: 'LC-50-DAYS-2026',
    verificationUrl: 'https://leetcode.com/u/ayush_176/',
    category: 'cp',
    skills: ['Competitive Programming', 'Algorithms', 'Problem Solving', 'Data Structures'],
    imagePath: '/assets/certificates/leetcode_50_days_2026.png',
    verified: true
  },
  {
    id: 3,
    name: 'Agentic AI Hackathon Certificate',
    issuer: 'Hack2Skill',
    date: 'May 2026',
    credentialId: 'H2S-AGENTIC-AI',
    verificationUrl: 'https://hack2skill.com/certificate',
    category: 'hackathon',
    skills: ['Agentic AI', 'Large Language Models', 'AI Agents', 'Python'],
    imagePath: '/assets/certificates/Certificate_AgenticAIHackathon_Hack2Skill_AyushMalik.jpg',
    verified: true
  },
  {
    id: 4,
    name: 'Python Essentials for MLOps',
    issuer: 'Coursera (Duke University)',
    date: 'Feb 2026',
    credentialId: 'COURSERA-PY-MLOPS',
    verificationUrl: 'https://coursera.org/verify',
    category: 'ai_ml',
    skills: ['Python', 'MLOps', 'DevOps', 'Machine Learning'],
    imagePath: '/assets/certificates/Certificate_PythonEssentialsForMLOps_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 5,
    name: 'Data Engineering with Rust',
    issuer: 'Coursera (Duke University)',
    date: 'Jan 2026',
    credentialId: 'COURSERA-RUST-DE',
    verificationUrl: 'https://coursera.org/verify',
    category: 'programming',
    skills: ['Rust', 'Data Engineering', 'Systems Programming', 'Pipelines'],
    imagePath: '/assets/certificates/Certificate_DataEngineeringWithRust_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 6,
    name: 'EnCode 2026 Certificate',
    issuer: 'Unstop',
    date: 'Jan 2026',
    credentialId: 'UNSTOP-ENCODE-2026',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Programming', 'Algorithms', 'Coding Challenge'],
    imagePath: '/assets/certificates/Certificate_EnCode2026_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 7,
    name: 'LeetCode 365 Days Badge',
    issuer: 'LeetCode',
    date: '2025',
    credentialId: 'LC-365-DAYS',
    verificationUrl: 'https://leetcode.com/u/ayush_176/',
    category: 'cp',
    skills: ['Competitive Programming', 'Algorithms', 'Problem Solving', 'Data Structures'],
    imagePath: '/assets/certificates/leetcode_365_days.png',
    verified: true
  },
  {
    id: 8,
    name: 'LeetCode 200 Days Badge 2025',
    issuer: 'LeetCode',
    date: '2025',
    credentialId: 'LC-200-DAYS-2025',
    verificationUrl: 'https://leetcode.com/u/ayush_176/',
    category: 'cp',
    skills: ['Competitive Programming', 'Algorithms', 'Problem Solving', 'Data Structures'],
    imagePath: '/assets/certificates/leetcode_200_days_2025.png',
    verified: true
  },
  {
    id: 9,
    name: 'LeetCode SQL 50 Badge',
    issuer: 'LeetCode',
    date: '2025',
    credentialId: 'LC-SQL-50',
    verificationUrl: 'https://leetcode.com/u/ayush_176/',
    category: 'cp',
    skills: ['SQL', 'Databases', 'Query Optimization', 'Relational Databases'],
    imagePath: '/assets/certificates/leetcode_sql_50.png',
    verified: true
  },
  {
    id: 10,
    name: 'East India Blockchain Hackathon Certificate',
    issuer: 'Unstop',
    date: 'Dec 2025',
    credentialId: 'UNSTOP-EAST-INDIA-BC',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Blockchain', 'Web3', 'Ethereum', 'Smart Contracts'],
    imagePath: '/assets/certificates/Certificate_EastIndiaBlockChain_Unstop_AyushMalik..jpg',
    verified: true
  },
  {
    id: 11,
    name: 'Satistella Hackathon Certificate',
    issuer: 'Unstop',
    date: 'Dec 2025',
    credentialId: 'UNSTOP-SATISTELLA',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Game Development', 'Creative Design', 'Frontend Dev'],
    imagePath: '/assets/certificates/Certificate_Satistella_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 12,
    name: 'Advanced Commands in Linux',
    issuer: 'Coursera (Codio)',
    date: 'Dec 2025',
    credentialId: 'COURSERA-LINUX-ADV',
    verificationUrl: 'https://coursera.org/verify',
    category: 'programming',
    skills: ['Linux', 'Bash Scripting', 'Command Line', 'System Administration'],
    imagePath: '/assets/certificates/Certificate_AdvanceCommandsInLinux_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 13,
    name: 'Odoo x Adani University Hackathon Certificate',
    issuer: 'Odoo, Adani University & Unstop',
    date: 'Nov 2025',
    credentialId: 'UNSTOP-ODOO-ADANI',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['ERP', 'Python', 'Business Solutions'],
    imagePath: '/assets/certificates/Certificate_OdooXAdaniUniversity_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 14,
    name: 'Bitathon Certificate',
    issuer: 'Unstop',
    date: 'Nov 2025',
    credentialId: 'UNSTOP-BITATHON',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Algorithms', 'Problem Solving', 'Coding Competition'],
    imagePath: '/assets/certificates/Certificate_Bitathon_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 15,
    name: 'Exploratory Data Analysis',
    issuer: 'Coursera (Johns Hopkins University)',
    date: 'Nov 2025',
    credentialId: 'COURSERA-EDA-JHU',
    verificationUrl: 'https://coursera.org/verify',
    category: 'ai_ml',
    skills: ['Data Analysis', 'R Programming', 'Exploratory Data Analysis', 'Data Visualization'],
    imagePath: '/assets/certificates/Certificate_ExploratoryDataAnalysis_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 16,
    name: 'Nation Building Hackathon Certificate',
    issuer: 'Unstop',
    date: 'Oct 2025',
    credentialId: 'UNSTOP-NATION-BUILDING',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Social Innovation', 'Full Stack Development', 'System Design'],
    imagePath: '/assets/certificates/Certificate_NationBuilding_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 17,
    name: 'Introduction to Blockchain Technology',
    issuer: 'Coursera (INSEAD)',
    date: 'Oct 2025',
    credentialId: 'COURSERA-BLOCKCHAIN',
    verificationUrl: 'https://coursera.org/verify',
    category: 'programming',
    skills: ['Blockchain', 'Cryptocurrency', 'Smart Contracts', 'Decentralization'],
    imagePath: '/assets/certificates/Certificate_IntroductionToBlockchainTechnology_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 18,
    name: 'Machine Learning for All',
    issuer: 'Coursera (University of London)',
    date: 'Sep 2025',
    credentialId: 'COURSERA-ML-ALL',
    verificationUrl: 'https://coursera.org/verify',
    category: 'ai_ml',
    skills: ['Machine Learning', 'Algorithms', 'AI Ethics', 'Supervised Learning'],
    imagePath: '/assets/certificates/Certificate_MachineLearningForAll_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 19,
    name: 'Bappa Ka Prasad Hackathon Certificate',
    issuer: 'Unstop',
    date: 'Sep 2025',
    credentialId: 'UNSTOP-BAPPA-PRASAD',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Web Development', 'App Development', 'Product Design'],
    imagePath: '/assets/certificates/Certificate_BappaKaPrasad_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 20,
    name: 'ISRO Hackathon Certificate',
    issuer: 'ISRO & Hack2Skill',
    date: 'Aug 2025',
    credentialId: 'ISRO-HACK-2025',
    verificationUrl: 'https://hack2skill.com/certificate',
    category: 'hackathon',
    skills: ['Space Tech', 'Data Analysis', 'Satellite Image Processing', 'Python'],
    imagePath: '/assets/certificates/Certificate_ISROhackathon_Hack2Skill_AyushMalik.jpg',
    verified: true
  },
  {
    id: 21,
    name: 'Rust Fundamentals',
    issuer: 'Coursera (Duke University)',
    date: 'Aug 2025',
    credentialId: 'COURSERA-RUST-FUND',
    verificationUrl: 'https://coursera.org/verify',
    category: 'programming',
    skills: ['Rust', 'Systems Programming', 'Memory Safety', 'Concurrency'],
    imagePath: '/assets/certificates/Certificate_Rustfundamental_Coursera_AyushMalik.jpg',
    verified: true
  },
  {
    id: 22,
    name: 'HP Hackathon Certificate',
    issuer: 'HP & Unstop',
    date: 'Jul 2025',
    credentialId: 'UNSTOP-HP-HACK',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Full Stack Development', 'Hardware Integration', 'Problem Solving'],
    imagePath: '/assets/certificates/Certificate_HPHackathon_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 23,
    name: 'Visa 24hrs AI Hackathon Certificate',
    issuer: 'Visa & Unstop',
    date: 'Jun 2025',
    credentialId: 'UNSTOP-VISA-AI-HACK',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Artificial Intelligence', 'Fintech', 'Machine Learning', 'API Integration'],
    imagePath: '/assets/certificates/Certificate_Visa24hrsAIHackathon_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 24,
    name: 'NVIDIA DLI Certificate',
    issuer: 'NVIDIA Deep Learning Institute',
    date: 'Apr 2025',
    credentialId: 'NVIDIA-DLI-DL',
    verificationUrl: 'https://courses.nvidia.com/certificates',
    category: 'ai_ml',
    skills: ['Deep Learning', 'GPUs', 'CUDA', 'Model Training'],
    imagePath: '/assets/certificates/Certificate_NVIDIA.jpg',
    verified: true
  },
  {
    id: 25,
    name: 'Adobe Hackathon Certificate',
    issuer: 'Adobe & Unstop',
    date: 'Mar 2025',
    credentialId: 'UNSTOP-ADOBE-HACK',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Problem Solving', 'Software Development', 'Team Collaboration'],
    imagePath: '/assets/certificates/Certificate_AdobeHackathon_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 26,
    name: 'HackTU MLH Patiala Certificate',
    issuer: 'Major League Hacking & TIET',
    date: 'Feb 2025',
    credentialId: 'MLH-HACKTU-2025',
    verificationUrl: 'https://mlh.io/verification',
    category: 'hackathon',
    skills: ['Hackathon', 'Rapid Prototyping', 'Software Engineering'],
    imagePath: '/assets/certificates/Certificate_HackTUMLH_Patiala_AyushMalik.jpg',
    verified: true
  },
  {
    id: 27,
    name: 'VNIT Axis Hackathon Certificate',
    issuer: 'VNIT Nagpur & Unstop',
    date: 'Feb 2025',
    credentialId: 'UNSTOP-VNIT-AXIS',
    verificationUrl: 'https://unstop.com/certificate',
    category: 'hackathon',
    skills: ['Web Development', 'Hardware Prototypes', 'Collaboration'],
    imagePath: '/assets/certificates/Certificate_VNITAxis_Unstop_AyushMalik.jpg',
    verified: true
  },
  {
    id: 28,
    name: 'HackerRank SQL (Intermediate) Certificate',
    issuer: 'HackerRank',
    date: 'Aug 2024',
    credentialId: 'HR-SQL-INT-202',
    verificationUrl: 'https://hackerrank.com/certificates/sql-intermediate',
    category: 'programming',
    skills: ['SQL', 'Complex Queries', 'Subqueries', 'Aggregations'],
    imagePath: '/assets/certificates/Certificate_SQLIntermediate_HackerRank_AyushMalik.jpg',
    verified: true
  },
  {
    id: 29,
    name: 'HackerRank Java (Basic) Certificate',
    issuer: 'HackerRank',
    date: 'Jul 2024',
    credentialId: 'HR-JAVA-BASIC-801',
    verificationUrl: 'https://hackerrank.com/certificates/java-basic',
    category: 'programming',
    skills: ['Java', 'Object-Oriented Programming', 'Data Structures'],
    imagePath: '/assets/certificates/Certificate_JavaBasics_HackerRank_AyushMalik.jpg',
    verified: true
  },
  {
    id: 30,
    name: 'HackerRank SQL (Basic) Certificate',
    issuer: 'HackerRank',
    date: 'Jun 2024',
    credentialId: 'HR-SQL-BASIC-101',
    verificationUrl: 'https://hackerrank.com/certificates/sql-basic',
    category: 'programming',
    skills: ['SQL', 'Relational Databases', 'Data Queries'],
    imagePath: '/assets/certificates/Certificate_SQLBasics_HackerRank_AyushMalik.jpg',
    verified: true
  },
  {
    id: 31,
    name: 'Data Analyst Virtual Experience',
    issuer: 'The Forage (Accenture)',
    date: 'May 2024',
    credentialId: 'FORAGE-ACCENTURE-DA',
    verificationUrl: 'https://theforage.com/verify',
    category: 'programming',
    skills: ['Data Analysis', 'Excel', 'Data Visualization', 'Reporting'],
    imagePath: '/assets/certificates/Certificate_DataAnalyst_Forage.jpg',
    verified: true
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Certificates' },
  { id: 'ai_ml', label: 'AI & Machine Learning' },
  { id: 'programming', label: 'Programming' },
  { id: 'cp', label: 'Competitive Programming' },
  { id: 'hackathon', label: 'Hackathons & Competitions' }
];

export default function CertificatesWindow() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const [hoveredCert, setHoveredCert] = useState<Certificate | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const windowRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search Logic
  const filteredCerts = MOCK_CERTIFICATES.filter(cert => {
    const matchesCategory = activeCategory === 'all' || cert.category === activeCategory;
    const matchesQuery = searchQuery.trim() === '' || 
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Keep index in range when list changes
  useEffect(() => {
    setSelectedCertIndex(0);
  }, [activeCategory, searchQuery]);

  // Keyboard Navigation Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, Esc closes it, and zoom commands are active
      if (modalCert) {
        if (e.key === 'Escape') {
          setModalCert(null);
          e.preventDefault();
        } else if (e.key === '=' || e.key === '+') {
          setZoomLevel(z => Math.min(z + 0.25, 2.5));
          e.preventDefault();
        } else if (e.key === '-') {
          setZoomLevel(z => Math.max(z - 0.25, 0.5));
          e.preventDefault();
        } else if (e.key === '0') {
          setZoomLevel(1);
          e.preventDefault();
        }
        return;
      }

      // If search bar is active, don't hijack simple character key navigation, but handle arrows/Enter
      if (filteredCerts.length === 0) return;

      const cols = window.innerWidth < 768 ? 2 : 3; // Est columns for arrow navigation

      switch (e.key) {
        case 'ArrowLeft':
          setSelectedCertIndex(prev => Math.max(prev - 1, 0));
          e.preventDefault();
          break;
        case 'ArrowRight':
          setSelectedCertIndex(prev => Math.min(prev + 1, filteredCerts.length - 1));
          e.preventDefault();
          break;
        case 'ArrowUp':
          setSelectedCertIndex(prev => Math.max(prev - cols, 0));
          e.preventDefault();
          break;
        case 'ArrowDown':
          setSelectedCertIndex(prev => Math.min(prev + cols, filteredCerts.length - 1));
          e.preventDefault();
          break;
        case 'Enter':
          // Open modal for selected card
          if (filteredCerts[selectedCertIndex]) {
            setModalCert(filteredCerts[selectedCertIndex]);
            setZoomLevel(1);
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCerts, selectedCertIndex, modalCert]);

  // Statistics calculations
  const totalCertificates = MOCK_CERTIFICATES.length;
  const verifiedCertificates = MOCK_CERTIFICATES.filter(c => c.verified).length;
  // Get latest by id order or date logic
  const latestCert = MOCK_CERTIFICATES[0];
  const latestCertName = latestCert ? `${latestCert.name} (${latestCert.date})` : 'N/A';

  // Handle Quick Preview Hover position
  const handleMouseMove = (e: React.MouseEvent, cert: Certificate) => {
    if (window.innerWidth < 768) return; // Disable hover preview on mobile
    const windowEl = windowRef.current;
    if (!windowEl) return;
    const windowRect = windowEl.getBoundingClientRect();
    
    // Position tooltip 15px below and to the right of cursor
    let tooltipX = e.clientX - windowRect.left + 15;
    let tooltipY = e.clientY - windowRect.top + 15;
    
    // Boundary check so popover stays inside window
    const popoverWidth = 220;
    const popoverHeight = 220;
    if (tooltipX + popoverWidth > windowRect.width) {
      tooltipX = e.clientX - windowRect.left - popoverWidth - 10;
    }
    if (tooltipY + popoverHeight > windowRect.height) {
      tooltipY = e.clientY - windowRect.top - popoverHeight - 10;
    }

    setHoverPosition({ x: tooltipX, y: tooltipY });
    setHoveredCert(cert);
  };

  const handleMouseLeave = () => {
    setHoveredCert(null);
  };

  // Image load helper
  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Category counts
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return MOCK_CERTIFICATES.length;
    return MOCK_CERTIFICATES.filter(c => c.category === catId).length;
  };

  return (
    <div ref={windowRef} className="cert-window relative">
      {/* Left Sidebar */}
      <aside className="cert-sidebar">
        <div className="cert-sidebar-title">📁 Categories</div>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cert-sidebar-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.label}</span>
            <span className="cert-sidebar-count">{getCategoryCount(cat.id)}</span>
          </button>
        ))}
      </aside>

      {/* Right Panel */}
      <main className="cert-main">
        {/* Top Header */}
        <section className="cert-header">
          {/* Achievement Banner */}
          <div className="cert-achievement-banner">
            <div className="cert-achievement-text">
              <span>🏆 Continuous Learning Enabled</span>
              <span className="cert-achievement-badge">Expert</span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Keep growing!</span>
          </div>

          {/* Stats Bar */}
          <div className="cert-stats-row">
            <div className="cert-stat-card">
              <span className="cert-stat-label">Total Certificates</span>
              <span className="cert-stat-val">{totalCertificates}</span>
            </div>
            <div className="cert-stat-card">
              <span className="cert-stat-label">Verified Verified</span>
              <span className="cert-stat-val" style={{ color: 'var(--teal)' }}>{verifiedCertificates} ✓</span>
            </div>
            <div className="cert-stat-card">
              <span className="cert-stat-label">Latest Certificate</span>
              <span className="cert-stat-val" style={{ fontSize: '10px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} title={latestCertName}>
                {latestCertName}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="cert-search-row">
            <div className="cert-search-bar">
              <span className="cert-search-icon">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                className="cert-search-input"
                placeholder="search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Certificate Grid Container */}
        <section ref={gridContainerRef} className="cert-content">
          {filteredCerts.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '11px', gap: '8px' }}>
              <span>⚠️ No certificates match the search criteria.</span>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="cert-action-btn secondary"
                style={{ width: 'auto', padding: '4px 12px' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="cert-grid">
              {filteredCerts.map((cert, index) => {
                const isSelected = index === selectedCertIndex;
                const isImageLoaded = loadedImages[cert.id];

                return (
                  <article
                    key={cert.id}
                    className={`cert-card ${isSelected ? 'selected-highlight' : ''}`}
                    onClick={() => {
                      setSelectedCertIndex(index);
                      setModalCert(cert);
                      setZoomLevel(1);
                    }}
                    onMouseMove={(e) => handleMouseMove(e, cert)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="cert-thumb-container">
                      {!isImageLoaded && <div className="skeleton-loader" />}
                      <img
                        src={cert.imagePath}
                        alt={cert.name}
                        className="cert-thumb"
                        onLoad={() => handleImageLoad(cert.id)}
                        style={{ opacity: isImageLoaded ? 1 : 0 }}
                      />
                      {cert.verified && (
                        <div className="cert-verified-badge-overlay">
                          <span>✓</span> Verified
                        </div>
                      )}
                    </div>
                    <div className="cert-info">
                      <h4 className="cert-name">{cert.name}</h4>
                      <div className="cert-issuer">{cert.issuer}</div>
                      <div className="cert-date">{cert.date}</div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Quick Preview Tooltip Popover */}
      {hoveredCert && (
        <div
          className="cert-quick-preview-popover"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`
          }}
        >
          <img 
            src={hoveredCert.imagePath} 
            alt={hoveredCert.name} 
            className="cert-preview-image" 
          />
          <div className="cert-preview-title">{hoveredCert.name}</div>
          <div className="cert-preview-meta">{hoveredCert.issuer} • {hoveredCert.date}</div>
          <div style={{ marginTop: '6px', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
            {hoveredCert.skills.slice(0, 3).map(skill => (
              <span key={skill} style={{ fontSize: '7px', background: 'rgba(127,119,221,0.2)', color: 'var(--purple-light)', padding: '1px 4px', borderRadius: '3px' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Modal Image Viewer */}
      {modalCert && (
        <div 
          className="cert-modal-overlay"
          onClick={() => setModalCert(null)}
        >
          <div 
            className="cert-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="cert-modal-header">
              <span className="cert-modal-title">{modalCert.name} — Credential Viewer</span>
              <button 
                className="cert-modal-close-btn"
                onClick={() => setModalCert(null)}
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="cert-modal-body">
              {/* Image Pane */}
              <div className="cert-modal-viewer-pane">
                <div className="cert-modal-img-container">
                  <img
                    src={modalCert.imagePath}
                    alt={modalCert.name}
                    className="cert-modal-img"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>
                {/* Toolbar */}
                <div className="cert-modal-toolbar">
                  <button 
                    className="cert-toolbar-btn" 
                    onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.5))}
                    title="Zoom Out (-)"
                  >
                    －
                  </button>
                  <span style={{ fontSize: '9px', color: 'var(--muted)', minWidth: '32px', textAlign: 'center' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button 
                    className="cert-toolbar-btn" 
                    onClick={() => setZoomLevel(z => Math.min(z + 0.25, 2.5))}
                    title="Zoom In (+)"
                  >
                    ＋
                  </button>
                  <div className="cert-toolbar-divider" />
                  <button 
                    className="cert-toolbar-btn" 
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom (0)"
                    style={{ fontSize: '9px' }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Sidebar Info Pane */}
              <div className="cert-modal-sidebar-pane">
                <div>
                  <h3 className="cert-metadata-title">Certificate Details</h3>
                  <div className="cert-metadata-grid">
                    <div className="cert-metadata-item">
                      <span className="cert-metadata-label">Name</span>
                      <span className="cert-metadata-value" style={{ fontWeight: '600' }}>{modalCert.name}</span>
                    </div>
                    <div className="cert-metadata-item">
                      <span className="cert-metadata-label">Issuer</span>
                      <span className="cert-metadata-value">{modalCert.issuer}</span>
                    </div>
                    <div className="cert-metadata-item">
                      <span className="cert-metadata-label">Issued Date</span>
                      <span className="cert-metadata-value">{modalCert.date}</span>
                    </div>
                    <div className="cert-metadata-item">
                      <span className="cert-metadata-label">Credential ID</span>
                      <span className="cert-metadata-value" style={{ fontFamily: 'monospace' }}>{modalCert.credentialId}</span>
                    </div>
                    <div className="cert-metadata-item">
                      <span className="cert-metadata-label">Skills & Topics</span>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
                        {modalCert.skills.map(skill => (
                          <span key={skill} style={{ fontSize: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--white)', padding: '2px 6px', borderRadius: '4px' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="cert-metadata-item">
                      <span className="cert-metadata-label">Verification Status</span>
                      <span className="cert-metadata-value cert-metadata-badge-verified">
                        VERIFIED ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="cert-modal-actions">
                  <a
                    href={modalCert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-action-btn primary"
                  >
                    Verify Credential ↗
                  </a>
                  <a
                    href={modalCert.imagePath}
                    download={`${modalCert.name.replace(/\s+/g, '_')}_Certificate.png`}
                    className="cert-action-btn secondary"
                  >
                    Download Certificate 💾
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
