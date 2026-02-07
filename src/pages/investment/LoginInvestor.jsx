import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginInvestor } from '../../services/authService'; // Adjust path based on your folder structure

const LoginInvestor = () => {
  const navigate = useNavigate();

  // 1. State for login credentials
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // 2. State for UI feedback
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  // 4. Form Validation
  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      // Calling the service you provided earlier
      await loginInvestor(loginData);
      
      // If the backend allows the login (meaning status is approved)
      navigate("/investor/dashboard", { replace: true });
    } catch (err) {
      // Catch 401 (Invalid creds) or 403 (Pending/Rejected)
      const message = err.response?.data?.message || "An unexpected error occurred. Please try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-gray-50">
      
      {/* LEFT SIDE: Login Form */}
      <section className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Log in to your investor dashboard to manage your portfolio.
            </p>
          </header>

          {/* --- SERVER ERROR MESSAGE (Shows "Pending", "Rejected", etc) --- */}
          {serverError && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border-l-4 border-red-500">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Login Restricted</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{serverError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75] transition-all disabled:bg-gray-100`}
                value={loginData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="/forgot-password" className="font-semibold text-[#CA0A75] hover:text-[#A80862]">
                    Forgot password?
                  </a>
                </div>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75] transition-all disabled:bg-gray-100`}
                value={loginData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#CA0A75] focus:ring-[#CA0A75]"
                checked={loginData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex w-full justify-center rounded-md border border-transparent bg-[#CA0A75] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#A80862] focus:outline-none focus:ring-2 focus:ring-[#CA0A75] focus:ring-offset-2 transition-all transform active:scale-95 uppercase tracking-wide ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Registration Redirect */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Not a member?{' '}
            <a href="/investor-register" className="font-semibold text-[#CA0A75] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </section>

      {/* RIGHT SIDE: Decorative Image */}
      <aside className="hidden w-1/2 lg:block relative" aria-hidden="true">
        <img
          src="/Images/Investor-side-img.png" 
          alt="Investor dashboard background"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </aside>

    </main>
  );
};

export default LoginInvestor;