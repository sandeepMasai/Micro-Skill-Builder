import React from 'react'
import { Routes, Route } from 'react-router-dom'

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
      </Routes>

      <Footer />
    </>
  )
}

export default App
