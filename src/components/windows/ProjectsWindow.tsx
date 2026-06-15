import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  category: string;
  githubLink: string;
  liveLink: string;
  badge?: string;
  badgeColor?: string;
}

const ALL_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Bangaluru House Price Prediction',
    subtitle: 'ML regression model for property valuation',
    description: 'A responsive web app that predicts the house prices in Banagaluru using some basic inputs.',
    tags: ['Regression Model', 'Flask', 'HTML', 'CSS', 'JavaScript'],
    category: 'AI/ML',
    githubLink: 'https://github.com/ayussh176/house-price-prediction',
    liveLink: 'https://house-price-qcwb.onrender.com/',
    badge: 'AI/ML',
    badgeColor: 'var(--amber)',
  },
  {
    id: 2,
    title: 'PatientKhata',
    subtitle: 'Digital health record ledger for clinics',
    description: 'A web application for hospitals especially doctors where they can keep the data of patients and which gets stored in the database.',
    tags: ['React', 'Node.js', 'Firebase', 'Netlify'],
    category: 'Full-Stack',
    githubLink: 'https://github.com/ayussh176/PatientKhata.git',
    liveLink: 'https://patientkhata.netlify.app/',
    badge: 'FULL-STACK',
    badgeColor: 'var(--purple)',
  },
  {
    id: 3,
    title: 'Survival Pattern Discovery in Titanic Dataset',
    subtitle: 'Exploratory data analysis with Python',
    description: 'Performed exploratory data analysis on the Titanic dataset using Pandas and Matplotlib, including data cleaning, feature engineering, and visualizations to uncover key survival trends.',
    tags: ['Python', 'Pandas', 'Matplotlib'],
    category: 'AI/ML',
    githubLink: 'https://github.com/ayussh176/Titanic-data-analysis.git',
    liveLink: '',
    badge: 'DATA',
    badgeColor: 'var(--teal)',
  },
  {
    id: 4,
    title: 'Expense Tracker App',
    subtitle: 'Personal expense tracking with visualizations',
    description: 'A responsive web app to track personal expenses with visualization and categorization features.',
    tags: ['JavaScript', 'Chart.js', 'HTML/CSS', 'React.js'],
    category: 'Web App',
    githubLink: 'https://github.com/ayussh176/Expense_tracker.git',
    liveLink: 'https://expense-tracker-176.netlify.app/',
    badge: 'WEB APP',
    badgeColor: 'var(--blue)',
  },
  {
    id: 5,
    title: 'ProductivityHub - Todo List Application',
    subtitle: 'Full-featured task management suite',
    description: 'A simple and intuitive application to manage daily tasks with features like adding, editing, and deleting tasks. It also includes adding notes and Planner with secure login and signup.',
    tags: ['HTML/CSS', 'JavaScript', 'React.js', 'Firebase'],
    category: 'Web App',
    githubLink: 'https://github.com/ayussh176/To-do-list.git',
    liveLink: 'https://to-do-list176.netlify.app/',
  },
  {
    id: 6,
    title: 'Weather Forecast Dashboard',
    subtitle: 'Real-time weather with external API',
    description: 'A weather application that provides current and forecasted weather data using external APIs.',
    tags: ['HTML/CSS', 'JavaScript', 'API Integration'],
    category: 'Web App',
    githubLink: 'https://github.com/ayussh176/weather.git',
    liveLink: 'https://weather176.netlify.app/',
  },
  {
    id: 7,
    title: 'Kissan Khata',
    subtitle: 'Role-based pesticide management system',
    description: 'A role-based Pesticide Management Web App for distributors and company staff to manage products, sales, collections, and schemes. Built with React, Firebase, and Excel/PDF export features for streamlined data handling.',
    tags: ['TypeScript', 'React', 'Firebase', 'Database Schema'],
    category: 'Full-Stack',
    githubLink: 'https://github.com/ayussh176/KissanKhata.git',
    liveLink: 'https://kissankhata.netlify.app/',
    badge: 'FLAGSHIP',
    badgeColor: 'var(--purple)',
  },
];

const CATEGORIES = ['All Projects', 'AI/ML', 'Full-Stack', 'Web App'];

export default function ProjectsWindow() {
  const [filter, setFilter] = useState('All Projects');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filtered = filter === 'All Projects'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.category === filter);

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'AI/ML': return 'var(--amber)';
      case 'Full-Stack': return 'var(--purple)';
      case 'Web App': return 'var(--blue)';
      default: return 'var(--blue)';
    }
  };

  return (
    <div className="filemanager">
      {/* Sidebar */}
      <div className="filemanager-sidebar">
        <div className="filemanager-sidebar-title">📁 ~/projects</div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filemanager-filter ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="filemanager-content">
        {filtered.map((project, i) => {
          const isExpanded = expanded.has(project.id);
          return (
            <div
              key={project.id}
              className="project-card stagger-in"
              style={{
                borderLeftColor: getCategoryColor(project.category),
                animationDelay: `${i * 100}ms`,
              }}
              onClick={() => toggleExpand(project.id)}
            >
              <div className="project-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="project-card-name">{project.title}</span>
                  {project.badge && (
                    <span
                      className="project-badge"
                      style={{ color: project.badgeColor, border: `1px solid ${project.badgeColor}` }}
                    >
                      {project.badge}
                    </span>
                  )}
                </div>
                <span className={`project-card-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
              </div>
              <div className="project-card-subtitle">{project.subtitle}</div>

              {isExpanded && (
                <div className="project-card-details">
                  <div className="project-card-desc">{project.description}</div>
                  <div className="project-card-stack">
                    {project.tags.map(tag => (
                      <span key={tag} className="stack-pill">{tag}</span>
                    ))}
                  </div>
                  <div className="project-card-actions">
                    <a
                      className="project-btn"
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      ⬡ GitHub
                    </a>
                    {project.liveLink && project.liveLink !== '#' && (
                      <a
                        className="project-btn"
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        ↗ Live Demo
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
