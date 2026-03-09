import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestionsByQuiz,
  updateQuestion,
} from "../controllers/questionController.js";
import { authorizeRoles, protect } from "../middlewares/auth.js";
import { validateObjectIdParam } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(protect);

router.get("/quizzes/:quizId/questions", validateObjectIdParam("quizId"), getQuestionsByQuiz);
router.post(
  "/quizzes/:quizId/questions",
  validateObjectIdParam("quizId"),
  authorizeRoles("admin"),
  createQuestion
);
router.put("/questions/:id", validateObjectIdParam("id"), authorizeRoles("admin"), updateQuestion);
router.delete("/questions/:id", validateObjectIdParam("id"), authorizeRoles("admin"), deleteQuestion);

export default router;