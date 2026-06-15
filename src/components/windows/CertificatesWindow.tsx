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
    name: 'Machine Learning Specialization',
    issuer: 'Stanford University & DeepLearning.AI',
    date: 'Dec 2025',
    credentialId: 'ML-552A-981F',
    verificationUrl: 'https://coursera.org/verify/stanford-ml',
    category: 'ai_ml',
    skills: ['Machine Learning', 'Supervised Learning', 'Linear Regression', 'Neural Networks'],
    imagePath: '/assets/certificates/cert_ai_ml.png',
    verified: true
  },
  {
    id: 2,
    name: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'Feb 2026',
    credentialId: 'DL-673B-094D',
    verificationUrl: 'https://coursera.org/verify/deeplearning-specialization',
    category: 'ai_ml',
    skills: ['Deep Learning', 'Convolutional Neural Networks', 'RNNs', 'TensorFlow'],
    imagePath: '/assets/certificates/cert_ai_ml.png',
    verified: true
  },
  {
    id: 3,
    name: 'Full Stack Web Development',
    issuer: 'freeCodeCamp',
    date: 'Jun 2024',
    credentialId: 'FCC-FULLSTACK-991',
    verificationUrl: 'https://freecodecamp.org/certification/ayushmalik/full-stack',
    category: 'web_dev',
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    imagePath: '/assets/certificates/cert_web_dev.png',
    verified: true
  },
  {
    id: 4,
    name: 'Advanced React Certification',
    issuer: 'Meta',
    date: 'Aug 2025',
    credentialId: 'META-REACT-442C',
    verificationUrl: 'https://coursera.org/verify/meta-advanced-react',
    category: 'web_dev',
    skills: ['React.js', 'State Management', 'Component Patterns', 'Performance Optimization'],
    imagePath: '/assets/certificates/cert_web_dev.png',
    verified: true
  },
  {
    id: 5,
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: 'Oct 2025',
    credentialId: 'AWS-ASA-881A',
    verificationUrl: 'https://aws.amazon.com/verification',
    category: 'cloud_devops',
    skills: ['Cloud Architecture', 'AWS', 'DevOps', 'EC2', 'S3', 'IAM'],
    imagePath: '/assets/certificates/cert_cloud.png',
    verified: true
  },
  {
    id: 6,
    name: 'Google Cloud Certified Associate Cloud Engineer',
    issuer: 'Google Cloud',
    date: 'Jan 2026',
    credentialId: 'GCP-ACE-302B',
    verificationUrl: 'https://credential.google.com/gcp-associate-cloud-engineer',
    category: 'cloud_devops',
    skills: ['Google Cloud Platform', 'Kubernetes', 'GKE', 'Cloud Storage', 'IAM'],
    imagePath: '/assets/certificates/cert_cloud.png',
    verified: true
  },
  {
    id: 7,
    name: 'HackerRank SQL (Advanced) Certificate',
    issuer: 'HackerRank',
    date: 'Mar 2025',
    credentialId: 'HR-SQL-ADV-902',
    verificationUrl: 'https://hackerrank.com/certificates/sql-advanced',
    category: 'programming',
    skills: ['SQL', 'Databases', 'Query Optimization', 'Joins'],
    imagePath: '/assets/certificates/cert_programming.png',
    verified: true
  },
  {
    id: 8,
    name: 'HackerRank Java (Basic) Certificate',
    issuer: 'HackerRank',
    date: 'Feb 2024',
    credentialId: 'HR-JAVA-BASIC-801',
    verificationUrl: 'https://hackerrank.com/certificates/java-basic',
    category: 'programming',
    skills: ['Java', 'Object-Oriented Programming', 'Data Structures'],
    imagePath: '/assets/certificates/cert_programming.png',
    verified: true
  },
  {
    id: 9,
    name: 'LeetCode 500+ Solved Badge',
    issuer: 'LeetCode',
    date: 'Ongoing',
    credentialId: 'LC-500-SOLVED',
    verificationUrl: 'https://leetcode.com/u/ayush_176/',
    category: 'cp',
    skills: ['Algorithms', 'Data Structures', 'Problem Solving', 'Competitive Programming'],
    imagePath: '/assets/certificates/cert_programming.png',
    verified: true
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Certificates' },
  { id: 'ai_ml', label: 'AI & Machine Learning' },
  { id: 'web_dev', label: 'Web Development' },
  { id: 'cloud_devops', label: 'Cloud & DevOps' },
  { id: 'programming', label: 'Programming' },
  { id: 'cp', label: 'Competitive Programming' }
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
  const latestCert = MOCK_CERTIFICATES[0]; // mock_certificates[0] is ML Dec 2025, cert[1] is DL Feb 2026. Let's find latest date.
  const latestCertName = 'Deep Learning Specialization (Feb 2026)';

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
