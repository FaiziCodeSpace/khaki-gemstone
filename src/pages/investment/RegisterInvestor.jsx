import React, { useEffect, useState } from 'react';
import { applyInvestor } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const RegisterInvestor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cnic: '',
    address: '',
    city: '',
    gender: '',
    dob: '',
    rememberMe: false,
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔐 SAFE AUTO-FILL (NO TRUST ON LOCALSTORAGE)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');

      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user object');
      }

      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));

      setIsAutoFilled(true);
    } catch (error) {
      console.error('Corrupted user in localStorage', error);
      localStorage.removeItem('user');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue = value;

    if (name === 'cnic') {
      finalValue = formatCNIC(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };


  // ✅ STRONG VALIDATION (MINIMAL BUT CORRECT)
  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!isAutoFilled) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if (!isAutoFilled) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
      newErrors.cnic = 'Invalid CNIC format';
    }

    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      if (dobDate > new Date()) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      // 🧼 CLEAN PAYLOAD (BACKEND SAFE)
      const {
        password,
        confirmPassword,
        rememberMe,
        agreeTerms,
        ...cleanPayload
      } = formData;

      if (!isAutoFilled) {
        cleanPayload.password = password;
      }

      await applyInvestor(cleanPayload);

      navigate('/investor-application-submitted');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCNIC = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '').slice(0, 13);

    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;

    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const inputBaseClass = (name) =>
    `mt-1 block w-full rounded-md border ${errors[name] ? 'border-red-500' : 'border-gray-300'
    } px-3 py-2 shadow-sm focus:border-[#CA0A75] focus:outline-none focus:ring-1 focus:ring-[#CA0A75] transition-colors`;

  return (
    <main className="flex min-h-screen w-full bg-gray-50">
      <section className="flex w-full flex-col justify-center px-6 py-8 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-lg">

          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Investor Registration
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isAutoFilled ? "Complete your investor profile below." : "Secure your future. Create an investor account."}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  disabled={isAutoFilled}
                  className={`${inputBaseClass('firstName')} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  disabled={isAutoFilled}
                  className={`${inputBaseClass('lastName')} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  disabled={isAutoFilled}
                  className={`${inputBaseClass('email')} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className={inputBaseClass('phone')}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  disabled={isAutoFilled}
                  className={`${inputBaseClass('password')} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  disabled={isAutoFilled}
                  className={`${inputBaseClass('confirmPassword')} ${isAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  maxLength={15}
                  placeholder="00000-0000000-0"
                  className={inputBaseClass('cnic')}
                  value={formData.cnic}
                  onChange={handleChange}
                />

                {errors.cnic && <p className="mt-1 text-xs text-red-500">{errors.cnic}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className={inputBaseClass('dob')}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                rows="2"
                className={inputBaseClass('address')}
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  className={inputBaseClass('city')}
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  className={inputBaseClass('gender')}
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
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>

              <div className="flex flex-col">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    className={`mt-1 h-4 w-4 rounded border ${errors.agreeTerms ? 'border-red-500' : 'border-gray-300'} text-[#CA0A75] focus:ring-[#CA0A75]`}
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <span className="text-[#CA0A75] font-semibold">Terms</span> & <span className="text-[#CA0A75] font-semibold">Privacy Policy</span>.
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-[#CA0A75] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#A80862] focus:outline-none focus:ring-2 focus:ring-[#CA0A75] transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "PROCESSING..." : "REGISTER NOW"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already a member?{' '}
            <a href="/investor-login" className="font-semibold text-[#CA0A75] hover:underline">Login Now</a>
          </p>
        </div>
      </section>

      <aside className="hidden w-1/2 lg:block relative" aria-hidden="true">
        <img
          src="/Images/InvestorBg.png"
          alt="Investment Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </aside>
    </main>
  );
};

export default RegisterInvestor;