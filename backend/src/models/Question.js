import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: "Question must have at least 2 options",
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

questionSchema.pre("validate", function () {
  if (!Array.isArray(this.options)) {
    return;
  }

  if (this.correctAnswerIndex < 0 || this.correctAnswerIndex >= this.options.length) {
    this.invalidate("correctAnswerIndex", "correctAnswerIndex is out of range");
  }
});

export const Question = mongoose.model("Question", questionSchema);