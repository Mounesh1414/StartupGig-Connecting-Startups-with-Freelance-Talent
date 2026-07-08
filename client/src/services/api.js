import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("startupgig_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: async (payload) => (await api.post("/auth/login", payload)).data,
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  me: async () => (await api.get("/auth/me")).data
};

export const projectAPI = {
  list: async () => (await api.get("/projects")).data,
  details: async (id) => (await api.get(`/projects/${id}`)).data,
  create: async (payload) => (await api.post("/projects", payload)).data,
  startupDashboard: async () => (await api.get("/projects/dashboard/startup")).data
};

export const freelancerAPI = {
  list: async () => (await api.get("/freelancers")).data,
  dashboard: async () => (await api.get("/freelancers/dashboard")).data
};

export const applicationAPI = {
  apply: async (payload) => (await api.post("/applications", payload)).data,
  mine: async () => (await api.get("/applications/my")).data
};

export const aiAPI = {
  analyzeProject: async (description) =>
    (await api.post("/ai/project-analyzer", { description })).data,
  resumeAnalyze: async (resumeText) =>
    (await api.post("/ai/resume-analyzer", { resumeText })).data,
  teamBuilder: async (requiredSkills) =>
    (await api.post("/ai/team-builder", { requiredSkills })).data,
  skillGap: async (projectSkills, freelancerSkills) =>
    (await api.post("/ai/skill-gap", { projectSkills, freelancerSkills })).data,
  proposal: async (payload) => (await api.post("/ai/proposal-generator", payload)).data
};
