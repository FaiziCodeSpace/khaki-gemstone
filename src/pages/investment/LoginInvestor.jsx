import React, { useState } from 'react';

const LoginInvestor = () => {
  // 1. State for login credentials
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 3. Login Validation
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

  // 4. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login Attempt:', loginData);
      // API call logic here (e.g., auth service)
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
                required
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75] transition-all`}
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
                required
                className={`mt-1 block w-full rounded-md border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75] transition-all`}
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
                className="flex w-full justify-center rounded-md border border-transparent bg-[#CA0A75] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#A80862] focus:outline-none focus:ring-2 focus:ring-[#CA0A75] focus:ring-offset-2 transition-all transform active:scale-95 uppercase tracking-wide"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Registration Redirect */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Not a member?{' '}
            <a href="/investor/register" className="font-semibold text-[#CA0A75] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </section>

      {/* RIGHT SIDE: Decorative Image */}
      <aside className="hidden w-1/2 lg:block relative" aria-hidden="true">
        <img
          src="/Images/InvestorBg.png" 
          alt="Investor dashboard background"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </aside>

    </main>
  );
};

export default LoginInvestor;