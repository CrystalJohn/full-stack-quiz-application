import mongoose from "mongoose";
import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  if (req.user.role !== "admin" && !quiz.isPublished) {
    throw new ApiError(403, "Forbidden: quiz is not published");
  }

  const questions = await Question.find({ quizId: id }).sort({ createdAt: 1 });
  if (!questions.length) {
    throw new ApiError(400, "Quiz has no questions");
  }

  const incomingAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

  const answerMap = new Map();
  for (const answer of incomingAnswers) {
    if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
      continue;
    }
    answerMap.set(answer.questionId.toString(), answer.selectedIndex);
  }

  const details = questions.map((question) => {
    const selectedIndex = answerMap.get(question._id.toString());
    const isCorrect = selectedIndex === question.correctAnswerIndex;

    return {
      questionId: question._id,
      selectedIndex: Number.isInteger(selectedIndex) ? selectedIndex : null,
      correctAnswerIndex: question.correctAnswerIndex,
      isCorrect,
    };
  });

  const score = details.filter((item) => item.isCorrect).length;

  return res.status(200).json({
    success: true,
    message: "Quiz submitted",
    data: {
      score,
      total: questions.length,
      details,
    },
  });
});