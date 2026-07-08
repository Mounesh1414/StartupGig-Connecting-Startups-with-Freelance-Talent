import { Link, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartupDashboard from "./pages/StartupDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Freelancers from "./pages/Freelancers";
import MyApplications from "./pages/MyApplications";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Payments from "./pages/Payments";
import Admin from "./pages/Admin";
import { useAuth } from "./hooks/useAuth";

const Guard = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const Nav = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="brand">StartupGig</div>
      <nav>
        <Link to="/projects">Projects</Link>
        <Link to="/freelancers">Freelancers</Link>
        {user?.role === "startup" && <Link to="/dashboard/startup">Startup Dashboard</Link>}
        {user?.role === "freelancer" && <Link to="/dashboard/freelancer">Freelancer Dashboard</Link>}
        {user?.role === "freelancer" && <Link to="/applications">My Applications</Link>}
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/payments">Payments</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <button onClick={logout} className="btn-outline">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <div className="app-shell">
      <Nav />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route
            path="/dashboard/startup"
            element={
              <Guard roles={["startup"]}>
                <StartupDashboard />
              </Guard>
            }
          />
          <Route
            path="/dashboard/freelancer"
            element={
              <Guard roles={["freelancer"]}>
                <FreelancerDashboard />
              </Guard>
            }
          />
          <Route
            path="/applications"
            element={
              <Guard roles={["freelancer"]}>
                <MyApplications />
              </Guard>
            }
          />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/payments" element={<Payments />} />
          <Route
            path="/admin"
            element={
              <Guard roles={["admin"]}>
                <Admin />
              </Guard>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
