import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Download } from 'lucide-react';

const sections = ["home", "about", "coding-platforms", "skills", "projects", "contact"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = "/Ayush Resume.pdf";
    link.download = "Ayush_malik_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4, rootMargin: "-80px 0px -40%" }
    );

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const navClasses = scrolled
    ? "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm shadow-md z-50 transition-all duration-300"
    : "fixed top-0 left-0 right-0 bg-transparent z-50 transition-all duration-300";

  const linkClasses = (id: string) =>
    `px-4 py-2 rounded-md transition-all font-medium ${
      activeSection === id
        ? "bg-purple-600/20 text-purple-500 shadow-md"
        : "text-foreground hover:bg-muted hover:text-purple-500"
    }`;

  return (
    <header className={navClasses}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-xl font-mono font-bold text-primary">
          <span className="text-primary">Ayush Malik</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {sections.map((id) => (
            <a key={id} href={`#${id}`} className={linkClasses(id)}>
              {id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </a>
          ))}
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={handleResumeDownload}
          >
            Resume <Download size={16} className="ml-2" />
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground p-2" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {sections.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={linkClasses(id)}
                onClick={toggleMenu}
              >
                {id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </a>
            ))}
            <Button
              variant="default"
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              onClick={handleResumeDownload}
            >
              Resume
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;