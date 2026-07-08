import { Router } from "express";
import { applyToProject, myApplications } from "../controllers/applicationController.js";
import { allowRoles, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", requireAuth, allowRoles("freelancer"), applyToProject);
router.get("/my", requireAuth, allowRoles("freelancer"), myApplications);

export default router;
