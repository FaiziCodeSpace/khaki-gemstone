// pages/agent/AgentLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAgentAuth } from "../../../context/Agentauthcontext";

export default function AgentLogin() {
  const { login }   = useAgentAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ cnic: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/stampgenerator", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#CA0A7F" }}>
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Agent Portal</h1>
            <p className="text-sm text-gray-500 mt-1">اقرار نامہ ساز — Agent Login</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* CNIC */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                CNIC Number
              </label>
              <input
                type="text"
                name="cnic"
                value={form.cnic}
                onChange={handleChange}
                placeholder="12345-1234567-1"
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 transition placeholder:text-gray-300"
                style={{ "--tw-ring-color": "#CA0A7F" }}
                onFocus={e => e.target.style.boxShadow = "0 0 0 2px #CA0A7F40"}
                onBlur={e  => e.target.style.boxShadow = ""}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none transition placeholder:text-gray-300"
                onFocus={e => e.target.style.boxShadow = "0 0 0 2px #CA0A7F40"}
                onBlur={e  => e.target.style.boxShadow = ""}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait"
              style={{ backgroundColor: "#CA0A7F" }}
              onMouseEnter={e => !loading && (e.target.style.backgroundColor = "#a8086a")}
              onMouseLeave={e => (e.target.style.backgroundColor = "#CA0A7F")}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Access is restricted to registered agents only.
        </p>

      </div>
    </div>
  );
}