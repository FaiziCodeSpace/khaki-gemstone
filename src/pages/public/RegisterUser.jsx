import React, { useState } from 'react';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      
      {/* Left Side: Image Section (Hidden on mobile, visible on medium+ screens) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gray-100">
        <img 
          src="./Images/hero-Picture.png" 
          alt="Registration Showcase" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12 overflow-y-auto">
        
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black text-left">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2">Please fill in your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Username</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Address</label>
              <textarea
                name="address"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                onChange={handleChange}
                required
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#CA0A7F] text-white font-semibold py-3 rounded-md hover:bg-opacity-90 transition shadow-lg"
            >
              Register
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-black">
            Already have an account?{' '}
            <a href="/login" className="text-[#CA0A7F] font-bold hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;