import React, { useState } from 'react';
import { registerUser } from "../../services/authService"
import { useNavigate } from 'react-router-dom';

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',  
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.password !== formData.confirmPassword) {
    return setError("Passwords do not match");
  }

  try {
    // 1. Get guest cart items from localStorage
    const guestCart = getGuestCart(); 
    
    // 2. Send registration data PLUS the guestCart
    await registerUser({ 
      ...formData, 
      guestCart: guestCart.map(item => item._id) // Send only the IDs
    });

    // 3. Success! Clear the local guest cart
    clearGuestCart();
    
    alert('Registration Successful!');
    navigate('/'); 
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed');
  }
};

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side: Image Section */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gray-100">
        <img 
          src="./Images/hero-Picture.png" 
          alt="Registration" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Form Container */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mt-40 md:mt-15">Create Account</h2>
            <p className="text-gray-500 mt-2">Please fill in your details to get started.</p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none"
                onChange={handleChange}
                required
              />
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#CA0A7F] outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#CA0A7F] text-white font-semibold py-3 rounded-md hover:bg-opacity-90 transition shadow-lg"
            >
              Register
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-black">
            Already have an account?{' '}
            <a href="/login" className="text-[#CA0A7F] font-bold hover:underline">
              Login Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;