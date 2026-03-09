# Assignment 4 - Full-stack Quiz Application

A full-stack quiz app with:
- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React + Redux Toolkit + React Router + Bootstrap 5
- Authentication: JWT with role-based authorization (`admin`, `user`)

## Project structure (chi tiet tung file)

```text
assignment 4/
|-- .gitignore
|-- package.json
|-- README.md
|-- insomnia_collection.json
|-- backend/
|   |-- .env.example
|   |-- package.json
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- config/
|       |   `-- db.js
|       |-- controllers/
|       |   |-- authController.js
|       |   |-- quizController.js
|       |   |-- questionController.js
|       |   `-- submissionController.js
|       |-- middlewares/
|       |   |-- auth.js
|       |   |-- errorHandler.js
|       |   `-- validateObjectId.js
|       |-- models/
|       |   |-- User.js
|       |   |-- Quiz.js
|       |   `-- Question.js
|       |-- routes/
|       |   |-- authRoutes.js
|       |   |-- quizRoutes.js
|       |   `-- questionRoutes.js
|       |-- seeds/
|       |   `-- seed.js
|       `-- utils/
|           |-- ApiError.js
|           `-- asyncHandler.js
`-- frontend/
    |-- .env.example
    |-- index.html
    |-- package.json
    |-- vite.config.js
    `-- src/
        |-- main.jsx
        |-- App.jsx
        |-- styles.css
        |-- app/
        |   `-- store.js
        |-- components/
        |   `-- Common.jsx
        |-- services/
        |   `-- apiClient.js
        |-- features/
        |   |-- auth/
        |   |   `-- authSlice.js
        |   `-- quizzes/
        |       `-- quizSlice.js
        `-- pages/
            |-- LoginPage.jsx
            |-- RegisterPage.jsx
            |-- QuizListPage.jsx
            |-- TakeQuizPage.jsx
            |-- AdminQuizzesPage.jsx
            `-- NotFoundPage.jsx
```

## File-by-file mo ta

### Root
- `.gitignore`: Bo qua `node_modules`, `dist`, file `.env`.
- `package.json`: Script shortcut chay backend/frontend/seed tu root.
- `README.md`: Huong dan setup, API, smoke test, cau truc project.
- `insomnia_collection.json`: Collection import vao Insomnia de test API nhanh.

### Backend
- `backend/.env.example`: Bien moi truong mau (`PORT`, `MONGO_URI`, `JWT_SECRET`, ...).
- `backend/package.json`: Dependency backend va scripts `dev`, `start`, `seed`.
- `backend/src/server.js`: Diem vao backend, nap env, connect DB, start Express.
- `backend/src/app.js`: Khoi tao app Express, dang ky middleware va route.
- `backend/src/config/db.js`: Ket noi MongoDB bang Mongoose.

#### Controllers
- `authController.js`: `signup`, `login`, `me`; hash password, tao JWT.
- `quizController.js`: CRUD quiz, loc quiz theo role, xoa quiz kem question lien quan.
- `questionController.js`: CRUD question theo quiz, an dap an dung voi user thuong.
- `submissionController.js`: Nhan cau tra loi, cham diem, tra ve `score/total/details`.

#### Middlewares
- `auth.js`: Xac thuc JWT (`protect`) va phan quyen role (`authorizeRoles`).
- `errorHandler.js`: Xu ly loi tap trung + 404 route khong ton tai.
- `validateObjectId.js`: Validate `ObjectId` truoc khi query DB.

#### Models
- `User.js`: Schema user (`username`, `passwordHash`, `role`).
- `Quiz.js`: Schema quiz (`title`, `description`, `isPublished`).
- `Question.js`: Schema question (`quizId`, `content`, `options`, `correctAnswerIndex`).

#### Routes
- `authRoutes.js`: Route `/api/auth/*`.
- `quizRoutes.js`: Route `/api/quizzes/*` + submit.
- `questionRoutes.js`: Route question long trong `/api/quizzes/:quizId/questions` va `/api/questions/:id`.

#### Others
- `seeds/seed.js`: Tao du lieu mau (admin/user, quiz, questions).
- `utils/ApiError.js`: Class loi tuy chinh co `statusCode`.
- `utils/asyncHandler.js`: Wrapper bat loi async de giam try/catch lap lai.

### Frontend
- `frontend/.env.example`: API base URL cho Vite (`VITE_API_BASE_URL`).
- `frontend/index.html`: HTML shell cua app React.
- `frontend/package.json`: Dependency React/Redux/Router/Bootstrap + scripts Vite.
- `frontend/vite.config.js`: Cau hinh build/dev cho Vite.
- `frontend/src/main.jsx`: Entry render React + Redux Provider + import Bootstrap.
- `frontend/src/App.jsx`: Dinh nghia router va route guard tong.
- `frontend/src/styles.css`: CSS bo sung nhe cho layout/card/title.
- `frontend/src/app/store.js`: Redux store config.
- `frontend/src/components/Common.jsx`: `ProtectedRoute`, `MainLayout`, component hien thi loi.
- `frontend/src/services/apiClient.js`: Service goi API trung tam (`fetch`, header token, parse error).
- `frontend/src/features/auth/authSlice.js`: State auth + thunk `login/register/me/logout`, luu localStorage.
- `frontend/src/features/quizzes/quizSlice.js`: State quiz + thunk fetch quiz/question, submit, admin CRUD.

#### Pages
- `LoginPage.jsx`: Form dang nhap.
- `RegisterPage.jsx`: Form dang ky (chon role).
- `QuizListPage.jsx`: Danh sach quiz co the lam.
- `TakeQuizPage.jsx`: Lam quiz, chon dap an, submit, xem ket qua.
- `AdminQuizzesPage.jsx`: Trang admin CRUD quiz va CRUD question.
- `NotFoundPage.jsx`: Trang 404.

## API endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Quizzes
- `GET /api/quizzes`
- `GET /api/quizzes/:id`
- `POST /api/quizzes` (admin)
- `PUT /api/quizzes/:id` (admin)
- `DELETE /api/quizzes/:id` (admin)
- `POST /api/quizzes/:id/submit`

### Questions
- `GET /api/quizzes/:quizId/questions`
- `POST /api/quizzes/:quizId/questions` (admin)
- `PUT /api/questions/:id` (admin)
- `DELETE /api/questions/:id` (admin)

## Setup

## 1) Prerequisites
- Node.js 18+
- MongoDB local instance running on your machine

## 2) Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

Default seeded users:
- `admin / admin123`
- `user / user123`

## 3) Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`
Backend URL: `http://localhost:5000`

## 4) Root shortcuts

From repo root:

```bash
npm run dev:backend
npm run dev:frontend
npm run seed
```

## Manual smoke test checklist

- Login with `user` and verify:
  - Can see quizzes
  - Can take quiz and submit answers
  - Cannot access admin page
- Login with `admin` and verify:
  - Can CRUD quizzes
  - Can CRUD questions
- Verify error scenarios:
  - Invalid token returns `401`
  - Forbidden admin actions for normal user returns `403`
  - Invalid ObjectId returns `400`

## Insomnia

Import `insomnia_collection.json` and set environment:
- `base_url = http://localhost:5000/api`
- `token = <JWT from login response>`

## Notes

- API response format:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

- `GET /api/quizzes/:quizId/questions` hides `correctAnswerIndex` for non-admin users.