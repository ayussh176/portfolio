import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../os/WindowManager';

interface LineItem {
  type: 'h1' | 'h2' | 'check' | 'focus';
  text: string;
}

const MARKDOWN_LINES: LineItem[] = [
  { type: 'h1', text: 'Why Hire Ayush Malik' },
  { type: 'h2', text: 'Technical Strengths' },
  { type: 'check', text: 'AI & Machine Learning' },
  { type: 'check', text: 'Full Stack Development' },
  { type: 'check', text: 'Firebase & Cloud Development' },
  { type: 'check', text: 'Problem Solving' },
  { type: 'check', text: 'Prompt Engineering' },
  { type: 'h2', text: 'Proven Results' },
  { type: 'check', text: '500+ LeetCode Problems Solved' },
  { type: 'check', text: 'Built AttendX — AI attendance using YOLOv11, DeepFace, ArcFace' },
  { type: 'check', text: 'Built PatientKhata — Healthcare platform with RBAC architecture' },
  { type: 'check', text: 'Built KissanKhata — Agri-distributor management platform' },
  { type: 'check', text: 'Internship Experience — Software Development Intern' },
  { type: 'h2', text: 'Work Ethic' },
  { type: 'check', text: 'Fast Learner' },
  { type: 'check', text: 'Strong Ownership' },
  { type: 'check', text: 'Build End-to-End Products' },
  { type: 'check', text: 'Production Deployment Experience' },
  { type: 'h2', text: 'Current Focus' },
  { type: 'focus', text: 'AI Engineering · Generative AI · Full Stack Systems · Cloud Development' }
];

const SCORES = [
  { label: 'Problem Solving', max: 92, blocks: 10 },
  { label: 'AI/ML          ', max: 88, blocks: 9 },
  { label: 'Full Stack     ', max: 86, blocks: 9 },
  { label: 'Communication  ', max: 82, blocks: 8 },
  { label: 'Learning Ability', max: 95, blocks: 10 }
];

export default function WhyHireMeWindow() {
  const { openWindow } = useWindowManager();
  const [visibleCount, setVisibleCount] = useState(0);
  const [startTerminal, setStartTerminal] = useState(false);
  const [terminalPhase, setTerminalPhase] = useState<'prompt' | 'running' | 'done'>('prompt');
  const [scoreProgress, setScoreProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // Staggered Markdown line typing animation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < MARKDOWN_LINES.length) {
        setVisibleCount(prev => prev + 1);
        current++;
        // Auto-scroll as content types
        if (mainRef.current) {
          mainRef.current.scrollTop = mainRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        // Start terminal part after markdown is done
        setTimeout(() => setStartTerminal(true), 400);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // Terminal candidate_score.sh animation
  useEffect(() => {
    if (!startTerminal) return;

    // Phase 1: show running command
    const t1 = setTimeout(() => {
      setTerminalPhase('running');
      
      // Phase 2: fill bars from zero
      let start: number | null = null;
      const duration = 1200; // 1.2s bar animation

      const animateBars = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setScoreProgress(progress);
        
        if (mainRef.current) {
          mainRef.current.scrollTop = mainRef.current.scrollHeight;
        }

        if (progress < 1) {
          requestAnimationFrame(animateBars);
        } else {
          setTerminalPhase('done');
        }
      };
      requestAnimationFrame(animateBars);
    }, 800);

    return () => clearTimeout(t1);
  }, [startTerminal]);

  const makeBar = (max: number, blocks: number) => {
    const currentPct = Math.round(max * scoreProgress);
    const filled = Math.round(blocks * scoreProgress);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty) + `  ${currentPct}%`;
  };

  const handleDownloadResume = () => {
    openWindow('resume.pdf');
    // Dispatch custom event to trigger the download animation in ResumeWindow
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('ayush:download-resume-action'));
    }, 450);
  };

  return (
    <div className="hire-me-container flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Scrollable Markdown Area */}
      <div ref={mainRef} className="flex-1 overflow-y-auto p-5 scroll-smooth">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {MARKDOWN_LINES.slice(0, visibleCount).map((line, i) => {
            if (line.type === 'h1') {
              return (
                <h1 key={i} className="text-xl md:text-2xl font-bold border-b border-slate-700 pb-2 text-teal-400 animate-fade-in-up">
                  # {line.text}
                </h1>
              );
            }
            if (line.type === 'h2') {
              return (
                <h2 key={i} className="text-md md:text-lg font-semibold text-teal-300 mt-6 animate-fade-in-up">
                  ## {line.text}
                </h2>
              );
            }
            if (line.type === 'check') {
              return (
                <div key={i} className="flex items-start gap-2 text-sm md:text-base text-slate-300 ml-4 animate-fade-in-up">
                  <span className="text-teal-400 font-bold">✓</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'focus') {
              return (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-300 ml-4 animate-fade-in-up">
                  {line.text}
                </div>
              );
            }
            return null;
          })}

          {/* Terminal output console */}
          {startTerminal && (
            <div className="mt-8 border border-slate-800 bg-black/80 rounded-lg p-4 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                <span className="text-slate-500 text-[10px] ml-2">candidate_score.sh</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="text-teal-400">ayush@portfolio ~ $</span>
                  <span className="ml-2">./candidate_score.sh</span>
                </div>

                {(terminalPhase === 'running' || terminalPhase === 'done') && (
                  <div className="pt-2 space-y-1 text-teal-300">
                    {SCORES.map((s, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                        <span className="text-slate-400 w-36">{s.label}:</span>
                        <span>{makeBar(s.max, s.blocks)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {terminalPhase === 'running' && (
                  <div className="animate-pulse text-slate-500 pt-1">Analyzing metrics...</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating/Bottom CTA Bar */}
      <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-md p-4 flex gap-4 justify-center items-center flex-shrink-0">
        <button
          onClick={() => openWindow('contact.sh')}
          className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-semibold text-xs md:text-sm shadow-lg shadow-teal-500/10 transition-all"
        >
          📅 Schedule Interview
        </button>
        <button
          onClick={handleDownloadResume}
          className="px-5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 hover:border-slate-600 active:scale-95 text-slate-300 font-semibold text-xs md:text-sm transition-all"
        >
          📄 Download Resume
        </button>
      </div>
    </div>
  );
}
