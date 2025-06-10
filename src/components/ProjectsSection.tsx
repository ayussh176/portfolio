import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectsSection = () => {
  const navigate = useNavigate();
  const projects = [
    {
      id: 1,
      title: "Bangaluru House Price Prediction",
      description: "A responsive web app that predicts the house prices in Banagaluru using some basic inputs.",
      image: "house.png",
      tags: ["Regression Model", "Flask", "HTML", "CSS", "JavaScript"],
      liveLink: "https://house-price-qcwb.onrender.com/",
      githubLink: "https://github.com/ayussh176/house-price-prediction"
    },
    {
      id: 2,
      title: "PatientKhata",
      description: "A web application for hostpials especially doctor where they can keep the data of patients and which get store in the data base",
      image: "doctor.jpg",
      tags: ["React", "Node.js", "Firebase", "netlify"],
      liveLink: "https://patientkhata.netlify.app/",
      githubLink: "https://github.com/ayussh176/clinic-data-center.git"
    },
    {
      id: 3,
      title: "Survival Pattern Discovery in Titanic Datase",
      description: "Performed exploratory data analysis on the Titanic dataset using Pandas and Matplotlib, including data cleaning, feature engineering, and visualizations to uncover key survival trends.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      tags: ["Python", "Pandas","Matplotlib"],
      liveLink: "#",
      githubLink: "https://github.com/ayussh176/Titanic-data-analysis.git"
    },
    {
      id: 4,
      title: "ProductivityHub - Todo List Application",
      description: "A simple and intuitive application to manage daily tasks with features like adding, editing, and deleting tasks. it also include adding notes and Planner. with secure login and signup.",
      image: "to do list.jpeg",
      tags: ["HTML/CSS", "JavaScript", "React.js", "Firebase"],
      liveLink: "https://to-do-list176.netlify.app/",
      githubLink: "https://github.com/ayussh176/To-do-list.git"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-mono">
            My <span className="text-purple-600">Projects</span>
          </h2>
          <div className="h-1 w-20 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Here are some of the projects I've worked on during my academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className="border-purple-100 dark:border-purple-800 overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="font-mono">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-3"
                  >
                    <Github size={18} className="mr-2" />
                    Code
                  </Button>
                </a>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-3"
                  >
                    <Link size={18} className="mr-2" />
                    Demo
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate("/all-projects")}
          >
            View All Projects <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
