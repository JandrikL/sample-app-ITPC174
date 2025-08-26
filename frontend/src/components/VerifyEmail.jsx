import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.email_verified_at) {
      navigate('/dashboard');
      return;
    }

    const verifyEmail = async () => {
    try {
        const id = searchParams.get('id');
        const hash = searchParams.get('hash');
        
        if (!id || !hash) {
            setStatus('error');
            setMessage('Invalid verification link');
            return;
        }

        // Make direct API call
        const response = await fetch(`/email/verify/${id}/${hash}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            setStatus('success');
            setMessage(data.message);
            
            // Redirect to login after success
            setTimeout(() => {
                window.location.href = '/login'; // This will hit your GET login route
            }, 2000);
        } else {
            setStatus('error');
            setMessage(data.message || 'Verification failed');
        }
    } catch (error) {
        setStatus('error');
        setMessage('Verification failed');
    }
  };

    verifyEmail();
  }, [searchParams, user, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        <div className={`p-4 rounded-md ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className={`flex-shrink-0 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {status === 'success' ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>

        {status === 'success' && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;