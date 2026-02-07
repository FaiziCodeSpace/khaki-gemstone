import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../../services/authService";
// 🔹 Import guest cart utilities
import { getGuestCart, clearGuestCart } from "../../utils/guestCart";

const LoginUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const guestCartItems = getGuestCart();
    // Ensure we only send the IDs string array
    const guestCartIds = guestCartItems.map(item => item._id || item);

    await loginUser({ 
      ...loginData, 
      guestCart: guestCartIds 
    });
    
    // Note: saveAuth in the service already calls clearGuestCart()
    // but calling it here again doesn't hurt.
    clearGuestCart();
    
    navigate('/'); 
  } catch (err) {
    setError(err.response?.data?.message || 'Invalid email or password.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Side: Image Section */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gray-100">
        <img 
          src="./Images/registration-side-img.png" 
          alt="Login Showcase" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold text-black">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none transition"
                onChange={handleChange}
                value={loginData.email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none transition"
                onChange={handleChange}
                autoComplete="current-password"
                value={loginData.password}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-[#CA0A7F] border-gray-300 rounded focus:ring-[#CA0A7F]"
                  onChange={handleChange}
                  checked={loginData.rememberMe}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-black">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-[#CA0A7F] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#CA0A7F] text-white font-semibold py-3 rounded-md hover:bg-opacity-90 transition shadow-lg mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-black">
            Don't have an account?{' '}
            <a href="/register" className="text-[#CA0A7F] font-bold hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;