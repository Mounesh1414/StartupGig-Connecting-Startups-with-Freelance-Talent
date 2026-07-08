import { useEffect, useState } from "react";
import { freelancerAPI } from "../services/api";

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    freelancerAPI.list().then(setFreelancers).catch(() => setFreelancers([]));
  }, []);

  return (
    <section>
      <h1>Top Freelancers</h1>
      <div className="grid-cards">
        {freelancers.map((freelancer) => (
          <article key={freelancer._id} className="panel">
            <h3>{freelancer.name}</h3>
            <p>Trust Score: {freelancer.trustScore}</p>
            <p>Rating: {freelancer.averageRating}</p>
            <div className="pill-row">
              {freelancer.skills?.map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Freelancers;
