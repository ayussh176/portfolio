import { Briefcase, Calendar, MapPin, Badge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const experiences = [
  {
    id: 1,
    role: "Frontend Developer Intern",
    company: "TechNova Solutions",
    location: "Remote",
    type: "Internship",
    startDate: "Jun 2024",
    endDate: "Sep 2024",
    description: [
      "Built responsive UI components using React, TypeScript, and Tailwind CSS.",
      "Collaborated with designers to implement pixel-perfect layouts and animations.",
      "Improved page performance and accessibility across major browsers."
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Git"]
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "CodeCraft Labs",
    location: "Nagpur, India",
    type: "Part-time",
    startDate: "Jan 2023",
    endDate: "Dec 2023",
    description: [
      "Developed REST APIs for a retail management system using Node.js and Express.",
      "Integrated PostgreSQL/MongoDB databases and wrote optimized queries.",
      "Implemented authentication and role-based access for admin and customers."
    ],
    techStack: ["Node.js", "Express", "PostgreSQL", "MongoDB", "JWT"]
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-mono">
            My <span className="text-purple-600">Experience</span>
          </h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">
            A glimpse into my professional background and career journey.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.2}s` }}
            >
              <Card className="border-purple-100 dark:border-purple-800 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="text-purple-600" size={20} />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {exp.role}
                        </h3>
                      </div>
                      <p className="text-lg font-semibold text-purple-600 mb-2">
                        {exp.company}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge size={16} />
                          <span>{exp.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {exp.description.map((desc, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                        >
                          <span className="text-purple-600 font-bold mt-1">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;