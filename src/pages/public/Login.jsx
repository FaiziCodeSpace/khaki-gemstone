import React, { useState } from 'react';

const LoginUser = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Attempt:', loginData);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      
      {/* Left Side: Image Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gray-100">
        <img 
          src="./Images/Showcase1.png" 
          alt="Login Showcase" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12">
        
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold text-black">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-black">Password</label>
                <a href="/forgot-password" hidden className="text-xs text-[#CA0A7F] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                onChange={handleChange}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-[#CA0A7F] border-gray-300 rounded focus:ring-[#CA0A7F]"
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-black">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-[#CA0A7F] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#CA0A7F] text-white font-semibold py-3 rounded-md hover:bg-opacity-90 transition shadow-lg mt-2"
            >
              Sign In
            </button>
          </form>

          {/* Footer Link */}
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