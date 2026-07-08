import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">AI-powered startup hiring</p>
        <h1>Hire startup-ready freelancers in hours, not weeks.</h1>
        <p>
          StartupGig combines AI smart matching, trust scoring, and project intelligence to help
          founders build high-performing freelance teams fast.
        </p>
        <div className="hero-actions">
          <Link to="/projects" className="btn-primary">
            Explore Projects
          </Link>
          <Link to="/register" className="btn-outline">
            Join StartupGig
          </Link>
        </div>
      </div>
      <div className="hero-card">
        <h3>AI Match Snapshot</h3>
        <ul>
          <li>Frontend Skills: 95%</li>
          <li>React Experience: 92%</li>
          <li>Budget Match: 90%</li>
          <li>Availability: 98%</li>
          <li>Overall Match: 94%</li>
        </ul>
        <hr />
        <h4>What Makes StartupGig Different</h4>
        <ul>
          <li>Explainable matching with confidence and hiring lane</li>
          <li>Execution risk radar before you hire</li>
          <li>AI project analyzer with milestones and delivery model</li>
          <li>Freelancer 90-day skill acceleration roadmap</li>
        </ul>
      </div>
    </section>
  );
};

export default Home;
