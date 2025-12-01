# Micro-Skill-Builder — Frontend

> **Micro-Skill-Builder** is a gamified micro-learning platform frontend built with React. It provides a clean, engaging UI for learners, instructors, and admins to interact with the backend APIs: browse courses, enroll, track XP & badges, take quizzes, and manage content.

---

## 🚀 Live API Base

**Frontend (dev / build uses this base)**

```
VITE_API_BASE_URL=https://micro-skill-builder-frontend.onrender.com
```

**Backend (main API used by the frontend)**

```
https://micro-skill-builder.onrender.com/api/test
```

---

## 🧭 Table of contents

* [Key Features](#-key-features)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [Setup & Run Locally](#-setup--run-locally)
* [Environment Variables](#-environment-variables)
* [Available Scripts](#-available-scripts)
* [API Endpoints (important)](#-api-endpoints-important)
* [Authentication & Roles](#-authentication--roles)
* [Cloudinary Image Uploads](#-cloudinary-image-uploads)
* [Testing](#-testing)
* [Linting & Formatting](#-linting--formatting)
* [Deployment](#-deployment)
* [Contributing](#-contributing)
* [Troubleshooting](#-troubleshooting)
* [License & Contact](#-license--contact)

---

## ✨ Key Features

* Course browsing, search & filtering
* JWT-based authentication (Register / Login)
* Role-based navigation (Student / Instructor / Admin)
* Enrollments & progress tracking (day/sequence unlocking)
* XP system + Badges + Leaderboard
* Integrated quizzes with XP rewards
* Instructor dashboard for course & module management
* Course image upload via Cloudinary
* Responsive UI with TailwindCSS + Framer Motion animations

---

## 🛠️ Tech Stack

* **Frontend:** React (Hooks + Context)
* **Routing:** React Router DOM
* **HTTP:** Axios
* **Styling:** TailwindCSS + CSS Modules
* **State Management:** React Context + useReducer
* **Forms & Validation:** React Hook Form + Yup
* **Animation:** Framer Motion
* **Testing:** Jest + React Testing Library
* **Deployment:** Vercel / Netlify (recommended)

---

## 📁 Project structure (high level)

```
/src
│
├── /components       # Reusable UI components (Cards, Buttons, Modals)
├── /pages            # Page-level components (routes)
├── /contexts         # Auth/User contexts and reducers
├── /hooks            # Reusable custom hooks
├── /services         # Axios API clients & service functions
├── /utils            # Helpers, formatters
├── /assets           # Images & static files
├── App.jsx           # Main application router
└── main.jsx          # App entrypoint
```

---

## ✅ Prerequisites

* Node.js (v16+) and npm
* Git
* Cloudinary account (for image uploads)

---

## 🧪 Setup & Run Locally

1. Clone the repository

```bash
git clone https://github.com/sandeepMasai/Micro-Skill-Builder.git
cd micro-skill-builder-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in project root — see [Environment Variables](#-environment-variables)

4. Start dev server

```bash
npm run dev
```

5. Open `http://localhost:5173` (or the port shown in terminal)

---

## 🔐 Environment Variables

Create a `.env` file in project root with the following keys (example):

```
VITE_API_BASE_URL=https://micro-skill-builder-frontend.onrender.com
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload
VITE_CLOUDINARY_UPLOAD_PRESET=<your-upload-preset>
VITE_APP_NAME=Micro-Skill-Builder
```

> ⚠️ Never commit `.env` to source control. Use secrets in deployment platforms.

---

## 📡 Important API Endpoints (used by frontend)

Use the backend base `https://micro-skill-builder.onrender.com/api/test` combined with the paths below (these are the main routes the frontend expects):

| Functionality                   | Endpoint                         |
| ------------------------------- | -------------------------------- |
| Test API                        | `/test`                          |
| Register / Login                | `/auth`                          |
| User Profile                    | `/users/profile`                 |
| Get Courses                     | `/courses`                       |
| Instructor Courses (my courses) | `/courses/instructor/my-courses` |
| Leaderboard                     | `/users/leaderboard`             |
| Enrollments                     | `/enrollments`                   |
| Daily Modules                   | `/modules/:day`                  |

> The frontend uses Axios instances configured with the `VITE_API_BASE_URL`. Ensure the backend is reachable and CORS is enabled.

---

## 🧾 Authentication & Roles

* JWT-based auth. Tokens are stored in memory + localStorage via AuthContext.
* Roles supported: `student`, `instructor`, `admin`.
* Role-based navigation and protected routes are implemented in the router and AuthContext.

---

## ☁️ Cloudinary Image Uploads

Course images (and other media) are uploaded to Cloudinary via a client-side unsigned upload using the `VITE_CLOUDINARY_UPLOAD_PRESET` and `VITE_CLOUDINARY_UPLOAD_URL`.

Sample upload flow in `services/cloudinary.js`:

```js
// create a FormData, append file and upload_preset then POST to VITE_CLOUDINARY_UPLOAD_URL
```

---

## 🧪 Testing

Run unit & integration tests with Jest + React Testing Library:

```bash
npm run test
```

We encourage writing tests for complex UI components (forms, auth flows, dashboard widgets).

---

## 🧹 Linting & Formatting

* ESLint + Prettier configured (recommended). Run the linter before committing.

Example:

```bash
npm run lint
npm run format
```

---

## 🚢 Deployment

Recommended: Vercel or Netlify.

* Add environment variables (VITE_API_BASE_URL, VITE_CLOUDINARY_UPLOAD_URL, VITE_CLOUDINARY_UPLOAD_PRESET) in the deployment dashboard.
* Build command: `npm run build`
* Publish directory: `dist`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add ..."`
4. Push: `git push origin feat/your-feature`
5. Open a PR with description and screenshots

Please follow the repository's code style and write tests for new features when possible.

---

## 🐞 Troubleshooting

* **CORS / 401 issues**: Ensure backend is running and the frontend `VITE_API_BASE_URL` is set correctly. Confirm JWT tokens are received and attached to Axios requests.
* **Cloudinary uploads failing**: Check your cloud name and upload preset (unsigned preset must be enabled for client uploads).
* **404 on modules/courses**: Verify backend endpoint paths and that your backend DB has seeded courses.

---

## 📦 Future Enhancements

* PWA support
* i18n / Localization
* Video lesson hosting & streaming
* Instructor analytics dashboard
* Improved progress & XP gamification rules

---

## 📬 Contact

If you want to collaborate or have questions, open an issue or PR on GitHub.

GitHub: `https://github.com/sandeepMasai/Micro-Skill-Builder`

---
