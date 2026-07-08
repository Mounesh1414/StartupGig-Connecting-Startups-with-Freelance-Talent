import { Router } from "express";
import {
  freelancerTrustScore,
  projectAnalyzer,
  proposalGenerator,
  resumeAnalyzer,
  skillGap,
  smartMatch,
  startupHealthScore,
  teamBuilder
} from "../controllers/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/smart-match", requireAuth, smartMatch);
router.get("/startup-health/:id", requireAuth, startupHealthScore);
router.get("/freelancer-trust/:id", requireAuth, freelancerTrustScore);
router.post("/project-analyzer", requireAuth, projectAnalyzer);
router.post("/resume-analyzer", requireAuth, resumeAnalyzer);
router.post("/team-builder", requireAuth, teamBuilder);
router.post("/skill-gap", requireAuth, skillGap);
router.post("/proposal-generator", requireAuth, proposalGenerator);

export default router;
