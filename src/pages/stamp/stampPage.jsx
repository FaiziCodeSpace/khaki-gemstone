import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StampUpload    from "../../components/stampGenerator/StampUpload";
import MarginControl  from "../../components/stampGenerator/MarginControl";
import ContractForm   from "../../components/stampGenerator/ContractForm";
import ContractTemplate from "../../components/stampGenerator/ContractTemplate";
import SignaturePad   from "../../components/stampGenerator/Signaturepad";
import UrduNarrator   from "../../components/stampGenerator/UrduNarrator";
import ExportButton   from "../../components/stampGenerator/Exportbutton";
import { useAgentAuth } from "../../context/Agentauthcontext";
import agentApi from "../../services/agentServices/api.agentService";

const EMPTY_CONTRACT = {
  sellerName: "", sellerFather: "", sellerMohalla: "", sellerTehsil: "", sellerCnic: "",
  buyerName: "", buyerFather: "", buyerMohalla: "", buyerTehsil: "", buyerCnic: "",
  carModel: "", regNo: "", modelYear: "", engineNo: "", chassisNo: "", carColor: "",
  paymentMode: "full",
  priceNum: "", priceWords: "",
  advanceNum: "", advanceWords: "",
  remainingNum: "", remainingWords: "",
  dueDate: "",
  date: "",
  witness1Name: "", witness1Cnic: "", witness1Tehsil: "",
  witness2Name: "", witness2Cnic: "", witness2Tehsil: "",
};

const EMPTY_SIGS = { seller: null, buyer: null, witness1: null, witness2: null };

const STEPS = [
  { id: 1, title: "Stamp Paper",     subtitle: "اسٹامپ پیپر اپلوڈ کریں" },
  { id: 2, title: "Align",           subtitle: "متن کی پوزیشن طے کریں"   },
  { id: 3, title: "Contract",        subtitle: "معاہدے کی تفصیل بھریں"    },
  { id: 4, title: "Vehicle Images",  subtitle: "گاڑی کی تصاویر اپلوڈ کریں" },
  { id: 5, title: "Party Photos",    subtitle: "فریقین کی تصاویر"          },
  { id: 6, title: "Signatures",      subtitle: "دستخط کریں"               },
  { id: 7, title: "Preview",         subtitle: "پیش نظارہ دیکھیں"         },
  { id: 8, title: "Export",          subtitle: "PDF محفوظ کریں"           },
];

const STATUS_CONFIG = {
  online:  { label: "Online",  dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  busy:    { label: "Busy",    dot: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  offline: { label: "Offline", dot: "bg-slate-400",  text: "text-slate-600",  bg: "bg-slate-100", border: "border-slate-200" },
};
const STATUS_CYCLE = ["online", "busy", "offline"];

function buildContractText(d) {
  if (!d) return "";
  const fmt = (v) => v || "خالی";
  const fmtDate = (v) => {
    if (!v) return "تاریخ نامعلوم";
    const [y, m, day] = v.split("-");
    return `${day} ${m} ${y}`;
  };
  const payPara = d.paymentMode === "advance"
    ? `فریق اول نے گاڑی بعوض مبلغ کل ${fmt(d.priceNum)} روپے یعنی ${fmt(d.priceWords)} روپے فروخت کردی ہے۔ بعنوان پیشگی ${fmt(d.advanceNum)} روپے یعنی ${fmt(d.advanceWords)} روپے وصول کیے۔ بقایا ${fmt(d.remainingNum)} روپے مورخہ ${fmtDate(d.dueDate)} کو ادا کیے جائیں گے۔`
    : `فریق اول نے گاڑی بعوض مبلغ ${fmt(d.priceNum)} روپے یعنی ${fmt(d.priceWords)} روپے فروخت کردی اور فریق دوم نے کل رقم ادا کردی۔`;
  return `اقرار نامہ گاڑی\n\nمالک ${fmt(d.sellerName)} ولد ${fmt(d.sellerFather)} ساکنہ ${fmt(d.sellerMohalla)} ${fmt(d.sellerTehsil)}، فریق اول۔\n${fmt(d.buyerName)} ولد ${fmt(d.buyerFather)} ساکنہ ${fmt(d.buyerMohalla)} ${fmt(d.buyerTehsil)}، فریق دوم۔\n\nگاڑی نمبر ${fmt(d.regNo)}، ماڈل ${fmt(d.carModel)}، سال ${fmt(d.modelYear)}، انجن ${fmt(d.engineNo)}، چیسیز ${fmt(d.chassisNo)}، رنگ ${fmt(d.carColor)}۔\n\n${payPara}\n\nمورخہ ${fmtDate(d.date)}`.trim();
}

export default function StampGeneratorApp() {
  const { agent, logout } = useAgentAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [pdfData, setPdfData]         = useState(null);
  const [topMargin, setTopMargin]     = useState(200);
  const [fontSize, setFontSize]       = useState(13);
  const [paddingH, setPaddingH]       = useState(98);
  const [contractData, setContractData] = useState(EMPTY_CONTRACT);
  const [sellerPhoto, setSellerPhoto] = useState(null);
  const [buyerPhoto, setBuyerPhoto]   = useState(null);
  const [signatures, setSignatures]   = useState(EMPTY_SIGS);
  const [agentStatus, setAgentStatus] = useState(agent?.status || "online");
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Vehicle images
  const [chassisImg, setChassisImg] = useState(null);
  const [carImg, setCarImg]         = useState(null);
  const [engineImg, setEngineImg]   = useState(null);

  const previewRef = useRef(null);

  const handlePdfLoaded = (data) => {
    setPdfData(data);
    setTopMargin(Math.round(data.canvasHeight * 0.20));
  };

  const handleFieldChange = (field, value) =>
    setContractData(prev => ({ ...prev, [field]: value }));

  const handleSig      = (key, d) => setSignatures(prev => ({ ...prev, [key]: d }));
  const handleSigClear = (key)    => setSignatures(prev => ({ ...prev, [key]: null }));
  const getContractText = () => buildContractText(contractData);

  // ── Status cycle ──
  const cycleStatus = async () => {
    if (statusUpdating) return;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(agentStatus) + 1) % STATUS_CYCLE.length];
    setStatusUpdating(true);
    try {
      await agentApi.patch("/agents/status", { status: next });
      setAgentStatus(next);
    } catch { /* ignore — UI already optimistic */ }
    finally { setStatusUpdating(false); }
  };

  // ── Logout ──
  const handleLogout = async () => {
    await logout();
    navigate("/agent/login", { replace: true });
  };

  const canNext = currentStep === 1 ? !!pdfData : true;
  const goNext  = () => { if (canNext && currentStep < STEPS.length) setCurrentStep(s => s + 1); };
  const goPrev  = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentStep]);

  const previewProps = { pdfData, topMargin, fontSize, paddingH, contractData, sellerPhoto, buyerPhoto, signatures, agentName: agent?.fullName };
  const sc = STATUS_CONFIG[agentStatus];

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');`}</style>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-800 leading-none truncate">اقرار نامہ ساز</h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Step {currentStep}/{STEPS.length}</p>
            </div>
          </div>

          {/* Search contracts link */}
          <a href="/stampGenerator/search"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Search
          </a>

          {/* Status toggle */}
          <button
            onClick={cycleStatus}
            disabled={statusUpdating}
            title="Click to change status"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${sc.bg} ${sc.border} ${sc.text}`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot} ${agentStatus === "online" ? "animate-pulse" : ""}`}/>
            <span className="hidden sm:block">{sc.label}</span>
          </button>

          {/* Agent name + avatar */}
          {agent && (
            <div className="flex items-center gap-2 shrink-0">
              {agent.pfp ? (
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace("/api","")}/${agent.pfp}`}
                  alt={agent.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                  {agent.fullName?.[0] || "A"}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 hidden sm:block truncate max-w-[100px]">
                {agent.fullName}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}/>
        </div>
      </header>

      {/* ── Step strip ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-0 py-3">
            {STEPS.map((s) => (
              <button key={s.id}
                onClick={() => { if (s.id < currentStep || s.id === 1 || pdfData) setCurrentStep(s.id); }}
                className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors
                  ${s.id === currentStep ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : s.id < currentStep ? "text-emerald-600 hover:bg-emerald-50"
                    : "text-slate-400 cursor-not-allowed"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${s.id === currentStep ? "bg-emerald-600 text-white"
                    : s.id < currentStep ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-400"}`}>
                  {s.id < currentStep ? "✓" : s.id}
                </span>
                <span className="hidden md:block">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        <div>
          <h2 className="text-xl font-bold text-slate-800">{STEPS[currentStep - 1].title}</h2>
          <p className="text-sm text-slate-500 mt-1" dir="rtl">{STEPS[currentStep - 1].subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">

          {/* 1 — Stamp upload */}
          {currentStep === 1 && <StampUpload onPdfLoaded={handlePdfLoaded} />}

          {/* 2 — Align */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <MarginControl
                topMargin={topMargin} onTopMargin={setTopMargin}
                fontSize={fontSize}   onFontSize={setFontSize}
                paddingH={paddingH}   onPaddingH={setPaddingH}
                canvasHeight={pdfData?.canvasHeight}
              />
              {pdfData && <ContractPreview {...previewProps} />}
            </div>
          )}

          {/* 3 — Contract form */}
          {currentStep === 3 && <ContractForm data={contractData} onChange={handleFieldChange} />}

          {/* 4 — Vehicle images */}
          {currentStep === 4 && (
            <VehicleImageStep
              chassisNo={contractData.chassisNo}
              regNo={contractData.regNo}
              engineNo={contractData.engineNo}
              chassisImg={chassisImg} setChassisImg={setChassisImg}
              carImg={carImg}         setCarImg={setCarImg}
              engineImg={engineImg}   setEngineImg={setEngineImg}
            />
          )}

          {/* 5 — Party photos */}
          {currentStep === 5 && (
            <PhotoUploadSection
              sellerPhoto={sellerPhoto} buyerPhoto={buyerPhoto}
              onSellerPhoto={setSellerPhoto} onBuyerPhoto={setBuyerPhoto}
            />
          )}

          {/* 6 — Signatures */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-slate-500">Use finger, stylus, or mouse. Tap for a dot, drag for a line.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { key: "seller",   label: "فریق اول — Seller"  },
                  { key: "buyer",    label: "فریق دوم — Buyer"   },
                  { key: "witness1", label: "گواہ ۱ — Witness 1" },
                  { key: "witness2", label: "گواہ ۲ — Witness 2" },
                ].map(({ key, label }) => (
                  <SignaturePad key={key} label={label}
                    value={signatures[key]}
                    onSave={(d) => handleSig(key, d)}
                    onClear={() => handleSigClear(key)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 7 — Preview */}
          {currentStep === 7 && pdfData && (
            <div className="flex flex-col gap-5">
              <ContractPreview previewRef={previewRef} {...previewProps} />
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span>🔊</span>
                  <h3 className="text-sm font-semibold text-slate-700">آواز سے پڑھیں</h3>
                </div>
                <UrduNarrator getText={getContractText} />
              </div>
            </div>
          )}

          {/* 8 — Export */}
          {currentStep === 8 && pdfData && (
            <div className="flex flex-col gap-6">
              <ContractPreview previewRef={previewRef} {...previewProps} />
              <ExportButton
                previewRef={previewRef}
                contractData={contractData}
                pdfDoc={pdfData.pdfDoc}
                canvasWidth={pdfData.canvasWidth}
                canvasHeight={pdfData.canvasHeight}
                vehicleImages={{ chassisImg, carImg, engineImg }}
              />
            </div>
          )}

        </div>

        {/* ── Nav buttons ── */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={goPrev} disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all
              ${currentStep === 1
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          <span className="text-xs text-slate-400 hidden sm:block">{STEPS[currentStep - 1].title}</span>

          {currentStep < STEPS.length ? (
            <button onClick={goNext} disabled={!canNext}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all
                ${!canNext
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95"}`}>
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentStep(1); setPdfData(null);
                setContractData(EMPTY_CONTRACT); setSignatures(EMPTY_SIGS);
                setSellerPhoto(null); setBuyerPhoto(null);
                setChassisImg(null); setCarImg(null); setEngineImg(null);
                setFontSize(13); setPaddingH(98);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-slate-600 hover:bg-slate-700 text-white shadow-sm">
              New Contract
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          )}
        </div>

      </main>
    </div>
  );
}

/* ── Vehicle Image Upload Step ── */
function VehicleImageStep({ chassisNo, regNo, engineNo, chassisImg, setChassisImg, carImg, setCarImg, engineImg, setEngineImg }) {
  const boxes = [
    { label: "Chassis Photo",     sublabel: `Saved as: ${chassisNo || "chassis number"}`, state: chassisImg, setState: setChassisImg, id: "chassis-img", icon: "🔩" },
    { label: "Car Photo",         sublabel: `Saved as: ${regNo     || "reg number"}`,     state: carImg,     setState: setCarImg,     id: "car-img",     icon: "🚗" },
    { label: "Engine Photo",      sublabel: `Saved as: ${engineNo  || "engine number"}`,  state: engineImg,  setState: setEngineImg,  id: "engine-img",  icon: "⚙️" },
  ];

  const toDataURL = (file, cb) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => cb(e.target.result);
    r.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-slate-500">
        Upload photos of the vehicle. These will be saved to the server using the chassis, registration, and engine numbers as filenames.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {boxes.map(({ label, sublabel, state, setState, id, icon }) => (
          <div key={id} className="flex flex-col gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-700">{icon} {label}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">{sublabel}</p>
            </div>
            {state ? (
              <div className="relative">
                <img src={state} alt={label} className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-sm"/>
                <button onClick={() => setState(null)}
                  className="absolute top-2 right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">
                  ✕
                </button>
              </div>
            ) : (
              <div onClick={() => document.getElementById(id).click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-xl">
                  {icon}
                </div>
                <p className="text-xs text-slate-400 group-hover:text-emerald-600">Upload photo</p>
              </div>
            )}
            <input id={id} type="file" accept="image/*" className="hidden"
              onChange={(e) => toDataURL(e.target.files[0], setState)} />
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        ⚠️ Fill in Chassis No, Reg No, and Engine No in Step 3 first — they are used as the filenames.
      </p>
    </div>
  );
}

/* ── Photo Upload ── */
function PhotoUploadSection({ sellerPhoto, buyerPhoto, onSellerPhoto, onBuyerPhoto }) {
  const toDataURL = (file, cb) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => cb(e.target.result);
    r.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">Upload passport-style photos. Seller on the right, Buyer on the left.</p>
      <div className="grid grid-cols-2 gap-5">
        <PhotoBox label="فریق اول — Seller" sublabel="Right side" photo={sellerPhoto}
          onPhoto={(f) => toDataURL(f, onSellerPhoto)} onClear={() => onSellerPhoto(null)} inputId="seller-photo"/>
        <PhotoBox label="فریق دوم — Buyer" sublabel="Left side" photo={buyerPhoto}
          onPhoto={(f) => toDataURL(f, onBuyerPhoto)} onClear={() => onBuyerPhoto(null)} inputId="buyer-photo"/>
      </div>
    </div>
  );
}

function PhotoBox({ label, sublabel, photo, onPhoto, onClear, inputId }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>
      </div>
      {photo ? (
        <div className="relative">
          <img src={photo} alt="party" className="w-full h-44 object-cover rounded-xl border border-slate-200 shadow-sm"/>
          <button onClick={onClear}
            className="absolute top-2 right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full w-7 h-7 flex items-center justify-center shadow">✕</button>
        </div>
      ) : (
        <div onClick={() => document.getElementById(inputId).click()}
          className="w-full h-44 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group">
          <div className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <p className="text-sm text-slate-400 group-hover:text-emerald-600">Upload photo</p>
        </div>
      )}
      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files[0])}/>
    </div>
  );
}

/* ── Contract Preview (with agent name watermark) ── */
function ContractPreview({ previewRef, pdfData, topMargin, fontSize, paddingH, contractData, sellerPhoto, buyerPhoto, signatures, agentName }) {
  const canvasRef     = useRef(null);
  const wrapperRef    = useRef(null);
  const renderTaskRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(pdfData?.canvasWidth || 900);

  useEffect(() => {
    if (!pdfData?.pdfDoc) return;
    let cancelled = false;
    const render = async () => {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
        renderTaskRef.current = null;
      }
      const page     = await pdfData.pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas   = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      const task = page.render({ canvasContext: canvas.getContext("2d"), viewport });
      renderTaskRef.current = task;
      try { await task.promise; }
      catch (e) { if (e?.name !== "RenderingCancelledException") console.error(e); }
      finally { if (!cancelled) renderTaskRef.current = null; }
    };
    render();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch (_) {} renderTaskRef.current = null; }
    };
  }, [pdfData]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setDisplayWidth(e.contentRect.width);
    });
    ro.observe(el);
    setDisplayWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
      <div ref={wrapperRef} className="relative w-full overflow-hidden rounded-lg shadow"
        style={{ paddingBottom: `${(pdfData.canvasHeight / pdfData.canvasWidth) * 100}%` }}>

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block"/>

        <div ref={previewRef} data-export-preview="true" className="absolute inset-0">
          <div data-contract-overlay="true" style={{ position: "absolute", inset: 0 }}>
            <ContractTemplate
              topMargin={topMargin}
              canvasWidth={pdfData.canvasWidth}
              displayWidth={displayWidth}
              fontSize={fontSize}
              paddingH={paddingH}
              data={contractData}
              sellerPhoto={sellerPhoto}
              buyerPhoto={buyerPhoto}
              signatures={signatures}
            />
          </div>

          {/* ── Agent name watermark — bottom right ── */}
          {agentName && (
            <div style={{
              position:   "absolute",
              bottom:     "1.5rem",
              right:      "1.5rem",
              fontSize:   `${11 * (displayWidth / (pdfData.canvasWidth || 900))}px`,
              color:      "#555",
              fontFamily: "serif",
              pointerEvents: "none",
              userSelect: "none",
            }}>
              {agentName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}