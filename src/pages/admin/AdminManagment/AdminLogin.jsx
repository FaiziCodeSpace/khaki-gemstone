import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext"; // Ensure path is correct
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Backend expects { phone, password }
      await login({ phone, password });
      
      // If login succeeds, the AuthContext state updates and we redirect
      navigate("/admin/dashboard");
    } catch (err) {
      // Capture the error message from the backend
      setError(err.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#CA0A7F] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Portal
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. 03001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-[#CA0A7F] hover:bg-[#b0096e] text-white font-semibold rounded-md shadow transition duration-200 mt-6 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}