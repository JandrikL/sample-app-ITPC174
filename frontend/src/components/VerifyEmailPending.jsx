// src/pages/VerifyEmailPending.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const VerifyEmailPending = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await authAPI.getCsrfToken();
      await authAPI.resendVerificationEmail();
      setMessage('Verification email resent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.');
    }
    
    setLoading(false);
  };

  if (user?.email_verified_at) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please check your email ({user?.email}) for a verification link.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You must verify your email address before accessing the dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          
          {message && (
            <p className="mt-4 text-sm text-green-600">
              {message}
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              // Logout user
              // You might want to add a logout function to your AuthContext
            }}
            className="text-sm font-medium text-gray-600 hover:text-gray-500"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPending;