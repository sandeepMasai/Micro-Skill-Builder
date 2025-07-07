 Micro-Skill-Builder Frontend
Micro-Skill-Builder is a gamified micro-learning platform that helps users learn efficiently through short, structured courses. This frontend project is the user-facing interface of the platform, enabling learners, instructors, and admins to engage with the backend APIs in an intuitive and engaging way.

🌐 Live API Base URL: https://stellular-kheer-f7c658.netlify.app/

🚀 Key Features (Frontend)
📚 Course Browsing & Enrollment

🔐 User Authentication (JWT-based)

📈 User Dashboard with XP & Badge Tracking

🔓 Sequential Module Unlocking (Day-wise)

🧠 Integrated Quiz System with XP Rewards

🏆 Leaderboard & Badge System

🎨 Instructor Dashboard for Course Management

📂 Course Image Upload (via Cloudinary)

⚙️ Role-based Navigation (Student / Instructor / Admin)

🛠️ Tech Stack
Layer	Tech
Frontend	React (with Hooks + Context)
Routing	React Router DOM
HTTP Client	Axios
Styling	TailwindCSS / CSS Modules
State Mgmt	React Context / useReducer
Forms	React Hook Form, Yup
Animations	Framer Motion / CSS
Testing	Jest + React Testing Library
Deployment	Vercel / Netlify (Recommended)

🌐 Backend Integration
All frontend features are built to consume the API hosted at:

https://micro-skill-builder.onrender.com/api/test

Here are some key routes:

Functionality	Endpoint
Test API	/test
Register/Login	/auth
User Profile	/users/profile
Get Courses	/courses
Instructor Courses	/courses/instructor/my-courses
Leaderboard	/users/leaderboard
Enrollments	/enrollments
Daily Modules	/modules/:day

📁 Folder Structure
bash
Copy
Edit
/src
│
├── /components       # Reusable UI components
├── /pages            # Page-level components (Routes)
├── /contexts         # Global state management (User/Auth)
├── /hooks            # Custom hooks
├── /services         # Axios API calls
├── /utils            # Helpers, formatters
├── /assets           # Static files
├── App.jsx           # Main App Router
└── main.jsx          # Entry point
🔧 Environment Variables
Create a .env file in the root:

env
Copy
Edit
VITE_API_BASE_URL=https://stellular-kheer-f7c658.netlify.app/
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload
VITE_CLOUDINARY_UPLOAD_PRESET=<your-preset>
🧪 How to Run Locally
bash
Copy
Edit
# Clone the repo
git clone https://github.com/sandeepMasai/Micro-Skill-Builder.git
cd micro-skill-builder-frontend

# Install dependencies
npm install

# Create .env with API URL and Cloudinary creds

# Start dev server
npm run dev
✅ Available Roles & Actions
Role	Capabilities
Student	Browse, Enroll, Progress, Take Quizzes
Instructor	Create & Manage Courses, Upload Modules
Admin	View All Users, Leaderboards, Manage Content

📌 Future Enhancements
📱 PWA Support

🌐 i18n / Localization

🎥 Video Lesson Support

🧑‍🏫 Instructor Analytics Dashboard

📬 Contact & Contribute
Feel free to fork, PR, or reach out for collaboration!

GitHub: github.com/your-username/micro-skill-builder-frontend

