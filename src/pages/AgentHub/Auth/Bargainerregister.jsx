// pages/public/BargainerRegister.jsx
// Public registration page for bargainers (car dealers)
// After submission → pending admin approval

import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const Field = ({ label, name, value, onChange, type = "text", placeholder = "", required = true }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}
      className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-gray-300 transition"
    />
  </div>
);

export default function BargainerRegister() {
  const [form, setForm]     = useState({ fullName: "", phone: "", cnic: "", password: "", city: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res  = await fetch(`${API_BASE}/bargainers/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
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
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">درخواست موصول!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            آپ کی رجسٹریشن درخواست بھیج دی گئی ہے۔ ایڈمن کی منظوری کے بعد آپ کو اطلاع ملے گی۔
          </p>
          <p className="text-xs text-gray-400 mt-4">Application under review · Usually 24–48 hours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Bargainer رجسٹریشن</h1>
          <p className="text-gray-500 text-sm mt-1">AgentHub تک رسائی کے لیے اکاؤنٹ بنائیں</p>
        </div>

        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            رجسٹریشن کے بعد آپ کی درخواست ایڈمن کو بھیجی جائے گی۔ منظوری کے بعد آپ AgentHub استعمال کر سکیں گے۔
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Field label="پورا نام"  name="fullName" value={form.fullName} onChange={handleChange} placeholder="محمد احمد خان" />
            <Field label="فون نمبر" name="phone"    value={form.phone}    onChange={handleChange} placeholder="03001234567" type="tel" />
            <Field label="CNIC"     name="cnic"     value={form.cnic}     onChange={handleChange} placeholder="12345-1234567-1" />
            <Field label="شہر"      name="city"     value={form.city}     onChange={handleChange} placeholder="ڈیرہ اسماعیل خان" required={false} />
            <Field label="پاس ورڈ" name="password" value={form.password} onChange={handleChange} type="password" placeholder="کم از کم 6 حروف" />

            {status === "error" && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                ⚠️ {message}
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
                  درخواست بھیجی جا رہی ہے...
                </>
              ) : "درخواست جمع کریں"}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          پہلے سے اکاؤنٹ ہے؟{" "}
          <a href="/agent/login" className="text-emerald-600 underline font-semibold">لاگ ان کریں</a>
        </p>
      </div>
    </div>
  );
}