
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { Download } from 'lucide-react';


const HeroSection = () => {

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

    return (
    <section id="home" className="min-h-screen flex items-center pt-16 pb-16 bg-gradient-to-b from-background to-purple-50 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 animate-fade-in">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
                B.Tech CSE Student • 3rd Year
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-mono">
                Hi, I'm <span className="text-purple-600">Ayush Malik</span>
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
                Aspiring Software Developer & Problem Solver
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                I'm passionate about building innovative solutions through code. 
                Currently pursuing my Bachelor's in Computer Science Engineering, 
                focusing on Data Science, Machine learning and Web Development.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={scrollToProjects}
              >
                Explore Projects <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={scrollToContact}
              >
                Contact Me <ArrowRight size={16} className="ml-2" />
              </Button>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0 md:ml-4">
                <a href="https://github.com/ayussh176" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/ayush-malik-b864432b2/" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="md:w-2/5 mt-12 md:mt-0 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-purple-600 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                <img 
                  src="profile.jpg" 
                  alt="Ayush Malik" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                <div className="text-sm font-medium">
                  <span className="text-purple-600">{'<code>'}</span> Hello, World! <span className="text-purple-600">{'</code>'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
