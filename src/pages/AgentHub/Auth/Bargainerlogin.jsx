import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBargainerAuth } from "../../../context/BargainerAuthContext";
import { Eye, EyeOff, User, Loader2, AlertCircle, Timer } from "lucide-react";

export default function BargainerLogin() {
  const { login } = useBargainerAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">AgentHub لاگ ان</h1>
          <p className="text-gray-500 text-sm mt-1">اپنے Bargainer اکاؤنٹ سے لاگ ان کریں</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">فون نمبر</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                required
                onChange={handleChange}
                placeholder="03001234567"
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">پاس ورڈ</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  required
                  onChange={handleChange}
                  placeholder="••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className={`text-xs px-3 py-2.5 rounded-lg border flex items-start gap-2 ${
                statusCode === "PENDING" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <span className="shrink-0 mt-0.5">
                  {statusCode === "PENDING" ? <Timer size={14} /> : <AlertCircle size={14} />}
                </span>
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  لاگ ان ہو رہے ہیں...
                </>
              ) : (
                "لاگ ان کریں"
              )}
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