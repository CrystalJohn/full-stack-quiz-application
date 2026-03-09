import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getQuizzes = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { isPublished: true };
  const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Quizzes fetched",
    data: quizzes,
  });
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  if (req.user.role !== "admin" && !quiz.isPublished) {
    throw new ApiError(403, "Forbidden: quiz is not published");
  }

  return res.status(200).json({
    success: true,
    message: "Quiz fetched",
    data: quiz,
  });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const { title, description = "", isPublished = true } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Quiz title is required");
  }

  const quiz = await Quiz.create({
    title: title.trim(),
    description: description?.trim() || "",
    isPublished,
  });

  return res.status(201).json({
    success: true,
    message: "Quiz created",
    data: quiz,
  });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  if (title !== undefined && !title?.trim()) {
    throw new ApiError(400, "Quiz title cannot be empty");
  }

  const update = {};
  if (title !== undefined) update.title = title.trim();
  if (description !== undefined) update.description = description?.trim() || "";
  if (isPublished !== undefined) update.isPublished = Boolean(isPublished);

  const quiz = await Quiz.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  return res.status(200).json({
    success: true,
    message: "Quiz updated",
    data: quiz,
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  await Question.deleteMany({ quizId: req.params.id });

  return res.status(200).json({
    success: true,
    message: "Quiz deleted",
    data: null,
  });
});