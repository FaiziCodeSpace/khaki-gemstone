import { useState, useRef } from "react";
import adminApi from "../../../services/adminServices/api.authService";

const PINK = "#CA0A7F";

const Field = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none transition placeholder:text-gray-300"
      onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${PINK}40`}
      onBlur={e  => e.target.style.boxShadow = ""}
    />
  </div>
);

export default function CreateAgent() {
  const [form, setForm] = useState({
    fullName:      "",
    cnic:          "",
    address:       "",
    officeAddress: "",
    password:      "",
  });
  const [pfpFile, setPfpFile]     = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [status, setStatus]       = useState("idle"); // idle | loading | done | error
  const [message, setMessage]     = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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

      const res = await adminApi.post("/agents/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("done");
      setMessage(`✓ Agent "${res.data.agent.fullName}" created successfully.`);
      // Reset form
      setForm({ fullName: "", cnic: "", address: "", officeAddress: "", password: "" });
      setPfpFile(null);
      setPfpPreview(null);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Failed to create agent.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow"
            style={{ backgroundColor: PINK }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Register New Agent</h1>
            <p className="text-sm text-gray-500">Super Admin — Agent Management</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Profile Picture */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer transition-colors hover:border-pink-400 shrink-0"
                  style={{ "--hover-border": PINK }}
                >
                  {pfpPreview ? (
                    <img src={pfpPreview} alt="pfp" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 4v16m8-8H4"/>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-700 font-medium">
                    {pfpFile ? pfpFile.name : "No file chosen"}
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold self-start px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ borderColor: PINK, color: PINK }}
                    onMouseEnter={e => { e.target.style.backgroundColor = PINK; e.target.style.color = "#fff"; }}
                    onMouseLeave={e => { e.target.style.backgroundColor = ""; e.target.style.color = PINK; }}>
                    {pfpFile ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handlePfp} />
              </div>
            </div>

            <Field label="Full Name"       name="fullName"      value={form.fullName}      onChange={handleChange} placeholder="Muhammad Ali" />
            <Field label="CNIC"            name="cnic"          value={form.cnic}          onChange={handleChange} placeholder="12345-1234567-1" />
            <Field label="Home Address"    name="address"       value={form.address}       onChange={handleChange} placeholder="Mohalla X, City Y" />
            <Field label="Office Address"  name="officeAddress" value={form.officeAddress} onChange={handleChange} placeholder="Shop No. 5, Main Bazar" />
            <Field label="Password"        name="password"      value={form.password}      onChange={handleChange} type="password" placeholder="Min. 6 characters" />

            {/* Status message */}
            {message && (
              <div className={`text-xs rounded-lg px-3 py-2.5 border ${
                status === "done"
                  ? "text-green-700 bg-green-50 border-green-200"
                  : "text-red-600 bg-red-50 border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60 mt-1"
              style={{ backgroundColor: PINK }}
              onMouseEnter={e => !status === "loading" && (e.target.style.backgroundColor = "#a8086a")}
              onMouseLeave={e => (e.target.style.backgroundColor = PINK)}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating Agent...
                </span>
              ) : "Create Agent"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}