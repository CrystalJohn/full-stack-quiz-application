import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { User } from "../models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Quiz.deleteMany({}), Question.deleteMany({})]);

  const [adminPasswordHash, userPasswordHash] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("user123", 10),
  ]);

  await User.insertMany([
    { username: "admin", passwordHash: adminPasswordHash, role: "admin" },
    { username: "user", passwordHash: userPasswordHash, role: "user" },
  ]);

  const quiz = await Quiz.create({
    title: "JavaScript Basics",
    description: "Simple JS fundamentals quiz",
    isPublished: true,
  });

  await Question.insertMany([
    {
      quizId: quiz._id,
      content: "Which keyword is used to declare a constant in JavaScript?",
      options: ["let", "var", "const", "define"],
      correctAnswerIndex: 2,
    },
    {
      quizId: quiz._id,
      content: "What is the output type of typeof null?",
      options: ["null", "object", "undefined", "boolean"],
      correctAnswerIndex: 1,
    },
    {
      quizId: quiz._id,
      content: "Who developed the theory of relativity?",
      options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
      correctAnswerIndex: 0,
    },
    {
      quizId: quiz._id,
      content: "What is the symbol for iron on the periodic table?",
      options: ["Fe", "Au", "Ag", "Ir"],
      correctAnswerIndex: 0,
    },
    {
      quizId: quiz._id,
      content: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswerIndex: 0,
    },
    {
      quizId: quiz._id,
      content: "What is the capital of England?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswerIndex: 1,
    },
    {
      quizId: quiz._id,
      content: "What is the capital of Germany?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswerIndex: 2,
    },
    {
      quizId: quiz._id,
      content: "Which method adds an element to the end of an array in JavaScript?",
      options: [".push()", ".pop()", ".shift()", ".unshift()"],
      correctAnswerIndex: 0,
    },
    {
      quizId: quiz._id,
      content: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"],
      correctAnswerIndex: 0,
    },
    {
      quizId: quiz._id,
      content: "Which operator checks both value and type in JavaScript?",
      options: ["==", "===", "=", "!="],
      correctAnswerIndex: 1,
    },
  ]);

  console.log("Seed completed. Users: admin/admin123, user/user123. Quiz: 1, Questions: 10.");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});