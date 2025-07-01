🎯 Micro-Skill-Builder Frontend
Micro-Skill-Builder is a gamified micro-learning platform designed to deliver short, structured learning experiences. This is the frontend of the platform, enabling learners and instructors to interact through a sleek, user-friendly interface.

⚙️ Tech Stack
Framework: React.js (with Hooks & Context API)

Routing: React Router DOM

State Management: Context API / Redux (if applicable)

HTTP Client: Axios

Styling: Tailwind CSS / Styled Components / CSS Modules

Authentication: JWT via localStorage

Form Handling: React Hook Form / Formik

Build Tool: Vite / Create React App

🚀 Features
👥 User Functionality
Register, Login, Profile View

Enroll in Courses

View Progress Day-wise (Sequential Unlock)

Take Quizzes & Earn XP

Unlock Badges & Track Daily Streaks

Leaderboard View (XP-based)

🧑‍🏫 Instructor Functionality
Instructor Dashboard

Create & Manage Courses

Upload Modules & Quizzes

Track Enrollment Stats

🔐 Admin Functionality
Admin-only access to manage users/courses (if extended)

Role-based UI rendering

🔗 API Endpoints (Backend Integration)
Base URL for production:

arduino
Copy
Edit
https://micro-skill-builder.onrender.com/api
Endpoint	Description
POST /auth/register	User registration
POST /auth/login	User login
GET /courses	Get all available courses
POST /courses	Create a course (Instructor only)
GET /courses/instructor/my-courses	Instructor's own courses
POST /enrollments/:courseId	Enroll in a course
GET /users/leaderboard	XP-based leaderboard

🔑 Environment Variables
Create a .env file in the root with the following:

VITE_API_BASE_URL=http://localhost:2025/api
For production, replace with:
VITE_API_BASE_URL=https://micro-skill-builder.onrender.com/api

1. Clone the Rep

git clone https://github.com/your-username/micro-skill-builder-frontend.git
cd micro-skill-builder-frontend
2. Install Dependencies

npm install
3. Set Environment Variables
Create .env as described above.

4. Run the App

npm run dev
Visit: http://localhost:5173

📌 Contribution Guide
Fork the repo

Create your feature branch: git checkout -b feature/YourFeature

Commit your changes: git commit -m 'Add feature'

Push to the branch: git push origin feature/YourFeature

Open a pull request 🎉
