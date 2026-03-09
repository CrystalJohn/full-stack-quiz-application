import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout, ProtectedRoute } from "./components/Common.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import QuizListPage from "./pages/QuizListPage.jsx";
import TakeQuizPage from "./pages/TakeQuizPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminQuizzesPage from "./pages/AdminQuizzesPage.jsx";
import AdminQuestionsPage from "./pages/AdminQuestionsPage.jsx";
import AdminArticlesPage from "./pages/AdminArticlesPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quizzes/:id/take" element={<TakeQuizPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminQuizzesPage />} />
          <Route path="quizzes" element={<AdminQuizzesPage />} />
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;