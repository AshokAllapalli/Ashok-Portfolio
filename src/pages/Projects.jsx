import React, { useState } from 'react';
import {
  ExternalLink,
  Mail,
  GraduationCap,
  Wrench,
  UtensilsCrossed,
  HeartPulse,
  Megaphone,
  Briefcase,
  Users2,
  Link2
} from 'lucide-react';

function Projects() {
  // Add a real screenshot URL to `image` for any project whenever it's ready.
  // Leave it as "" until then — the icon will display automatically.
const projects = [
  {
    id: 1,
    title: "Bounce Cure",
    description:
      "Email verification & marketing automation platform with bulk verification, campaigns, and payment processing.",
    technologies: ["React", "Node.js", "Prisma", "MySQL"],
    link: "https://www.bouncecure.com/",
    image: "/projects/bounce cure.png",
    icon: <Mail className="w-7 h-7" />,
  },
  {
    id: 2,
    title: "School ERP System",
    description:
      "Multi-school SaaS platform for academic and administrative operations with role-based access control.",
    technologies: ["React", "Node.js", "Prisma", "AWS S3"],
    link: "https://www.eduabaccotech.com/",
    image: "/projects/school-1.png",
    icon: <GraduationCap className="w-7 h-7" />,
  },
  {
    id: 3,
    title: "Auto Garage CRM",
    description:
      "Vehicle service & workshop management system with OCR scanning, GPS tracking, and billing.",
    technologies: ["React", "Node.js", "Express", "MySQL"],
    link: "https://themotordesk.com/",
    image: "/projects/autogarage.png",
    icon: <Wrench className="w-7 h-7" />,
  },


  {
    id: 8,
    title: "Client Hub Solutions",
    description:
      "Business website for managing and showcasing client-facing services and solutions.",
    technologies: ["React", "Express", "Node.js"],
    link: "#",
    image: "/projects/CHS.png",
    icon: <Users2 className="w-7 h-7" />,
  },
    {
    id: 7,
    title: "IBS – International Business Solutions",
    description:
      "Corporate business website presenting services, offerings, and company information.",
    technologies: ["React", "Tailwind CSS", "Node.js"],
    link: "#",
    image: "/projects/ibs.png",
    icon: <Briefcase className="w-7 h-7" />,
  },
  {
    id: 9,
    title: "World Connect Leads",
    description:
      "Lead generation business website designed to capture and manage incoming enquiries.",
    technologies: ["React", "Node.js", "REST API"],
    link: "#",
    image: "/projects/wcl.png",
    icon: <Link2 className="w-7 h-7" />,
  },
    {
    id: 4,
    title: "Restaurant Website",
    description:
      "Responsive business website for a restaurant with menu showcase and online enquiry features.",
    technologies: ["React", "Vite", "Tailwind CSS"],
    link: "#",
    image: "", // Change if you have a restaurant image
    icon: <UtensilsCrossed className="w-7 h-7" />,
  },
  {
    id: 5,
    title: "Hospital Website",
    description:
      "Business website for a hospital featuring departments, doctor listings, and appointment enquiries.",
    technologies: ["React", "HTML5", "CSS3"],
    link: "#",
    image: "",
    icon: <HeartPulse className="w-7 h-7" />,
  },
  
  {
    id: 6,
    title: "Email Campaign Marketing",
    description:
      "Marketing website built for running and showcasing email campaign services for clients.",
    technologies: ["React", "Node.js", "SendGrid"],
    link: "https://abaccomarketing.onrender.com",
    image: "",
    icon: <Megaphone className="w-7 h-7" />,
  },
];

  // Tracks which project images failed to load (or were never provided),
  // so we can fall back to the icon instead.
  const [imageFailed, setImageFailed] = useState({});

  const handleImageError = (id) => {
    setImageFailed((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#3c4cfa' }}>
            My Projects
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A collection of my recent work showcasing various technologies and solutions
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const showImage = project.image && !imageFailed[project.id];

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              > 
                {/* Project Image, falls back to icon if missing/broken */}
                <div
                  className="h-42 flex items-center justify-center relative"
                  style={{ backgroundColor: '#3c4cfa' }}
                >
                  {showImage ? (
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={() => handleImageError(project.id)}
                    />
                  ) : (
                    <div className="text-white">
                      {project.icon}
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#3c4cfa' }}>
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: '#3c4cfa' }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 pt-3 border-t border-gray-200">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: '#3c4cfa' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Projects;