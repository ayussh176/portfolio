
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const SkillsSection = () => {
  const programmingLanguages = [
    { name: "Python", level: 85 },
    { name: "Java", level: 85 },
    { name: "C", level: 80 },
  ];
  
  const webTechnologies = [
    { name: "React", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "HTML/CSS", level: 90 },
    { name: "Express.js", level: 70 },
  ];
  const otherSkills = [
    "Git & GitHub","SQL", "Data Structures", 
    "Algorithms", "Problem Solving", "Agile Methodology","Data Science","Data Analytics",
    "Linux", "Machine Learning Basics", "AWS Basics","flask"
  ];

  return (
    <section id="skills" className="py-20 bg-purple-50 dark:bg-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-mono">
            My <span className="text-purple-600">Skills</span>
          </h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Here are the technologies and tools I work with.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold mb-6 font-mono">Programming Languages</h3>
            <div className="space-y-6">
              {programmingLanguages.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <Progress 
                    value={skill.level} 
                    className="h-2 bg-purple-100 dark:bg-purple-900/30 [&>div]:bg-purple-600" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-6 font-mono">Web Technologies</h3>
            <div className="space-y-6">
              {webTechnologies.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <Progress 
                    value={skill.level} 
                    className="h-2 bg-purple-100 dark:bg-purple-900/30 [&>div]:bg-purple-600" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-bold mb-6 text-center font-mono">Other Skills & Tools</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {otherSkills.map((skill) => (
              <Badge key={skill} variant="secondary" 
                className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 
                        text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-800">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-600 dark:text-gray-300 italic">
            "I believe in continuous learning and staying updated with the latest technologies."
          </p>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
