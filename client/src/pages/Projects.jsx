import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectAPI } from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectAPI.list().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <section>
      <h1>Startup Projects</h1>
      <div className="grid-cards">
        {projects.map((project) => (
          <article key={project._id} className="panel">
            <p className="badge">{project.industry}</p>
            <h3>{project.title}</h3>
            <p>{project.description.slice(0, 140)}...</p>
            <p>
              Budget: ${project.budgetMin} - ${project.budgetMax}
            </p>
            <Link to={`/projects/${project._id}`} className="btn-outline">
              View Details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
