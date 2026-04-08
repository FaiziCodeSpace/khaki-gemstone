import { useState, useCallback } from "react";
import { CheckCircle2, XCircle, X, AlertTriangle, CircleAlert } from "lucide-react";

// ─────────────────────────────────────────────
// ValidationPanel — shows ALL errors at once
// ─────────────────────────────────────────────
function ValidationPanel({ panel, onDismiss }) {
  if (!panel) return null;

  const isSuccess = panel.type === "success";

  return (
    <div className="fixed bottom-5 right-5 z-50 w-80 pointer-events-auto">
      <div
        className={`rounded-2xl shadow-2xl border overflow-hidden
          ${isSuccess
            ? "bg-white border-emerald-200"
            : "bg-white border-red-200"
          }`}
        style={{ boxShadow: isSuccess
          ? "0 8px 32px -4px rgba(16,185,129,0.18), 0 2px 8px -2px rgba(0,0,0,0.08)"
          : "0 8px 32px -4px rgba(239,68,68,0.18), 0 2px 8px -2px rgba(0,0,0,0.08)"
        }}
      >
        {/* Header bar */}
        <div className={`flex items-center gap-2.5 px-4 py-3
          ${isSuccess ? "bg-emerald-600" : "bg-red-500"}`}
        >
          {isSuccess
            ? <CheckCircle2 size={17} className="text-white shrink-0" strokeWidth={2.2} />
            : <AlertTriangle size={17} className="text-white shrink-0" strokeWidth={2.2} />
          }
          <p className="flex-1 text-white text-[13px] font-semibold leading-tight">
            {isSuccess ? "تمام خانے درست ہیں" : `${panel.errors.length} خانے نامکمل ہیں`}
          </p>
          <button
            onClick={onDismiss}
            className="text-white/70 hover:text-white transition-colors rounded-md p-0.5 hover:bg-white/20"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {isSuccess ? (
            <p className="text-[12px] text-emerald-700 leading-relaxed">
              تمام ضروری خانے درست طریقے سے پُر کیے گئے ہیں۔ معاہدہ پرنٹ کے لیے تیار ہے۔
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-0.5">
              {panel.errors.map((err, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CircleAlert
                    size={13}
                    className="text-red-400 shrink-0 mt-[3px]"
                    strokeWidth={2.2}
                  />
                  <span className="text-[12px] text-slate-600 leading-snug" dir="rtl">
                    {err}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer pill — error count badge */}
        {!isSuccess && (
          <div className="px-4 pb-3 -mt-1">
            <div className="h-px bg-red-100 mb-2.5" />
            <p className="text-[11px] text-slate-400 text-center">
              براہ کرم مندرجہ بالا خانے درست کریں اور دوبارہ تصدیق کریں
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// useValidationPanel hook
// ─────────────────────────────────────────────
function useValidationPanel() {
  const [panel, setPanel] = useState(null);

  const showSuccess = useCallback(() => {
    setPanel({ type: "success", errors: [] });
  }, []);

  const showErrors = useCallback((errors) => {
    setPanel({ type: "error", errors });
  }, []);

  const dismiss = useCallback(() => setPanel(null), []);

  return { panel, showSuccess, showErrors, dismiss };
}

// ─────────────────────────────────────────────
// Auto-format helpers
// ─────────────────────────────────────────────
function formatCnic(raw) {
  // Strip non-digits, cap at 13
  const digits = raw.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

function formatPhone(raw) {
  // Strip non-digits, cap at 11
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────
function validateData(data) {
  const errors = [];

  const required = [
    { key: "sellerName",   label: "Seller Name" },
    { key: "sellerFather", label: "Seller Father's Name" },
    { key: "sellerCnic",   label: "Seller CNIC", cnic: true },
    { key: "sellerTehsil", label: "Seller District/Tehsil" },
    { key: "sellerPhone",  label: "Seller Phone" },
    { key: "buyerName",    label: "Buyer Name" },
    { key: "buyerFather",  label: "Buyer Father's Name" },
    { key: "buyerCnic",    label: "Buyer CNIC", cnic: true },
    { key: "buyerTehsil",  label: "Buyer District/Tehsil" },
    { key: "buyerPhone",   label: "Buyer Phone" },
    { key: "carModel",     label: "Vehicle Make/Model" },
    { key: "regNo",        label: "Registration No." },
    { key: "modelYear",    label: "Model Year" },
    { key: "carColor",     label: "Vehicle Colour" },
    { key: "engineNo",     label: "Engine No." },
    { key: "chassisNo",    label: "Chassis No." },
  ];

  for (const field of required) {
    const val = (data[field.key] || "").trim();
    if (!val) {
      errors.push(`"${field.label}" خالی ہے`);
    } else if (field.cnic && val.length !== 15) {
      errors.push(`"${field.label}" مکمل نہیں (XXXXX-XXXXXXX-X)`);
    }
  }

  return errors;
}

// ─────────────────────────────────────────────
// Field Components (unchanged styling)
// ─────────────────────────────────────────────
const Field = ({ label, name, value, onChange, placeholder = "", type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}
      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition placeholder:text-slate-300"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder = "", rows = 3, hint }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</label>
    {hint && <p className="text-[10px] text-slate-400 -mt-0.5" dir="rtl">{hint}</p>}
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}
      dir="rtl"
      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition placeholder:text-slate-300 resize-none leading-relaxed"
    />
  </div>
);

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest whitespace-nowrap">{children}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────
export default function ContractForm({ data, onChange }) {
  const { panel, showSuccess, showErrors, dismiss } = useValidationPanel();

  // Intercepted onChange — applies auto-formatting before passing up
  const handleChange = useCallback(
    (name, value) => {
      let formatted = value;
      if (name.toLowerCase().includes("cnic")) {
        formatted = formatCnic(value);
      } else if (name.toLowerCase().includes("phone")) {
        formatted = formatPhone(value);
      }
      onChange(name, formatted);
    },
    [onChange]
  );

  const handleValidate = useCallback(() => {
    const errors = validateData(data);
    if (errors.length === 0) {
      showSuccess();
    } else {
      showErrors(errors);
    }
  }, [data, showSuccess, showErrors]);

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* ── Seller ── */}
        <SectionTitle>فریق اول — Seller</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Seller Name (اردو)"       name="sellerName"    value={data.sellerName}    onChange={handleChange} placeholder="عبداللہ خان" />
          <Field label="Father's Name (اردو)"     name="sellerFather"  value={data.sellerFather}  onChange={handleChange} placeholder="عصمت اللہ خان" />
          <Field label="Mohalla / Village (اردو)" name="sellerMohalla" value={data.sellerMohalla} onChange={handleChange} placeholder="اما میل" />
          <Field label="تحصیل و ضلع (اردو)"       name="sellerTehsil"  value={data.sellerTehsil}  onChange={handleChange} placeholder="تحصیل و ضلع ٹانک" />
          <Field label="CNIC"                     name="sellerCnic"    value={data.sellerCnic}    onChange={handleChange} placeholder="12345-1234567-1" />
          <Field label="Phone Number"             name="sellerPhone"   value={data.sellerPhone}   onChange={handleChange} placeholder="0300-1234567" />
        </div>

        {/* ── Buyer ── */}
        <SectionTitle>فریق دوم — Buyer</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Buyer Name (اردو)"        name="buyerName"    value={data.buyerName}    onChange={handleChange} placeholder="محمد حسنین خان" />
          <Field label="Father's Name (اردو)"     name="buyerFather"  value={data.buyerFather}  onChange={handleChange} placeholder="محمد جاوید ظفر خان" />
          <Field label="Mohalla / Village (اردو)" name="buyerMohalla" value={data.buyerMohalla} onChange={handleChange} placeholder="گرہی سدوزئی" />
          <Field label="تحصیل و ضلع (اردو)"       name="buyerTehsil"  value={data.buyerTehsil}  onChange={handleChange} placeholder="تحصیل و ضلع ڈیرہ اسماعیل خان" />
          <Field label="CNIC"                     name="buyerCnic"    value={data.buyerCnic}    onChange={handleChange} placeholder="12345-1234567-2" />
          <Field label="Phone Number"             name="buyerPhone"   value={data.buyerPhone}   onChange={handleChange} placeholder="0300-7654321" />
        </div>

        {/* ── Vehicle ── */}
        <SectionTitle>گاڑی کی تفصیل — Vehicle</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Make / Model"     name="carModel"   value={data.carModel}   onChange={handleChange} placeholder="ALTO VXR" />
          <Field label="Registration No." name="regNo"      value={data.regNo}      onChange={handleChange} placeholder="PZ-031" />
          <Field label="Model Year"       name="modelYear"  value={data.modelYear}  onChange={handleChange} placeholder="2010" />
          <Field label="Colour (اردو)"    name="carColor"   value={data.carColor}   onChange={handleChange} placeholder="سفید" />
          <Field label="Engine No."       name="engineNo"   value={data.engineNo}   onChange={handleChange} placeholder="PKR257668" />
          <Field label="Chassis No."      name="chassisNo"  value={data.chassisNo}  onChange={handleChange} placeholder="RA410PK561670" />
        </div>

        {/* ── Number Plate ── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-[10px] text-slate-500" dir="rtl">
            نمبر پلیٹ کی تعداد لکھیں — مثلاً: <span className="font-bold">دو عدد نمبر پلیٹ</span> / <span className="font-bold">ایک عدد نمبر پلیٹ</span>۔ خالی چھوڑنے پر جملے سے خودبخود ہٹ جائے گا۔
          </p>
          <Field
            label="Number Plate (اردو)"
            name="numberPlate"
            value={data.numberPlate}
            onChange={handleChange}
            placeholder="دو عدد نمبر پلیٹ"
          />
        </div>

        {/* ── Payment mode toggle ── */}
        <SectionTitle>قیمت — Payment</SectionTitle>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
          <button
            onClick={() => handleChange("paymentMode", "full")}
            className={`flex-1 py-2.5 transition-colors ${data.paymentMode === "full"
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"}`}
          >
            Full Payment
          </button>
          <button
            onClick={() => handleChange("paymentMode", "advance")}
            className={`flex-1 py-2.5 border-l border-slate-200 transition-colors ${data.paymentMode === "advance"
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"}`}
          >
            Advance + Remaining
          </button>
        </div>

        {/* ── Full Payment ── */}
        {data.paymentMode === "full" && (
          <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 leading-relaxed" dir="rtl">
              سواب فریق اول نے گاڑی بعوض مبلغ{" "}
              <span className="text-blue-600 font-bold">[رقم]</span> روپے{" "}
              (<span className="text-blue-600 font-bold">[الفاظ میں]</span> روپے) فروخت کردی ہے۔
              اور فریق اول نے سالم رقم مبلغ <span className="text-blue-600 font-bold">[رقم]</span> روپے
              نقد روبرو گواہان ازاں فریق دوم وصول کرلیے ہیں۔
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total Amount (figures)"  name="priceNum"   value={data.priceNum}   onChange={handleChange} placeholder="5,95,000" />
              <Field label="Amount in Words (اردو)"  name="priceWords" value={data.priceWords} onChange={handleChange} placeholder="پانچ لاکھ پچانوے ہزار" />
            </div>
          </div>
        )}

        {/* ── Advance + Remaining ── */}
        {data.paymentMode === "advance" && (
          <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 leading-relaxed" dir="rtl">
              سواب فریق اول نے گاڑی بعوض مبلغ کل{" "}
              <span className="text-blue-600 font-bold">[کل رقم]</span> روپے فروخت کردی۔
              پیشگی <span className="text-blue-600 font-bold">[پیشگی رقم]</span> روپے وصول۔
              بقایا <span className="text-blue-600 font-bold">[باقی رقم]</span> روپے مورخہ{" "}
              <span className="text-blue-600 font-bold">[آخری تاریخ]</span> کو ادا کیے جائیں گے۔
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total Amount (figures)"         name="priceNum"       value={data.priceNum}       onChange={handleChange} placeholder="5,95,000" />
              <Field label="Total in Words (اردو)"          name="priceWords"     value={data.priceWords}     onChange={handleChange} placeholder="پانچ لاکھ پچانوے ہزار" />
              <Field label="Advance Amount (figures)"       name="advanceNum"     value={data.advanceNum}     onChange={handleChange} placeholder="2,00,000" />
              <Field label="Advance in Words (اردو)"        name="advanceWords"   value={data.advanceWords}   onChange={handleChange} placeholder="دو لاکھ" />
              <Field label="Remaining Amount (figures)"     name="remainingNum"   value={data.remainingNum}   onChange={handleChange} placeholder="3,95,000" />
              <Field label="Remaining in Words (اردو)"      name="remainingWords" value={data.remainingWords} onChange={handleChange} placeholder="تین لاکھ پچانوے ہزار" />
              <Field label="Due Date for Remaining Payment" name="dueDate"        value={data.dueDate}        onChange={handleChange} type="date" />
            </div>

            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              <TextArea
                label="Custom Remaining Clause (اردو — اختیاری)"
                name="remainingClause"
                value={data.remainingClause}
                onChange={handleChange}
                rows={3}
                placeholder="بقایا رقم اور کاغذات کی حوالگی کے بارے میں خصوصی شرط یہاں لکھیں..."
                hint="خالی چھوڑنے پر معیاری جملہ استعمال ہوگا۔ لکھنے پر یہی متن معاہدے میں شامل ہوگا (بولڈ)۔"
              />
            </div>
          </div>
        )}

        {/* ── Date & Witnesses ── */}
        <SectionTitle>تاریخ اور گواہان — Date & Witnesses</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Contract Date" name="date" value={data.date} onChange={handleChange} type="date" />
          <div />

          <Field label="Witness 1 Name (اردو)" name="witness1Name"   value={data.witness1Name}   onChange={handleChange} placeholder="عبدالحسیب اللہ خان" />
          <Field label="Witness 1 CNIC"         name="witness1Cnic"   value={data.witness1Cnic}   onChange={handleChange} placeholder="12345-1234567-1" />
          <Field label="Witness 1 تحصیل و ضلع"  name="witness1Tehsil" value={data.witness1Tehsil} onChange={handleChange} placeholder="تحصیل و ضلع DIK" />
          <div />

          <Field label="Witness 2 Name (اردو)" name="witness2Name"   value={data.witness2Name}   onChange={handleChange} placeholder="محمد خان ولد خان احمد" />
          <Field label="Witness 2 CNIC"         name="witness2Cnic"   value={data.witness2Cnic}   onChange={handleChange} placeholder="12345-1234567-2" />
          <Field label="Witness 2 تحصیل و ضلع"  name="witness2Tehsil" value={data.witness2Tehsil} onChange={handleChange} placeholder="تحصیل و ضلع DIK" />
        </div>

        {/* ── Extra Conditions ── */}
        <SectionTitle>اضافی شرائط — Extra Conditions</SectionTitle>
        <TextArea
          label="Conditions (اردو — اختیاری)"
          name="conditions"
          value={data.conditions}
          onChange={handleChange}
          rows={4}
          placeholder="کوئی بھی اضافی شرط یا نوٹ یہاں لکھیں جو معاہدے میں شامل کرنی ہو..."
          hint="یہ شرائط معاہدے کے آخر میں 'شرائط:' کے عنوان سے شامل ہوں گی۔ خالی چھوڑنے پر کچھ ظاہر نہیں ہوگا۔"
        />

        {/* ── Validate Button ── */}
        <div className="pt-2 pb-1">
          <button
            onClick={handleValidate}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold tracking-wide transition-all shadow-sm shadow-emerald-200"
          >
            ✔ فارم کی تصدیق کریں — Validate Form
          </button>
        </div>

      </div>

      {/* ── Validation Panel ── */}
      <ValidationPanel panel={panel} onDismiss={dismiss} />
    </>
  );
}