// ContractForm.jsx

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

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest whitespace-nowrap">{children}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

export default function ContractForm({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Seller ── */}
      <SectionTitle>فریق اول — Seller</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Seller Name (اردو)" name="sellerName" value={data.sellerName} onChange={onChange} placeholder="عبداللہ خان" />
        <Field label="Father's Name (اردو)" name="sellerFather" value={data.sellerFather} onChange={onChange} placeholder="عصمت اللہ خان" />
        <Field label="Mohalla / Village (اردو)" name="sellerMohalla" value={data.sellerMohalla} onChange={onChange} placeholder="اما میل" />
        <Field label="تحصیل و ضلع (اردو)" name="sellerTehsil" value={data.sellerTehsil} onChange={onChange} placeholder="تحصیل و ضلع ٹانک" />
        <Field label="CNIC" name="sellerCnic" value={data.sellerCnic} onChange={onChange} placeholder="12345-1234567-1" />
      </div>

      {/* ── Buyer ── */}
      <SectionTitle>فریق دوم — Buyer</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Buyer Name (اردو)" name="buyerName" value={data.buyerName} onChange={onChange} placeholder="محمد حسنین خان" />
        <Field label="Father's Name (اردو)" name="buyerFather" value={data.buyerFather} onChange={onChange} placeholder="محمد جاوید ظفر خان" />
        <Field label="Mohalla / Village (اردو)" name="buyerMohalla" value={data.buyerMohalla} onChange={onChange} placeholder="گرہی سدوزئی" />
        <Field label="تحصیل و ضلع (اردو)" name="buyerTehsil" value={data.buyerTehsil} onChange={onChange} placeholder="تحصیل و ضلع ڈیرہ اسماعیل خان" />
        <Field label="CNIC" name="buyerCnic" value={data.buyerCnic} onChange={onChange} placeholder="12345-1234567-2" />
      </div>

      {/* ── Vehicle ── */}
      <SectionTitle>گاڑی کی تفصیل — Vehicle</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Make / Model" name="carModel" value={data.carModel} onChange={onChange} placeholder="ALTO VXR" />
        <Field label="Registration No." name="regNo" value={data.regNo} onChange={onChange} placeholder="PZ-031" />
        <Field label="Model Year" name="modelYear" value={data.modelYear} onChange={onChange} placeholder="2010" />
        <Field label="Colour (اردو)" name="carColor" value={data.carColor} onChange={onChange} placeholder="سفید" />
        <Field label="Engine No." name="engineNo" value={data.engineNo} onChange={onChange} placeholder="PKR257668" />
        <Field label="Chassis No." name="chassisNo" value={data.chassisNo} onChange={onChange} placeholder="RA410PK561670" />
      </div>

      {/* ── Payment mode toggle ── */}
      <SectionTitle>قیمت — Payment</SectionTitle>
      <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
        <button
          onClick={() => onChange("paymentMode", "full")}
          className={`flex-1 py-2.5 transition-colors ${data.paymentMode === "full"
            ? "bg-emerald-600 text-white"
            : "bg-white text-slate-500 hover:bg-slate-50"}`}
        >
          Full Payment
        </button>
        <button
          onClick={() => onChange("paymentMode", "advance")}
          className={`flex-1 py-2.5 border-l border-slate-200 transition-colors ${data.paymentMode === "advance"
            ? "bg-emerald-600 text-white"
            : "bg-white text-slate-500 hover:bg-slate-50"}`}
        >
          Advance + Remaining
        </button>
      </div>

      {/* ── Full Payment fields ── */}
      {data.paymentMode === "full" && (
        <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 leading-relaxed" dir="rtl">
            فریق اول نے گاڑی مذکورہ بالامعہ کاغذات بدست فریق دوم بعوض مبلغ{" "}
            <span className="text-blue-600 font-bold">[رقم]</span> روپے{" "}
            (<span className="text-blue-600 font-bold">[الفاظ میں]</span> روپے) فروخت کردی۔
            فریق دوم نے کل رقم مبلغ <span className="text-blue-600 font-bold">[رقم]</span> روپے
            نقد روبرو گواہان ادا کردی۔
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total Amount (figures)" name="priceNum" value={data.priceNum} onChange={onChange} placeholder="5,95,000" />
            <Field label="Amount in Words (اردو)" name="priceWords" value={data.priceWords} onChange={onChange} placeholder="پانچ لاکھ پچانوے ہزار" />
          </div>
        </div>
      )}

      {/* ── Advance + Remaining fields ── */}
      {data.paymentMode === "advance" && (
        <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 leading-relaxed" dir="rtl">
            فریق اول نے گاڑی مذکورہ بالا بعوض مبلغ کل{" "}
            <span className="text-blue-600 font-bold">[کل رقم]</span> روپے{" "}
            (<span className="text-blue-600 font-bold">[الفاظ میں]</span> روپے) فروخت کردی۔
            جس میں سے بعنوان پیشگی مبلغ{" "}
            <span className="text-blue-600 font-bold">[پیشگی رقم]</span> روپے{" "}
            (<span className="text-blue-600 font-bold">[الفاظ میں]</span> روپے) نقد وصول کیے۔
            بقایا مبلغ <span className="text-blue-600 font-bold">[باقی رقم]</span> روپے{" "}
            (<span className="text-blue-600 font-bold">[الفاظ میں]</span> روپے) مورخہ{" "}
            <span className="text-blue-600 font-bold">[آخری تاریخ]</span> کو ادا کیے جائیں گے۔
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total Amount (figures)" name="priceNum" value={data.priceNum} onChange={onChange} placeholder="5,95,000" />
            <Field label="Total in Words (اردو)" name="priceWords" value={data.priceWords} onChange={onChange} placeholder="پانچ لاکھ پچانوے ہزار" />
            <Field label="Advance Amount (figures)" name="advanceNum" value={data.advanceNum} onChange={onChange} placeholder="2,00,000" />
            <Field label="Advance in Words (اردو)" name="advanceWords" value={data.advanceWords} onChange={onChange} placeholder="دو لاکھ" />
            <Field label="Remaining Amount (figures)" name="remainingNum" value={data.remainingNum} onChange={onChange} placeholder="3,95,000" />
            <Field label="Remaining in Words (اردو)" name="remainingWords" value={data.remainingWords} onChange={onChange} placeholder="تین لاکھ پچانوے ہزار" />
            <Field label="Due Date for Remaining Payment" name="dueDate" value={data.dueDate} onChange={onChange} type="date" />
          </div>
        </div>
      )}

      {/* ── Date & Witnesses ── */}
      <SectionTitle>تاریخ اور گواہان — Date & Witnesses</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Contract Date" name="date" value={data.date} onChange={onChange} type="date" />
        <div />
        <Field label="Witness 1 Name (اردو)" name="witness1Name" value={data.witness1Name} onChange={onChange} placeholder="عبدالحسیب اللہ خان" />
        <Field label="Witness 1 CNIC" name="witness1Cnic" value={data.witness1Cnic} onChange={onChange} placeholder="121-1-389044-1" />
        <Field label="Witness 1 تحصیل و ضلع" name="witness1Tehsil" value={data.witness1Tehsil} onChange={onChange} placeholder="تحصیل و ضلع DIK" />
        <div />
        <Field label="Witness 2 Name (اردو)" name="witness2Name" value={data.witness2Name} onChange={onChange} placeholder="محمد خان ولد خان احمد" />
        <Field label="Witness 2 CNIC" name="witness2Cnic" value={data.witness2Cnic} onChange={onChange} placeholder="121-1-389044-1" />
        <Field label="Witness 2 تحصیل و ضلع" name="witness2Tehsil" value={data.witness2Tehsil} onChange={onChange} placeholder="تحصیل و ضلع DIK" />
      </div>

    </div>
  );
}