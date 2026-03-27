import { useState, useRef, useEffect, useCallback } from "react";
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
  numberPlate: "دو عدد نمبر پلیٹ",
  remainingClause: "",
  conditions: "",
};

const EMPTY_SIGS = { seller: null, buyer: null, witness1: null, witness2: null };
const EMPTY_FPS  = { sellerFp: null, buyerFp: null, witness1Fp: null, witness2Fp: null };

const STEPS = [
  { id: 1, title: "Stamp Paper",     subtitle: "اسٹامپ پیپر اپلوڈ کریں"    },
  { id: 2, title: "Align",           subtitle: "متن کی پوزیشن طے کریں"      },
  { id: 3, title: "Contract",        subtitle: "معاہدے کی تفصیل بھریں"       },
  { id: 4, title: "Vehicle Images",  subtitle: "گاڑی کی تصاویر اپلوڈ کریں"  },
  { id: 5, title: "Party Photos",    subtitle: "فریقین کی تصاویر"             },
  { id: 6, title: "Signatures",      subtitle: "دستخط اور فنگرپرنٹ"          },
  { id: 7, title: "Preview",         subtitle: "پیش نظارہ دیکھیں"            },
  { id: 8, title: "Export",          subtitle: "PDF محفوظ کریں"              },
];

const STATUS_CONFIG = {
  online:  { label: "Online",  dot: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200"  },
  busy:    { label: "Busy",    dot: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200"  },
  offline: { label: "Offline", dot: "bg-slate-400",  text: "text-slate-600",  bg: "bg-slate-100", border: "border-slate-200"  },
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

  const [currentStep, setCurrentStep]   = useState(1);
  const [pdfData, setPdfData]           = useState(null);
  const [topMargin, setTopMargin]       = useState(200);
  const [fontSize, setFontSize]         = useState(13);
  const [paddingH, setPaddingH]         = useState(98);
  const [contractData, setContractData] = useState(EMPTY_CONTRACT);
  const [sellerPhoto, setSellerPhoto]   = useState(null);
  const [buyerPhoto, setBuyerPhoto]     = useState(null);
  const [signatures, setSignatures]     = useState(EMPTY_SIGS);
  const [fingerprints, setFingerprints] = useState(EMPTY_FPS);
  const [agentStatus, setAgentStatus]   = useState(agent?.status || "online");
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

  const handleFp      = (key, d) => setFingerprints(prev => ({ ...prev, [key]: d }));
  const handleFpClear = (key)    => setFingerprints(prev => ({ ...prev, [key]: null }));

  const getContractText = () => buildContractText(contractData);

  const cycleStatus = async () => {
    if (statusUpdating) return;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(agentStatus) + 1) % STATUS_CYCLE.length];
    setStatusUpdating(true);
    try {
      await agentApi.patch("/agents/status", { status: next });
      setAgentStatus(next);
    } catch { /* ignore */ }
    finally { setStatusUpdating(false); }
  };

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
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-800 leading-none truncate">اقرار نامہ ساز</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Step {currentStep}/{STEPS.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <a href="/stampGenerator/search"
              className="p-2 sm:px-3 sm:py-1.5 text-slate-500 hover:text-emerald-700 border border-slate-200 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </a>

            <button onClick={cycleStatus} disabled={statusUpdating}
              className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-2 py-1.5 sm:px-3 rounded-lg border transition-all ${sc.bg} ${sc.border} ${sc.text}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot} ${agentStatus === "online" ? "animate-pulse" : ""}`}/>
              <span className="hidden xs:block">{sc.label}</span>
            </button>

            {agent && (
              <div className="flex items-center gap-2 shrink-0">
                {agent.pfp ? (
                  <img src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/${agent.pfp}`}
                    alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200"/>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                    {agent.fullName?.[0]}
                  </div>
                )}
              </div>
            )}

            <button onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="h-1 bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}/>
        </div>
      </header>

      {/* ── Step Strip ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center overflow-x-auto no-scrollbar py-3 px-4 gap-2">
            {STEPS.map((s) => (
              <button key={s.id}
                onClick={() => { if (s.id < currentStep || s.id === 1 || pdfData) setCurrentStep(s.id); }}
                className={`flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all
                  ${s.id === currentStep ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                    : s.id < currentStep ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-400 bg-slate-50 cursor-not-allowed"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                  ${s.id === currentStep ? "bg-white text-emerald-600"
                    : s.id < currentStep ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-400"}`}>
                  {s.id < currentStep ? "✓" : s.id}
                </span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">

        <div className="px-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">{STEPS[currentStep - 1].title}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1" dir="rtl">{STEPS[currentStep - 1].subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-7">

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
              chassisNo={contractData.chassisNo} regNo={contractData.regNo} engineNo={contractData.engineNo}
              chassisImg={chassisImg} setChassisImg={setChassisImg}
              carImg={carImg}         setCarImg={setCarImg}
              engineImg={engineImg}   setEngineImg={setEngineImg}
            />
          )}

          {/* 5 — Party photos — with camera support */}
          {currentStep === 5 && (
            <PhotoUploadSection
              sellerPhoto={sellerPhoto} buyerPhoto={buyerPhoto}
              onSellerPhoto={setSellerPhoto} onBuyerPhoto={setBuyerPhoto}
            />
          )}

          {/* 6 — Signatures + Fingerprints */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-8">
              {/* Signatures */}
              <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">✍️ Signatures — دستخط</p>
                <p className="text-xs text-slate-500">دستخط کے لیے انگلی یا قلم کا استعمال کریں۔</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

              {/* Fingerprints */}
              <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">🖐 Fingerprints — فنگرپرنٹ</p>
                <p className="text-xs text-slate-500">
                  فنگرپرنٹ اسکینر کی تصویر اپلوڈ کریں یا کیمرہ سے کیپچر کریں۔
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: "sellerFp",   label: "Seller",   sub: "فریق اول" },
                    { key: "buyerFp",    label: "Buyer",    sub: "فریق دوم" },
                    { key: "witness1Fp", label: "Witness 1", sub: "گواہ ۱"  },
                    { key: "witness2Fp", label: "Witness 2", sub: "گواہ ۲"  },
                  ].map(({ key, label, sub }) => (
                    <FingerprintBox
                      key={key}
                      label={label}
                      sub={sub}
                      value={fingerprints[key]}
                      onCapture={(d) => handleFp(key, d)}
                      onClear={() => handleFpClear(key)}
                      inputId={`fp-${key}`}
                    />
                  ))}
                </div>
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
                vehicleImages={{ chassisImg, carImg, engineImg }}
                fingerprints={fingerprints}
              />
            </div>
          )}
        </div>

        {/* ── Footer Nav ── */}
        <div className="flex items-center justify-between gap-3 px-1">
          <button onClick={goPrev} disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-3 sm:px-5 rounded-xl text-sm font-semibold transition-all
              ${currentStep === 1
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="hidden xs:block">Back</span>
          </button>

          {currentStep < STEPS.length ? (
            <button onClick={goNext} disabled={!canNext}
              className={`flex items-center gap-2 px-6 py-3 sm:px-8 rounded-xl text-sm font-semibold transition-all
                ${!canNext
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95"}`}>
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          ) : (
            <button onClick={() => {
              setCurrentStep(1); setPdfData(null);
              setContractData(EMPTY_CONTRACT); setSignatures(EMPTY_SIGS); setFingerprints(EMPTY_FPS);
              setSellerPhoto(null); setBuyerPhoto(null);
              setChassisImg(null); setCarImg(null); setEngineImg(null);
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

/* ── Vehicle Image Step ── */
function VehicleImageStep({ chassisNo, regNo, engineNo, chassisImg, setChassisImg, carImg, setCarImg, engineImg, setEngineImg }) {
  const boxes = [
    { label: "Chassis", sub: chassisNo, state: chassisImg, setState: setChassisImg, id: "chassis-img", icon: "🔩" },
    { label: "Car",     sub: regNo,     state: carImg,     setState: setCarImg,     id: "car-img",     icon: "🚗" },
    { label: "Engine",  sub: engineNo,  state: engineImg,  setState: setEngineImg,  id: "engine-img",  icon: "⚙️" },
  ];
  const toDataURL = (file, cb) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => cb(e.target.result);
    r.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {boxes.map(({ label, sub, state, setState, id, icon }) => (
          <div key={id} className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{icon} {label}</p>
            {state ? (
              <div className="relative aspect-video sm:aspect-square">
                <img src={state} alt="" className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm"/>
                <button onClick={() => setState(null)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow">✕</button>
              </div>
            ) : (
              <div onClick={() => document.getElementById(id).click()}
                className="w-full aspect-video sm:aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                <span className="text-xl opacity-50">{icon}</span>
                <p className="text-[10px] font-bold text-slate-400">UPLOAD</p>
              </div>
            )}
            {/* Back camera input */}
            <input id={id} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => toDataURL(e.target.files[0], setState)} />
          </div>
        ))}
      </div>
      <p className="text-[10px] sm:text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
        ⚠️ گاڑی کا چیسیز، رجسٹریشن اور انجن نمبر پہلے لکھیں (Step 3) تاکہ فائلز ان ہی ناموں سے محفوظ ہوں۔
      </p>
    </div>
  );
}

/* ── Photo Upload with Camera ── */
function PhotoUploadSection({ sellerPhoto, buyerPhoto, onSellerPhoto, onBuyerPhoto }) {
  const toDataURL = (file, cb) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => cb(e.target.result);
    r.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-500">
        📷 تصویر گیلری سے منتخب کریں یا کیمرہ آئیکن سے براہ راست کیمرے سے لیں۔
      </p>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        <PhotoBox label="فریق اول — Seller" photo={sellerPhoto}
          onPhoto={(f) => toDataURL(f, onSellerPhoto)} onClear={() => onSellerPhoto(null)}
          galleryId="seller-gallery" cameraId="seller-camera" />
        <PhotoBox label="فریق دوم — Buyer" photo={buyerPhoto}
          onPhoto={(f) => toDataURL(f, onBuyerPhoto)} onClear={() => onBuyerPhoto(null)}
          galleryId="buyer-gallery" cameraId="buyer-camera" />
      </div>
    </div>
  );
}

function PhotoBox({ label, photo, onPhoto, onClear, galleryId, cameraId }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {photo ? (
        <div className="relative aspect-[4/5]">
          <img src={photo} alt="" className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm"/>
          <button onClick={onClear}
            className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-slate-500 hover:text-red-500">✕</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Gallery pick */}
          <div onClick={() => document.getElementById(galleryId).click()}
            className="w-full aspect-[4/5] rounded-xl border-2 border-dashed border-slate-200 hover:bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group">
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p className="text-xs text-slate-400">Gallery</p>
          </div>
          {/* Camera capture button */}
          <button onClick={() => document.getElementById(cameraId).click()}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Open Camera
          </button>
        </div>
      )}
      {/* Gallery input — no capture attribute = file picker */}
      <input id={galleryId} type="file" accept="image/*" className="hidden"
        onChange={(e) => onPhoto(e.target.files[0])} />
      {/* Camera input — capture="environment" = back camera on tablets */}
      <input id={cameraId} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => onPhoto(e.target.files[0])} />
    </div>
  );
}

/* ── Fingerprint Upload Box ── */
function FingerprintBox({ label, sub, value, onCapture, onClear, inputId }) {
  const toDataURL = (file, cb) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => cb(e.target.result);
    r.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400" dir="rtl">{sub}</p>
      </div>

      {value ? (
        <div className="relative w-full aspect-square">
          <img 
            src={value} 
            alt="fingerprint"
            className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm" 
            style={{ filter: "contrast(1.5) grayscale(1)" }}
          />
          <button onClick={onClear}
            className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] shadow text-slate-500 hover:text-red-500">
            ✕
          </button>
        </div>
      ) : (
        <div onClick={() => document.getElementById(inputId).click()}
          className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
          <svg className="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2C8 2 5 5.5 5 9c0 5 3 9 7 13" strokeLinecap="round"/>
            <path d="M12 2c4 0 7 3.5 7 7 0 5-3 9-7 13" strokeLinecap="round"/>
            <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3c0 3-1.5 6-3 9" strokeLinecap="round"/>
          </svg>
          <p className="text-[9px] font-bold text-slate-300 uppercase">Gallery</p>
        </div>
      )}

      {/* REMOVED capture="environment" to ensure Gallery opens instead of Camera */}
      <input 
        id={inputId} 
        type="file" 
        accept="image/*" 
        className="hidden"
        onChange={(e) => toDataURL(e.target.files[0], onCapture)} 
      />
    </div>
  );
}

/* ── Contract Preview ── */
function ContractPreview({ previewRef, pdfData, topMargin, fontSize, paddingH, contractData, sellerPhoto, buyerPhoto, signatures, agentName }) {
  const canvasRef     = useRef(null);
  const wrapperRef    = useRef(null);
  const renderTaskRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(pdfData?.canvasWidth || 900);

  useEffect(() => {
    if (!pdfData?.pdfDoc) return;
    let cancelled = false;
    const render = async () => {
      if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch (_) {} renderTaskRef.current = null; }
      const page     = await pdfData.pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas   = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width = viewport.width; canvas.height = viewport.height;
      const task = page.render({ canvasContext: canvas.getContext("2d"), viewport });
      renderTaskRef.current = task;
      try { await task.promise; }
      catch (e) { if (e?.name !== "RenderingCancelledException") console.error(e); }
      finally { if (!cancelled) renderTaskRef.current = null; }
    };
    render();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch (_) {} }
    };
  }, [pdfData]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setDisplayWidth(e.contentRect.width);
    });
    ro.observe(el);
    setDisplayWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1 sm:p-2">
      <div ref={wrapperRef} className="relative w-full overflow-hidden rounded-lg shadow bg-white"
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
          {/* Agent watermark */}
          {agentName && (
            <div
              data-agent-watermark="true"
              style={{
                position:   "absolute",
                bottom:     `${1.5 * (displayWidth / (pdfData.canvasWidth || 900))}rem`,
                right:      `${1.5 * (displayWidth / (pdfData.canvasWidth || 900))}rem`,
                fontSize:   `${10 * (displayWidth / (pdfData.canvasWidth || 900))}px`,
                color:      "#555",
                fontFamily: "serif",
                fontStyle:  "italic",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {agentName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}