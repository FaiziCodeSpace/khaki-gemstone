import { useState, useRef, useEffect } from "react";
import StampUpload from "../../components/stampGenerator/StampUpload";
import MarginControl from "../../components/stampGenerator/MarginControl";
import ContractForm from "../../components/stampGenerator/ContractForm";
import ContractTemplate from "../../components/stampGenerator/ContractTemplate";
import SignaturePad from "../../components/stampGenerator/Signaturepad";
import UrduNarrator from "../../components/stampGenerator/UrduNarrator";
import ExportButton from "../../components/stampGenerator/Exportbutton";

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
  { id: 1, title: "Stamp Paper",  subtitle: "اسٹامپ پیپر اپلوڈ کریں" },
  { id: 2, title: "Align",        subtitle: "متن کی پوزیشن طے کریں"   },
  { id: 3, title: "Contract",     subtitle: "معاہدے کی تفصیل بھریں"    },
  { id: 4, title: "Photos",       subtitle: "تصاویر اپلوڈ کریں"        },
  { id: 5, title: "Signatures",   subtitle: "دستخط کریں"               },
  { id: 6, title: "Preview",      subtitle: "پیش نظارہ دیکھیں"         },
  { id: 7, title: "Export",       subtitle: "PDF محفوظ کریں"           },
];

function buildContractText(d) {
  if (!d) return "";
  const fmt = (val) => val || "خالی";
  const fmtDate = (val) => {
    if (!val) return "تاریخ نامعلوم";
    const [y, m, day] = val.split("-");
    return `${day} ${m} ${y}`;
  };
  const paymentPara = d.paymentMode === "advance"
    ? `فریق اول نے گاڑی مذکورہ بالا بعوض مبلغ کل ${fmt(d.priceNum)} روپے یعنی ${fmt(d.priceWords)} روپے فروخت کردی ہے۔ جس میں سے بعنوان پیشگی مبلغ ${fmt(d.advanceNum)} روپے یعنی ${fmt(d.advanceWords)} روپے نقد روبرو گواہان از فریق دوم وصول کرلیے ہیں۔ بقایا مبلغ ${fmt(d.remainingNum)} روپے یعنی ${fmt(d.remainingWords)} روپے مورخہ ${fmtDate(d.dueDate)} کو ادا کیے جائیں گے۔`
    : `فریق اول نے گاڑی مذکورہ بالا بعوض مبلغ ${fmt(d.priceNum)} روپے یعنی ${fmt(d.priceWords)} روپے فروخت کردی ہے۔ فریق دوم نے کل رقم نقد روبرو گواہان ادا کردی اور فریق اول نے وصول کرلی۔ اور کوئی مطالبہ باقی نہیں۔`;
  return `اقرار نامہ گاڑی۔\n\nمالک ${fmt(d.sellerName)} ولد ${fmt(d.sellerFather)} ساکنہ ${fmt(d.sellerMohalla)} ${fmt(d.sellerTehsil)}، فریق اول۔\n\n${fmt(d.buyerName)} ولد ${fmt(d.buyerFather)} ساکنہ ${fmt(d.buyerMohalla)} ${fmt(d.buyerTehsil)}، فریق دوم۔\n\nبذریعہ تحریر اقرار کرکے لکھ دیتے ہیں کہ فریق اول کی گاڑی نمبر ${fmt(d.regNo)}، ماڈل ${fmt(d.carModel)}، سال ${fmt(d.modelYear)}، انجن نمبر ${fmt(d.engineNo)}، چیسیز نمبر ${fmt(d.chassisNo)}، رنگ ${fmt(d.carColor)}، ملکیہ و مقبوضہ ہے۔\n\n${paymentPara}\n\nگاڑی بمعہ رجسٹریشن کاپی، ٹرانسفر لیٹر، دو عدد نمبر پلیٹ، حوالہ فریق دوم کردی ہے۔ گاڑی کی ملکیت قانونی لحاظ سے پاک و صاف ہے۔ آج کے بعد چالان، ایکسیڈنٹ، ایف آئی آر، ٹوکن بذمہ فریق دوم ہوں گے۔\n\nلہذا اقرار نامہ ہذا بقائمی ہوش و حواس خمسہ برضا و رغبت بلا جبر و اکراہ روبرو گواہان تحریر کرادیا تاکہ سند رہے۔\n\nمورخہ ${fmtDate(d.date)}۔\n\nگواہ اول: ${fmt(d.witness1Name)}، ${fmt(d.witness1Cnic)}، ${fmt(d.witness1Tehsil)}۔\nفریق اول: ${fmt(d.sellerName)}، ${fmt(d.sellerCnic)}۔\nفریق دوم: ${fmt(d.buyerName)}، ${fmt(d.buyerCnic)}۔\nگواہ دوم: ${fmt(d.witness2Name)}، ${fmt(d.witness2Cnic)}، ${fmt(d.witness2Tehsil)}۔`.trim();
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pdfData, setPdfData]         = useState(null);
  const [topMargin, setTopMargin]     = useState(200);
  const [fontSize, setFontSize]       = useState(13);
  const [paddingH, setPaddingH]       = useState(98);
  const [contractData, setContractData] = useState(EMPTY_CONTRACT);
  const [sellerPhoto, setSellerPhoto] = useState(null);
  const [buyerPhoto, setBuyerPhoto]   = useState(null);
  const [signatures, setSignatures]   = useState(EMPTY_SIGS);
  const previewRef = useRef(null);

  const handlePdfLoaded = (data) => {
    setPdfData(data);
    setTopMargin(Math.round(data.canvasHeight * 0.30));
  };

  const handleFieldChange = (field, value) =>
    setContractData(prev => ({ ...prev, [field]: value }));

  const handleSig      = (key, dataURL) => setSignatures(prev => ({ ...prev, [key]: dataURL }));
  const handleSigClear = (key)          => setSignatures(prev => ({ ...prev, [key]: null }));
  const getContractText = () => buildContractText(contractData);

  const canNext = currentStep === 1 ? !!pdfData : true;
  const goNext  = () => { if (canNext && currentStep < 7) setCurrentStep(s => s + 1); };
  const goPrev  = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentStep]);

  const previewProps = {
    pdfData, topMargin, fontSize, paddingH,
    contractData, sellerPhoto, buyerPhoto, signatures,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');`}</style>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-800 leading-none">اقرار نامہ ساز</h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Stamp Paper Contract Generator</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        <div className="h-1 bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
        </div>
      </header>

      {/* ── Step strip ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-0 py-3">
            {STEPS.map((s) => (
              <button key={s.id}
                onClick={() => { if (s.id < currentStep || s.id === 1 || pdfData) setCurrentStep(s.id); }}
                className={`flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                  ${s.id === currentStep ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : s.id < currentStep ? "text-emerald-600 hover:bg-emerald-50"
                    : "text-slate-400 cursor-not-allowed"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${s.id === currentStep ? "bg-emerald-600 text-white"
                    : s.id < currentStep ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-400"}`}>
                  {s.id < currentStep ? "✓" : s.id}
                </span>
                <span className="hidden sm:block">{s.title}</span>
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

          {currentStep === 1 && <StampUpload onPdfLoaded={handlePdfLoaded} />}

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

          {currentStep === 3 && <ContractForm data={contractData} onChange={handleFieldChange} />}

          {currentStep === 4 && (
            <PhotoUploadSection
              sellerPhoto={sellerPhoto} buyerPhoto={buyerPhoto}
              onSellerPhoto={setSellerPhoto} onBuyerPhoto={setBuyerPhoto}
            />
          )}

          {currentStep === 5 && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-slate-500">
                Use your finger, stylus, or mouse. Tap once for a dot, drag for a line.
              </p>
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

          {currentStep === 6 && pdfData && (
            <div className="flex flex-col gap-5">
              <ContractPreview previewRef={previewRef} {...previewProps} />
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🔊</span>
                  <h3 className="text-sm font-semibold text-slate-700">آواز سے پڑھیں</h3>
                </div>
                <UrduNarrator getText={getContractText} />
              </div>
            </div>
          )}

          {currentStep === 7 && pdfData && (
            <div className="flex flex-col gap-6">
              <ContractPreview previewRef={previewRef} {...previewProps} />
              <ExportButton
                previewRef={previewRef}
                contractData={contractData}
                pdfDoc={pdfData.pdfDoc}
                canvasWidth={pdfData.canvasWidth}
                canvasHeight={pdfData.canvasHeight}
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
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          <span className="text-xs text-slate-400 hidden sm:block">{STEPS[currentStep - 1].title}</span>

          {currentStep < 7 ? (
            <button onClick={goNext} disabled={!canNext}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all
                ${!canNext
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-95"}`}>
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
                setFontSize(13); setPaddingH(98);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-slate-600 hover:bg-slate-700 text-white shadow-sm transition-all">
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

/* ── Photo Upload ── */
function PhotoUploadSection({ sellerPhoto, buyerPhoto, onSellerPhoto, onBuyerPhoto }) {
  const toDataURL = (file, cb) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => cb(e.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-slate-500">
        Upload passport-style photos. Seller on the right, Buyer on the left.
      </p>
      <div className="grid grid-cols-2 gap-5">
        <PhotoUploadBox label="فریق اول — Seller" sublabel="Right side"
          photo={sellerPhoto} onPhoto={(f) => toDataURL(f, onSellerPhoto)}
          onClear={() => onSellerPhoto(null)} inputId="seller-photo" />
        <PhotoUploadBox label="فریق دوم — Buyer" sublabel="Left side"
          photo={buyerPhoto} onPhoto={(f) => toDataURL(f, onBuyerPhoto)}
          onClear={() => onBuyerPhoto(null)} inputId="buyer-photo" />
      </div>
    </div>
  );
}

function PhotoUploadBox({ label, sublabel, photo, onPhoto, onClear, inputId }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>
      </div>
      {photo ? (
        <div className="relative w-full">
          <img src={photo} alt="party photo"
            className="w-full h-44 object-cover rounded-xl border border-slate-200 shadow-sm" />
          <button onClick={onClear}
            className="absolute top-2 right-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full w-7 h-7 flex items-center justify-center shadow transition-colors">
            ✕
          </button>
        </div>
      ) : (
        <div onClick={() => document.getElementById(inputId).click()}
          className="w-full h-44 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group">
          <div className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 group-hover:text-emerald-600">Upload photo</p>
        </div>
      )}
      <input id={inputId} type="file" accept="image/*" className="hidden"
        onChange={(e) => onPhoto(e.target.files[0])} />
    </div>
  );
}

/* ── Contract Preview ── */
// Each instance has its own independent canvas — no shared refs, no conflicts.
// ResizeObserver tracks actual rendered width for pixel-perfect overlay scaling.
function ContractPreview({ previewRef, pdfData, topMargin, fontSize, paddingH, contractData, sellerPhoto, buyerPhoto, signatures }) {
  const canvasRef  = useRef(null);
  const wrapperRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(pdfData?.canvasWidth || 900);

  useEffect(() => {
    if (!pdfData?.pdfDoc) return;
    let cancelled = false;

    const render = async () => {
      // Cancel any in-progress render on this canvas
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
      try {
        await task.promise;
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") console.error("[PDF render]", err);
      } finally {
        if (!cancelled) renderTaskRef.current = null;
      }
    };

    render();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
        renderTaskRef.current = null;
      }
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
      <div ref={wrapperRef}
        className="relative w-full overflow-hidden rounded-lg shadow"
        style={{ paddingBottom: `${(pdfData.canvasHeight / pdfData.canvasWidth) * 100}%` }}>

        {/* PDF canvas — each instance is independent */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Overlay wrapper — ref exposed for export */}
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
        </div>
      </div>
    </div>
  );
}