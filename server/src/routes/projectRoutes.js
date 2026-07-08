import { Router } from "express";
import {
  createProject,
  getProjectById,
  getStartupDashboard,
  listProjects
} from "../controllers/projectController.js";
import { allowRoles, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listProjects);
router.get("/dashboard/startup", requireAuth, allowRoles("startup"), getStartupDashboard);
router.get("/:id", getProjectById);
router.post("/", requireAuth, allowRoles("startup", "admin"), createProject);

export default router;

