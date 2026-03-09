import express from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuizById,
  getQuizzes,
  updateQuiz,
} from "../controllers/quizController.js";
import { submitQuiz } from "../controllers/submissionController.js";
import { authorizeRoles, protect } from "../middlewares/auth.js";
import { validateObjectIdParam } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(protect);

router.get("/", getQuizzes);
router.get("/:id", validateObjectIdParam("id"), getQuizById);
router.post("/", authorizeRoles("admin"), createQuiz);
router.put("/:id", validateObjectIdParam("id"), authorizeRoles("admin"), updateQuiz);
router.delete("/:id", validateObjectIdParam("id"), authorizeRoles("admin"), deleteQuiz);
router.post("/:id/submit", validateObjectIdParam("id"), submitQuiz);

export default router;