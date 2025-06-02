
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Download } from 'lucide-react';

const Navbar = () => {
  const handleResumeDownload = () => {
    // Create a link element
    const link = document.createElement('a');
    // Set the href to the path of your PDF file
    link.href = "/Ayush Resume.pdf";
    // Set the download attribute with a filename
    link.download = "Ayush_malik_Resume.pdf";
    // Append to the document
    document.body.appendChild(link);
    // Trigger the click event
    link.click();
    // Clean up
    document.body.removeChild(link);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navClasses = scrolled 
    ? "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm shadow-md z-50 transition-all duration-300" 
    : "fixed top-0 left-0 right-0 bg-transparent z-50 transition-all duration-300";

  return (
    <header className={navClasses}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-xl font-mono font-bold text-primary">
          <span className="text-primary">Ayush Malik</span>
          <span className="text-purple-500"> | CSE</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-foreground hover:text-purple-500 transition-colors">Home</a>
          <a href="#about" className="text-foreground hover:text-purple-500 transition-colors">About</a>
          <a href="#skills" className="text-foreground hover:text-purple-500 transition-colors">Skills</a>
          <a href="#projects" className="text-foreground hover:text-purple-500 transition-colors">Projects</a>
          <a href="#contact" className="text-foreground hover:text-purple-500 transition-colors">Contact</a>
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
            <a href="#home" className="text-foreground hover:text-purple-500 py-2 transition-colors" onClick={toggleMenu}>Home</a>
            <a href="#about" className="text-foreground hover:text-purple-500 py-2 transition-colors" onClick={toggleMenu}>About</a>
            <a href="#skills" className="text-foreground hover:text-purple-500 py-2 transition-colors" onClick={toggleMenu}>Skills</a>
            <a href="#projects" className="text-foreground hover:text-purple-500 py-2 transition-colors" onClick={toggleMenu}>Projects</a>
            <a href="#contact" className="text-foreground hover:text-purple-500 py-2 transition-colors" onClick={toggleMenu}>Contact</a>
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white w-full">Resume</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
