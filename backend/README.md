# 🧠 Micro-Skill-Builder

Micro-Skill-Builder is a gamified micro-learning platform that helps users learn efficiently through short, structured courses. It features secure authentication, sequential content unlocking, progress tracking, and an XP-based gamification system.

---

## 🚀 Features

### 🏗️ Core Backend Structure
- Express.js server with MongoDB
- JWT-based authentication
- File uploads via Multer
- Centralized error handling
- Rate limiting for API protection

### 🧱 Database Models
- **User**: Stores authentication details, XP, badges, and enrolled courses
- **Course**: 5-day structured learning with quizzes and daily modules
- **Enrollment**: Tracks user’s course progress and completion
- **Submission**: Foundation for peer review and submission tracking

### 📡 API Routes
  https://micro-skill-builder.onrender.com/api/test test api backend run
- **Auth**: Register, login, profile management
- **Courses**: CRUD operations for instructors
- **Enrollments**: Enroll and track course progress
- **Modules**: Access content sequentially by day
- **Users**: View stats, badges, and leaderboard

### 🕹️ Gamification System
- XP rewards for course progression and quiz completion
- Badges auto-awarded on milestones
- Leaderboard based on XP
- Daily progress tracking

### 🛡️ Security Features
- Secure password hashing with bcrypt
- JWT-based authentication
- Role-based authorization (Admin, Instructor, Student)
- Rate limiting for brute-force protection

---

## 📋 Implemented Functionality
✅ User Authentication & Authorization  
✅ Course Creation & Instructor Dashboard  
✅ Sequential Day Unlocking System  
✅ Quiz System with XP Rewards  
✅ Course Progress Tracking  
✅ XP & Badge Gamification  
✅ File Upload Support (Course Images)  
✅ API Security & Rate Limiting  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **File Handling**: Multer
- **Security**: express-rate-limit, Helmet
- **Testing**: Postman / Thunder Client


post  courses  and get with admin and instructor role bases  http://localhost:2025/api/courses

Get instructor courses GET http://localhost:2025/api/courses/instructor/my-courses

get users/leaderboard  https://micro-skill-builder.onrender.com/api/users/leaderboard







| Variable                | Description                                | Example / Notes                                                       |
| ----------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `MONGODB_URI`           | MongoDB connection string                  | `mongodb+srv://<username>:<password>@cluster0.xyz`                    |
| `PORT`                  | Port number the server will run on         | `5000`, `3000`, etc.                                                  |
| `JWT_SECRET`            | Secret key for JWT authentication          | Use a long, secure, random string                                     |
| `NODE_ENV`              | Server environment                         | `development`, `production`                                           |
| `MAX_FILE_SIZE`         | Max upload file size in bytes              | `5242880` (5MB)                                                       |
| `UPLOAD_PATH`           | Directory to store uploaded files          | `uploads`                                                             |
| `UPLOAD_DIR`            | Alias for upload directory                 | `uploads`                                                             |
| `SMTP_HOST`             | SMTP server address                        | `smtp.gmail.com`                                                      |
| `SMTP_PORT`             | Port for SMTP                              | `587`, `465`                                                          |
| `SMTP_USER`             | SMTP email address (App password required) | `your-email@gmail.com`                                                |
| `SMTP_PASS`             | App password for SMTP user                 | Use [Google App Passwords](https://myaccount.google.com/apppasswords) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name              | From your Cloudinary dashboard                                        |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                         | From your Cloudinary dashboard                                        |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                      | Keep this secure and private                                          |
