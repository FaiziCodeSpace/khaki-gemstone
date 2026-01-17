import React, { useState } from 'react';

const RegisterInvestor = () => {
  // 1. State to handle all form inputs including checkboxes
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    city: '',
    gender: '',
    dob: '',
    rememberMe: false,
    agreeTerms: false
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // 2. Handle input changes for text, select, and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 3. Comprehensive Validation Logic
  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (formData.phone.length < 10) newErrors.phone = 'Enter a valid phone number';
    if (!formData.cnic.trim()) newErrors.cnic = 'CNIC is required';
    
    // Checkbox validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Registration Successful:', formData);
      // Proceed with your API call (e.g., axios.post('/api/register', formData))
    } else {
      console.log('Validation Failed');
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-gray-50">
      
      {/* LEFT SIDE: Form Container */}
      <section className="flex w-full flex-col justify-center px-6 py-8 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Investor Registration
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Secure your future. Fill in your details to create an investor account.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            
            {/* Row 1: Names */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  className={`mt-1 block w-full rounded-md border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  autoComplete="family-name"
                  className={`mt-1 block w-full rounded-md border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            {/* Row 2: Contact */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className={`mt-1 block w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Row 3: Identity & DOB */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  id="cnic"
                  placeholder="00000-0000000-0"
                  className={`mt-1 block w-full rounded-md border ${errors.cnic ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]`}
                  value={formData.cnic}
                  onChange={handleChange}
                />
                {errors.cnic && <p className="mt-1 text-xs text-red-500">{errors.cnic}</p>}
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 4: Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                id="address"
                rows="2"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Row 5: City & Gender */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  id="gender"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75]"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* NEW: Checkboxes Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#CA0A75] focus:ring-[#CA0A75]"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="flex flex-col">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    required
                    className={`mt-1 h-4 w-4 rounded border ${errors.agreeTerms ? 'border-red-500' : 'border-gray-300'} text-[#CA0A75] focus:ring-[#CA0A75]`}
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-[#CA0A75] hover:underline font-semibold">Terms & Conditions</a> and <a href="/privacy" className="text-[#CA0A75] hover:underline font-semibold">Privacy Policy</a>.
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-[#CA0A75] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#A80862] focus:outline-none focus:ring-2 focus:ring-[#CA0A75] focus:ring-offset-2 transition-all transform active:scale-95"
              >
                REGISTER NOW
              </button>
            </div>

          </form>
          {/* Registration Redirect */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already a member?{' '}
            <a href="/investor/Login" className="font-semibold text-[#CA0A75] hover:underline">
              Login Now
            </a>
          </p>
        </div>
      </section>

      {/* RIGHT SIDE: Image Background */}
      <aside className="hidden w-1/2 lg:block relative" aria-hidden="true">
        <img
          src="/Images/InvestorBg.png"
          alt="Professional investment environment"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </aside>

    </main>
  );
};

export default RegisterInvestor;