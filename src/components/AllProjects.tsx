import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveLink: string;
  githubLink: string;
}

const AllProjects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "Survival Pattern Discovery in Titanic Datase",
      description: "Performed exploratory data analysis on the Titanic dataset using Pandas and Matplotlib, including data cleaning, feature engineering, and visualizations to uncover key survival trends.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      tags: ["Python", "Pandas","Matplotlib"],
      liveLink: "#",
      githubLink: "https://github.com/ayussh176/Titanic-data-analysis.git"
    },
    {
      id: 2,
      title: "PatientKhata",
      description: "A web application for hostpials especially doctor where they can keep the data of patients and which get store in the data base",
      image: "doctor.jpg",
      tags: ["React", "Node.js", "Firebase", "versal"],
      liveLink: "#",
      githubLink: "https://github.com/ayussh176/clinic-data-center.git"
    },
    {
      id: 3,
      title: "Expense Tracker App",
      description: "A mobile-responsive web app to track personal expenses with visualization and categorization features.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      tags: ["JavaScript", "Chart.js", "Bootstrap", "Firebase"],
      liveLink: "#",
      githubLink: "https://github.com/ayussh176/Expense_tracker.git"
    },
    {
      id: 4,
      title: "Weather Forecast Dashboard",
      description: "A weather application that provides current and forecasted weather data using external APIs.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      tags: ["HTML/CSS", "JavaScript", "API Integration"],
      liveLink: "#",
      githubLink: "https://github.com/ayussh176/weather.git"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold font-mono text-purple-600 mb-2">All Projects</h2>
          <p className="text-gray-600 dark:text-gray-300">Here’s a complete list of my development projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600 dark:text-gray-300">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                    <Github className="mr-2" size={18} />
                    Code
                  </Button>
                </a>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
                    <LinkIcon className="mr-2" size={18} />
                    Demo
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/">
            <Button className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AllProjects;
