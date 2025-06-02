
import { Code, BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-mono">
            About <span className="text-purple-600">Me</span>
          </h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Get to know more about me, my background, and what drives me.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-bold mb-4 font-mono">My Journey</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              I'm a passionate and dedicated CSE student currently in my 3rd year of B.Tech. 
              My journey in tech started with a curiosity about how computers work, which led me 
              to explore programming and software development.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              During my academic journey, I've developed a strong foundation in core Computer Science 
              concepts while working on various projects that helped me apply theoretical knowledge to 
              real-world problems. I'm particularly interested in web development, artificial intelligence, 
              and building scalable applications.
            </p>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
              <h4 className="text-xl font-bold mb-3 font-mono">Education</h4>
              <div className="flex items-start mb-4">
                <div className="mr-4 mt-1">
                  <GraduationCap className="text-purple-600" size={24} />
                </div>
                <div>
                  <h5 className="font-bold">Bachelor of Technology in Computer Science</h5>
                  <p className="text-gray-600 dark:text-gray-300">Shri Ramdeobaba college of Engineering and managment, 2023-2027</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current CGPA: 9.0/10</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
                <div>
                  <h5 className="font-bold">Higher Secondary Education</h5>
                  <p className="text-gray-600 dark:text-gray-300">Sarosh Jr college, 2021-2023</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Percentage: 81%</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
                <div>
                  <h5 className="font-bold">Senior Secondary Education</h5>
                  <p className="text-gray-600 dark:text-gray-300">St. Lawrence High School, 2020-2021</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Percentage: 87.80%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <Code className="text-purple-600" size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Problem Solver</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    I enjoy tackling complex problems and finding efficient solutions through code.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Continuous Learner</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Always exploring new technologies and expanding my knowledge base.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow sm:col-span-2">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold mb-2">Personal Interests</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Beyond coding, I enjoy:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full text-sm text-center">
                      Open Source
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full text-sm text-center">
                      Exploring New stuffs
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full text-sm text-center">
                      Hackathons
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full text-sm text-center">
                      Photography
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
