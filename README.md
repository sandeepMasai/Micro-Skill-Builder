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
  https://micro-skill-builder.onrender.com/api/test test api backen run
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


post  courses  http://localhost:2025/api/courses

Get instructor courses GET http://localhost:2025/api/courses/instructor/my-courses

get users/leaderboard  https://micro-skill-builder.onrender.com/api/users/leaderboard










# Database
MONGODB_URI= self atles url
PORT= self use 
# JWT Secret 
JWT_SECRET= youre own secret

# Server Configuration

NODE_ENV=development
# File Upload Configuration
MAX_FILE_SIZE=5242880

UPLOAD_PATH=uploads
UPLOAD_DIR=uploads


# Email Configuration (for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT= self use
SMTP_USER= self email using Google App 
SMTP_PASS= self use google app password

# Cloudinary Configuration (optional - for production file storage) 
create own  CLOUDINARY api key and use 
CLOUDINARY_CLOUD_NAME=#####
CLOUDINARY_API_KEY=######
CLOUDINARY_API_SECRET=######

