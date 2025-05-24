
import WhisperTest from '../compnent/WhisperTest'
import SpeechToText from '../compnent/SpeechToText'

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:8000/api/routes/logout', {
      method: 'POST',
      credentials: 'include', // send cookies to backend
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        // Clear frontend token and state
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout failed:', err);
        // Optional: still clear local token and redirect even if backend fails
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
      });
  };


  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          SpeechApp
        </h1>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Main content */}
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6 md:gap-8 max-w-7xl mx-auto">
        <section className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Whisper Test</h2>
          <WhisperTest />
        </section>

        <section className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Speech To Text</h2>
          <SpeechToText />
        </section>
      </div>
    </>
  );
};

export default Layout;
