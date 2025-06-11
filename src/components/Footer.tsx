import { Github, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-background via-purple-900/30 to-background border-t border-border">
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ayush Malik
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              B.Tech CSE Student passionate about creating innovative solutions and learning new technologies.
            </p>
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <MapPin size={16} />
              <span>India</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: "#home", label: "Home" },
                { href: "#about", label: "About" },
                { href: "#skills", label: "Skills" },
                { href: "#projects", label: "Projects" },
                { href: "#coding-platforms", label: "Coding Platforms" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/Ayush Resume.pdf"
                  className="text-muted-foreground hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                  download
                >
                  Download Resume
                </a>
              </li>
              <li>
                <a
                  href="mailto:ayushmalik852@gmail.com"
                  className="text-muted-foreground hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                >
                  Email Me
                </a>
              </li>
              <li>
                <a
                  href="tel:+919359444688"
                  className="text-muted-foreground hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                >
                  Call Me
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Connect</h4>
            <div className="flex space-x-4">
              {[
                { href: "https://github.com/ayussh176", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/ayush-malik-b864432b2", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:ayushmalik852@gmail.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-muted border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+91 9359444688</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>ayushmalik852@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
            <p>
              © {currentYear} Ayush Malik.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
