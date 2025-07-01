

import React, { useState, useEffect } from 'react';
import AuthForm from './AuthFrom';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('student');  

  useEffect(() => {
    if (user) {
      navigate('/dashboard'); 
    }
  }, [user, navigate]);

 const handleRegister = async ({ name, email, password, role }) => {
  setIsLoading(true);
  setErrorMessage('');
  const { success, message } = await register(name, email, password, role); 

  if (success) {
    navigate('/login');
  } else {
    setErrorMessage(message || 'Registration failed. Please try again.');
  }

  setIsLoading(false);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create a New Account
        </h2>

        <AuthForm
          type="register"
          onSubmit={handleRegister}
          isLoading={isLoading}
          errorMessage={errorMessage}
          role={role}              
          setRole={setRole}        
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

