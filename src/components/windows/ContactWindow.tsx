import { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useToast } from '@/components/ui/use-toast';

const TERMINAL_LINES = [
  { text: '$ ./contact.sh --open-channel', type: 'prompt' },
  { text: '[INFO] Establishing connection...', type: 'info' },
  { text: '[INFO] Routing to ayushmalik852@gmail.com...', type: 'info' },
  { text: '[OK]   Channel open. Ready to receive.', type: 'ok' },
  { text: '', type: 'blank' },
  { text: 'email    →  ayushmalik852@gmail.com', type: 'link', href: 'mailto:ayushmalik852@gmail.com' },
  { text: 'github   →  github.com/ayussh176', type: 'link', href: 'https://github.com/ayussh176' },
  { text: 'linkedin →  linkedin.com/in/ayush-malik-b864432b2', type: 'link', href: 'https://www.linkedin.com/in/ayush-malik-b864432b2/' },
  { text: 'resume   →  ./resume.pdf  [⬇ download]', type: 'download', href: '/Resume_AyushMalik.pdf' },
  { text: '', type: 'blank' },
  { text: '[INFO] Response time:  < 24 hours', type: 'info' },
  { text: '[INFO] Status:  ● available for opportunities', type: 'status' },
];

export default function ContactWindow() {
  const { toast } = useToast();
  const [visibleLines, setVisibleLines] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  // Typewriter for terminal lines
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let charCount = 0;
    TERMINAL_LINES.forEach((line, i) => {
      const delay = charCount * 30;
      timers.push(setTimeout(() => setVisibleLines(i + 1), delay));
      charCount += (line.text.length || 1);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // EXACT same EmailJS integration from existing portfolio
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    emailjs.send(
      'service_kbs25zp',
      'template_8bjdfhp',
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      'pyfl-syYnRBSs06NL'
    )
    .then(() => {
      toast({
        title: 'Message sent!',
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setResult('success');
      setSending(false);
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      toast({
        title: 'Failed to send',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      setResult('error');
      setSending(false);
    });
  };

  const renderTerminalLine = (line: typeof TERMINAL_LINES[0], i: number) => {
    if (line.type === 'blank') return <div key={i} style={{ height: 12 }} />;

    if (line.type === 'prompt') {
      return <div key={i} style={{ color: 'var(--teal)' }}>{line.text}</div>;
    }

    if (line.type === 'info') {
      return <div key={i} className="contact-info">{line.text}</div>;
    }

    if (line.type === 'ok') {
      return <div key={i} className="contact-ok">{line.text}</div>;
    }

    if (line.type === 'link') {
      const parts = line.text.split('→');
      return (
        <div key={i}>
          <span className="terminal-key">{parts[0]}→ </span>
          <a
            href={(line as { href: string }).href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {parts[1]?.trim()}
          </a>
        </div>
      );
    }

    if (line.type === 'value') {
      const parts = line.text.split('→');
      return (
        <div key={i}>
          <span className="terminal-key">{parts[0]}→ </span>
          <span style={{ color: 'var(--white)' }}>{parts[1]?.trim()}</span>
        </div>
      );
    }

    if (line.type === 'download') {
      return (
        <div key={i}>
          <span className="terminal-key">resume&nbsp;&nbsp; → &nbsp;</span>
          <a
            href="/Resume_AyushMalik.pdf"
            download="Ayush_Malik_Resume.pdf"
            className="contact-link"
          >
            ./resume.pdf&nbsp; [⬇ download]
          </a>
        </div>
      );
    }

    if (line.type === 'status') {
      return (
        <div key={i}>
          <span className="contact-info">[INFO] Status:  </span>
          <span className="terminal-status-dot" />
          <span style={{ color: 'var(--teal)' }}>available for opportunities</span>
        </div>
      );
    }

    return <div key={i}>{line.text}</div>;
  };

  return (
    <div className="contact-split">
      {/* Left: Terminal */}
      <div className="contact-terminal">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => renderTerminalLine(line, i))}
      </div>

      {/* Right: Form */}
      <div className="contact-form-panel">
        <form onSubmit={handleSubmit}>
          <div className="contact-field">
            <div className="contact-field-label">from_name</div>
            <input
              className="contact-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ayush Malik"
              required
            />
          </div>
          <div className="contact-field">
            <div className="contact-field-label">from_email</div>
            <input
              className="contact-input"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              required
            />
          </div>
          <div className="contact-field">
            <div className="contact-field-label">subject</div>
            <input
              className="contact-input"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can I help you?"
              required
            />
          </div>
          <div className="contact-field">
            <div className="contact-field-label">message</div>
            <textarea
              className="contact-textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            className="contact-submit"
            disabled={sending}
          >
            {sending ? 'executing...' : 'execute send_message()'}
          </button>
        </form>

        {result === 'success' && (
          <div className="contact-success">
            ✓ [OK] Message delivered. I'll be in touch.
          </div>
        )}
        {result === 'error' && (
          <div className="contact-error-msg">
            ✗ [ERROR] Transmission failed. Try again.
          </div>
        )}
      </div>
    </div>
  );
}
