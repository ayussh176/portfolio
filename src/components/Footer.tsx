
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <a href="#" className="text-xl font-mono font-bold text-primary">
              <span className="text-primary">Ayush Malik</span>
            </a>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              B.Tech CSE Student & Aspiring Developer
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-6 mb-4">
              <a href="https://github.com/ayussh176" target="_blank" rel="noopener noreferrer" 
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/ayush-malik-b864432b2/" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:ayushmalik852@gmail.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                <Mail size={20} />
              </a>

            </div>
            
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <nav className="flex justify-center flex-wrap gap-x-8 gap-y-4">
            <a href="#home" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">Home</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">About</a>
            <a href="#skills" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">Skills</a>
            <a href="#projects" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">Projects</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
