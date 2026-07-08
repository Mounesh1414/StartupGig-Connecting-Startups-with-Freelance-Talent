import { useEffect, useState } from "react";
import { applicationAPI } from "../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    applicationAPI.mine().then(setApplications).catch(() => setApplications([]));
  }, []);

  return (
    <section>
      <h1>My Applications</h1>
      <div className="grid-cards">
        {applications.map((application) => (
          <article key={application._id} className="panel">
            <h3>{application.project?.title}</h3>
            <p>Status: {application.status}</p>
            <p>Proposed Budget: ${application.proposedBudget}</p>
            <p>AI Match Score: {application.aiMatchScore}%</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MyApplications;
