export default function ContractTemplate({
  topMargin,
  canvasWidth,
  displayWidth,
  fontSize   = 13,
  paddingH   = 98,
  data,
  sellerPhoto,
  buyerPhoto,
  signatures = {},
}) {
  const intrinsic = canvasWidth || 900;

  // scale factor relative to our design baseline of 900px
  const scale = intrinsic / 900;

  // CSS display scale: how much the canvas is shrunk by the browser
  const displayScale = displayWidth ? displayWidth / intrinsic : 1;

  const d = data;

  const formatDate = (val) => {
    if (!val) return "۔۔۔";
    const [y, m, day] = val.split("-");
    return `${day}-${m}-${y}`;
  };

  const F = ({ val, fallback = "۔۔۔" }) => <strong>{val || fallback}</strong>;

  return (
    /*
     * The wrapper sits at the top-left of the canvas container.
     * It is scaled down by `displayScale` so it exactly matches the
     * visually-rendered canvas size regardless of screen width.
     * transform-origin: top left ensures it scales from the same corner as the canvas.
     */
    <div
      data-template-scaler="true"
      style={{
        position:        "absolute",
        top:             0,
        left:            0,
        width:           `${intrinsic}px`,
        transformOrigin: "top left",
        transform:       `scale(${displayScale})`,
        pointerEvents:   "none",
      }}
    >
      {/* Inner content positioned inside the intrinsic space */}
      <div
        data-contract-overlay="true"
        dir="rtl"
        style={{
          position:    "absolute",
          top:         `${topMargin}px`,
          left:        0,
          width:       "100%",
          fontFamily:  "'Noto Nastaliq Urdu', serif",
          fontSize:    `${fontSize * scale}px`,
          lineHeight:  2.22,
          color:       "#111",
          padding:     `${10 * scale}px ${paddingH * scale}px`,
          boxSizing:   "border-box",
        }}
      >
        {/* ── Photo + Title ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: `${6 * scale}px` }}>
          <PhotoBox label="فریق اول" photo={sellerPhoto} scale={scale} />
          <div style={{ textAlign: "center", flex: 1, padding: `0 ${12 * scale}px` }}>
            <div style={{ fontSize: `${20 * scale}px`, fontWeight: "bold", letterSpacing: "1px" }}>
              ۔۔۔۔۔اقرار نامہ گاڑی۔۔۔۔۔
            </div>
          </div>
          <PhotoBox label="فریق دوم" photo={buyerPhoto} scale={scale} />
        </div>

        {/* ── Party 1 ── */}
        <p style={{ margin: `${3 * scale}px 0` }}>
          مالک: <F val={d.sellerName} /> ولد <F val={d.sellerFather} /> ساکنہ <F val={d.sellerMohalla} /> <F val={d.sellerTehsil} /> (فریق اول)۔
        </p>

        {/* ── Party 2 ── */}
        <p style={{ margin: `${3 * scale}px 0` }}>
          <F val={d.buyerName} /> ولد <F val={d.buyerFather} /> ساکنہ <F val={d.buyerMohalla} /> <F val={d.buyerTehsil} /> (فریق دوم)۔
        </p>

        {/* ── Car details ── */}
        <p style={{ margin: `${3 * scale}px 0` }}>
          بذریعہ تحریر اقرار کرکے لکھ دیتے ہیں کہ فریق اول کی گاڑی نمبر <F val={d.regNo} /> رجسٹریشن نمبر <F val={d.carModel} /> باڈل <F val={d.modelYear} /> انجن نمبر <F val={d.engineNo} /> چیسیز نمبر <F val={d.chassisNo} /> رنگ <F val={d.carColor} />، ملکیہ و مقبوضہ ہے۔
        </p>

        {/* ── Payment paragraph ── */}
        {d.paymentMode === "advance" ? (
          <p style={{ margin: `${3 * scale}px 0` }}>
            فریق اول نے گاڑی مذکورہ بالامعہ کاغذات بدست فریق دوم بعوض مبلغ کل{" "}
            <F val={d.priceNum ? `${d.priceNum}/-` : ""} /> روپے{" "}
            (<F val={d.priceWords} /> روپے) فروخت کردی ہے۔
            جس میں سے بعنوان پیشگی مبلغ{" "}
            <F val={d.advanceNum ? `${d.advanceNum}/-` : ""} /> روپے{" "}
            (<F val={d.advanceWords} /> روپے) نقد روبرو گواہان از فریق دوم وصول کرلیے ہیں۔
            بقایا مبلغ <F val={d.remainingNum ? `${d.remainingNum}/-` : ""} /> روپے{" "}
            (<F val={d.remainingWords} /> روپے) مورخہ <F val={formatDate(d.dueDate)} /> کو ادا کیے جائیں گے۔
            گاڑی بمعہ رجسٹریشن کاپی، ٹرانسفر لیٹر، دو عدد نمبر پلیٹ، حوالہ فریق دوم کردی ہے۔
            گاڑی کی ملکیت قانونی لحاظ سے پاک و صاف ہے اور گاڑی کی چوری دھوکہ دہی نہیں ہے۔
            مورخہ <F val={formatDate(d.date)} /> سے قبل اگر گاڑی چوری کی نکلی یا انجن نمبر یا چیسز نمبر میں ٹمپرنگ پائی گئی یا گاڑی کے کاغذات میں کوئی قانونی سقم ہوا تو اس کا ذمہ دار فریق اول ہوگا۔
            آج کے بعد چالان، ایکسیڈنٹ، <strong>FIR</strong>، ٹوکن بذمہ فریق دوم ہوں گے۔
          </p>
        ) : (
          <p style={{ margin: `${3 * scale}px 0` }}>
            فریق اول نے گاڑی مذکورہ بالامعہ کاغذات بدست فریق دوم بعوض مبلغ{" "}
            <F val={d.priceNum ? `${d.priceNum}/-` : ""} /> روپے{" "}
            (<F val={d.priceWords} /> روپے) فروخت کردی ہے۔
            فریق دوم نے کل رقم مبلغ <F val={d.priceNum ? `${d.priceNum}/-` : ""} /> روپے{" "}
            نقد روبرو گواہان ادا کردی اور فریق اول نے وصول کرلی۔ اور کوئی مطالبہ باقی نہیں۔
            گاڑی بمعہ رجسٹریشن کاپی، ٹرانسفر لیٹر، دو عدد نمبر پلیٹ، حوالہ فریق دوم کردی ہے۔
            گاڑی کی ملکیت قانونی لحاظ سے پاک و صاف ہے اور گاڑی کی چوری دھوکہ دہی نہیں ہے۔
            مورخہ <F val={formatDate(d.date)} /> سے قبل اگر گاڑی چوری کی نکلی یا انجن نمبر یا چیسز نمبر میں ٹمپرنگ پائی گئی یا گاڑی کے کاغذات میں کوئی قانونی سقم ہوا تو اس کا ذمہ دار فریق اول ہوگا۔
            آج کے بعد چالان، ایکسیڈنٹ، <strong>FIR</strong>، ٹوکن بذمہ فریق دوم ہوں گے۔
          </p>
        )}

        {/* ── Closing ── */}
        <p style={{ margin: `${3 * scale}px 0` }}>
          لہذا اقرار نامہ ہذا بقائمی ہوش و حواس خمسہ برضا و رغبت بلا جبر و اکراہ روبرو گواہان تحریر کرادیا تاکہ سند رہے۔
        </p>

        {/* ── Date row ── */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: `${14 * scale}px`, fontSize: `${11 * scale}px` }}>
          <span>فریق دوم سند تحریر تکمیل ہے۔</span>
          <span>مورخہ <strong>{formatDate(d.date)}</strong></span>
        </div>

        {/* ── 4-column signature row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: `${10 * scale}px`, marginTop: `${18 * scale}px`, direction: "rtl" }}>
          {[
            { cnic: d.witness1Cnic, name: d.witness1Name, tehsil: d.witness1Tehsil, tag: "گواہ شد", sigKey: "witness1" },
            { cnic: d.sellerCnic,   name: d.sellerName,   tehsil: d.sellerTehsil,   tag: "الحد",   sigKey: "seller"   },
            { cnic: d.buyerCnic,    name: d.buyerName,    tehsil: d.buyerTehsil,    tag: "الحد",   sigKey: "buyer"    },
            { cnic: d.witness2Cnic, name: d.witness2Name, tehsil: d.witness2Tehsil, tag: "گواہ شد", sigKey: "witness2" },
          ].map((person, i) => (
            <SignatureBox key={i} person={person} sig={signatures[person.sigKey]} scale={scale} />
          ))}
        </div>

      </div>
    </div>
  );
}

function PhotoBox({ label, photo, scale }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${4 * scale}px` }}>
      <div style={{
        width: `${70 * scale}px`, height: `${80 * scale}px`,
        border: `${1.5 * scale}px solid #999`, borderRadius: `${4 * scale}px`,
        overflow: "hidden", backgroundColor: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {photo ? (
          <img src={photo} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.2"
            style={{ width: `${36 * scale}px`, height: `${36 * scale}px` }}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: `${10 * scale}px`, color: "#555" }}>{label}</span>
    </div>
  );
}

function SignatureBox({ person, sig, scale }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontSize: `${10 * scale}px`, gap: `${4 * scale}px` }}>
      <div style={{ color: "#555", fontSize: `${9 * scale}px` }}>
        {person.tag} {person.cnic || ""}
      </div>
      <div style={{
        width: "100%", height: `${42 * scale}px`,
        border: `${1 * scale}px solid #ccc`, borderRadius: `${3 * scale}px`,
        backgroundColor: "#fff", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {sig
          ? <img src={sig} alt="sig" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          : <span style={{ color: "#ddd", fontSize: `${9 * scale}px` }}>دستخط</span>}
      </div>
      <div style={{
        width: `${36 * scale}px`, height: `${36 * scale}px`,
        border: `${1 * scale}px dashed #bbb`, borderRadius: `${4 * scale}px`,
        backgroundColor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2"
          style={{ width: `${20 * scale}px`, height: `${20 * scale}px` }}>
          <path d="M12 2C8 2 5 5.5 5 9c0 5 3 9 7 13" strokeLinecap="round"/>
          <path d="M12 2c4 0 7 3.5 7 7 0 5-3 9-7 13" strokeLinecap="round"/>
          <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3c0 3-1.5 6-3 9" strokeLinecap="round"/>
          <path d="M7 8c.3-3 2.3-5 5-5" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ width: "100%", borderTop: `${1 * scale}px solid #888`, paddingTop: `${4 * scale}px` }}>
        <div style={{ fontWeight: "bold", fontSize: `${11 * scale}px` }}>{person.name || ""}</div>
        <div style={{ color: "#555", marginTop: `${2 * scale}px`, fontSize: `${9 * scale}px` }}>{person.tehsil || ""}</div>
      </div>
    </div>
  );
}