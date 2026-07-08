import { Router } from "express";
import { freelancerDashboard, listFreelancers } from "../controllers/freelancerController.js";
import { allowRoles, requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listFreelancers);
router.get("/dashboard", requireAuth, allowRoles("freelancer"), freelancerDashboard);

export default router;
