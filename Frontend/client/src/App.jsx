import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import ProfilePage from './page/ProfilePage'
import LeaderboardPage from './page/LeaderboardPage'
import EditProfilePage from './page/EditProfilePage'
import CoursesPage from './components/CoursesPage'
import CreateCoursePage from './components/CreateCoursePage'
import MyEnrollmentsPage from './components/MyEnrollmentsPage'
import CourseDetailsPage from './page/CourseDetailsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './components/Admin'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/e-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/create"
          element={
            <ProtectedRoute roles={['admin', 'instructor']}>
              <CreateCoursePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-enrollments"
          element={
            <ProtectedRoute>
              <MyEnrollmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <Link to="/" className="text-blue-600 hover:underline">
                  Go back home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
