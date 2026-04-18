import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Info, Check, Camera, Loader2, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const Field = ({ label, name, value, onChange, type = "text", placeholder = "", required = true }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          name={name}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-300 transition"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default function BargainerRegister() {
  const [form, setForm] = useState({ fullName: "", phone: "", password: "", city: "" });
  const [pfpFile, setPfpFile] = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const handlePfp = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPfpFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (pfpFile) fd.append("pfp", pfpFile);
      const res = await fetch(`${API_BASE}/bargainers/register`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Registration failed");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  if (status === "done") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">درخواست موصول!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">منظوری کے بعد لاگ ان کر سکیں گے۔</p>
          <p className="text-xs text-gray-400 mt-3">Usually 24–48 hours</p>
          <Link to="/bargainer-login" className="mt-5 inline-block text-sm font-bold text-emerald-600 underline">
            لاگ ان صفحے پر جائیں
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Bargainer رجسٹریشن</h1>
          <p className="text-gray-500 text-sm mt-1">AgentHub تک رسائی کے لیے اکاؤنٹ بنائیں</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">رجسٹریشن کے بعد ایڈمن منظوری دے گا، پھر لاگ ان کریں۔</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 pb-1">
              <div
                onClick={() => fileRef.current?.click()}
                className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-emerald-400 bg-gray-50 cursor-pointer flex items-center justify-center transition-colors"
              >
                {pfpPreview ? (
                  <img src={pfpPreview} alt="pfp" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-7 h-7 text-gray-300" />
                )}
              </div>
              <p className="text-xs text-gray-400">پروفائل تصویر (اختیاری)</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePfp} />
            </div>

            <Field label="پورا نام" name="fullName" value={form.fullName} onChange={handleChange} placeholder="محمد احمد خان" />
            <Field label="فون نمبر" name="phone" value={form.phone} onChange={handleChange} placeholder="03001234567" type="tel" />
            <Field label="شہر" name="city" value={form.city} onChange={handleChange} placeholder="ڈیرہ اسماعیل خان" required={false} />
            <Field label="پاس ورڈ" name="password" value={form.password} onChange={handleChange} type="password" placeholder="کم از کم 6 حروف" />

            {status === "error" && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                <AlertCircle size={14} /> {message}
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
                  درخواست بھیجی جا رہی ہے...
                </>
              ) : (
                "درخواست جمع کریں"
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          پہلے سے اکاؤنٹ ہے؟ <Link to="/bargainer-login" className="text-emerald-600 underline font-semibold">لاگ ان کریں</Link>
        </p>
      </div>
    </div>
  );
}