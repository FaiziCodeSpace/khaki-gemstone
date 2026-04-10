// pages/public/BargainerLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBargainerAuth } from "../../../context/BargainerAuthContext";

export default function BargainerLogin() {
  const { login }    = useBargainerAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ phone: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [statusCode, setStatusCode] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const data = await login(form.phone, form.password);
      if (data.success) {
        navigate("/agent-hub", { replace: true });
      } else {
        setStatus("error");
        setMessage(data.message || "Login failed");
        setStatusCode(data.statusCode || "");
      }
    } catch (err) {
      setStatus("error");
      const errData = err.response?.data;
      setMessage(errData?.message || "Login failed");
      setStatusCode(errData?.statusCode || "");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">AgentHub لاگ ان</h1>
          <p className="text-gray-500 text-sm mt-1">اپنے Bargainer اکاؤنٹ سے لاگ ان کریں</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">فون نمبر</label>
              <input
                type="tel" name="phone" value={form.phone} required
                onChange={handleChange} placeholder="03001234567"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">پاس ورڈ</label>
              <input
                type="password" name="password" value={form.password} required
                onChange={handleChange} placeholder="••••••"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            {status === "error" && (
              <div className={`text-xs px-3 py-2.5 rounded-lg border flex items-start gap-2 ${
                statusCode === "PENDING"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <span className="shrink-0 mt-0.5">{statusCode === "PENDING" ? "⏳" : "⚠️"}</span>
                <span>{message}</span>
              </div>
            )}

            <button type="submit" disabled={status === "loading"}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {status === "loading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  لاگ ان ہو رہے ہیں...
                </>
              ) : "لاگ ان کریں"}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          اکاؤنٹ نہیں ہے؟{" "}
          <Link to="/bargainer-register" className="text-emerald-600 underline font-semibold">
            رجسٹریشن کریں
          </Link>
        </p>
      </div>
    </div>
  );
}