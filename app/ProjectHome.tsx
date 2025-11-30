// ProjectHome.tsx
"use client";
import React from "react";
import Link from "next/link"; // Assuming you are using Next.js for routing

// Define a type for a single project card
interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  tags: string[];
}

// Data for your projects
const PROJECTS: Project[] = [
  {
    id: "hindi-shuffler",
    title: "🔀 Hindi Script Arranger",
    description:
      "A dynamic activity to practice the order of Hindi Swar, Vyanjan, and Matras.",
    icon: "🇮🇳",
    href: "/hindi", // Link to your existing component
    tags: ["React", "TypeScript", "Tailwind CSS", "Education"],
  }
];

// --- Modern Project Card Component ---
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Link
      href={project.href}
      className="block p-6 rounded-2xl bg-white border border-gray-200 shadow-xl 
                 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl 
                 hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-200"
    >
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-4 p-2 bg-indigo-50 rounded-lg">
          {project.icon}
        </span>
        <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
      </div>
      <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

// --- Main Home Component ---
export default function ProjectHome() {
  return (
    <div className="min-h-screen w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
            My Project <span className="text-indigo-600">Showcase</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            A collection of web applications and interactive components built
            with modern technologies.
          </p>
        </header>

        {/* Project Grid */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {/* Template for Adding New Projects */}
            <div
              className="border-4 border-dashed border-gray-300 p-6 rounded-2xl flex items-center justify-center 
                          text-gray-500 transition-colors duration-200 hover:border-indigo-400 hover:text-indigo-600"
            >
              <span className="text-2xl font-semibold">➕ Add New Project</span>
            </div>
          </div>
        </main>

        {/* Footer/Context */}
        <footer className="mt-20 text-center text-sm text-gray-400">
          Managed by Rohit Kr Rajak.
        </footer>
      </div>
    </div>
  );
}
