import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validateQuestionPayload = ({ content, options, correctAnswerIndex }) => {
  if (!content?.trim()) {
    throw new ApiError(400, "Question content is required");
  }

  if (!Array.isArray(options) || options.length < 2) {
    throw new ApiError(400, "Question must have at least 2 options");
  }

  if (
    !Number.isInteger(correctAnswerIndex) ||
    correctAnswerIndex < 0 ||
    correctAnswerIndex >= options.length
  ) {
    throw new ApiError(400, "correctAnswerIndex is invalid");
  }
};


const sanitizeQuestion = (question, includeCorrectAnswer = false) => { 
  if (includeCorrectAnswer) {
    return question;
  }

  const plain = question.toObject(); // Chuyển question thành object
  delete plain.correctAnswerIndex;  // Xóa đáp án đúng khỏi response  
  return plain;
};

// Sử dụng asyncHandler để đẩy lỗi qua 1 Error Middleware 
export const getQuestionsByQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  if (req.user.role !== "admin" && !quiz.isPublished) {
    throw new ApiError(403, "Forbidden: quiz is not published");
  }

  const questions = await Question.find({ quizId: req.params.quizId }).sort({ createdAt: 1 });
  const data = questions.map((q) => sanitizeQuestion(q, req.user.role === "admin"));

  return res.status(200).json({
    success: true,
    message: "Questions fetched",
    data,
  });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const payload = {
    content: req.body.content,
    options: req.body.options,
    correctAnswerIndex: req.body.correctAnswerIndex,
  };

  validateQuestionPayload(payload);

  const question = await Question.create({
    quizId: req.params.quizId,
    content: payload.content.trim(),
    options: payload.options.map((option) => option.trim()),
    correctAnswerIndex: payload.correctAnswerIndex,
  });

  return res.status(201).json({
    success: true,
    message: "Question created",
    data: question,
  });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const existing = await Question.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, "Question not found");
  }

  const nextPayload = {
    content: req.body.content ?? existing.content,
    options: req.body.options ?? existing.options,
    correctAnswerIndex: req.body.correctAnswerIndex ?? existing.correctAnswerIndex,
  };

  validateQuestionPayload(nextPayload);

  existing.content = nextPayload.content.trim();
  existing.options = nextPayload.options.map((option) => option.trim());
  existing.correctAnswerIndex = nextPayload.correctAnswerIndex;
  await existing.save();

  return res.status(200).json({
    success: true,
    message: "Question updated",
    data: existing,
  });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  return res.status(200).json({
    success: true,
    message: "Question deleted",
    data: null,
  });
});