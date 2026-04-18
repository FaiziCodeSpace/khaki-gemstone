// ContractTemplate.jsx
export default function ContractTemplate({
  topMargin,
  canvasWidth,
  displayWidth,
  fontSize = 13,
  paddingH = 98,
  data,
  sellerPhoto,
  buyerPhoto,
  signatures = {},
  fingerprints = {},
}) {
  const intrinsic = canvasWidth || 900;
  const scale = intrinsic / 900;
  const displayScale = displayWidth ? displayWidth / intrinsic : 1;
  const d = data;

  const formatDate = (val) => {
    if (!val) return "۔۔۔";
    const [y, m, day] = val.split("-");
    return `${day}-${m}-${y}`;
  };

  const F = ({ val, fallback = "۔۔۔" }) => <strong>{val || fallback}</strong>;

  return (
    <div
      data-template-scaler="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${intrinsic}px`,
        transformOrigin: "top left",
        transform: `scale(${displayScale})`,
        pointerEvents: "none",
      }}
    >
      <div
        data-contract-overlay="true"
        dir="rtl"
        style={{
          position: "absolute",
          top: `${topMargin}px`,
          left: 0,
          width: "100%",
          fontFamily: "'Noto Nastaliq Urdu', serif",
          fontSize: `${fontSize * scale}px`,
          lineHeight: 2.22,
          color: "#111",
          padding: `${10 * scale}px ${paddingH * scale}px`,
          boxSizing: "border-box",
        }}
      >
        {/* ── Photo + Title ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: `${6 * scale}px` }}>
          <PhotoBox label="فریق اول" photo={sellerPhoto} scale={scale} />

          <div style={{
            textAlign: "center",
            flex: 1,
            padding: `0 ${12 * scale}px`,
            marginTop: `-${50 * scale}px` // Adjust the multiplier (e.g., -10) to pull it higher
          }}>
            <div style={{ fontSize: `${20 * scale}px`, fontWeight: "bold", letterSpacing: "normal", whiteSpace: "nowrap" }}>
              {'۔ ۔ ۔ ۔ ۔ اقرار نامہ گاڑی ۔ ۔ ۔ ۔ ۔'}
            </div>
          </div>

          <PhotoBox label="فریق دوم" photo={buyerPhoto} scale={scale} />
        </div>

        {/* ── Party 1 ── */}
        <p style={{ margin: `${3 * scale}px 0` }}>
          مالک: <F val={d.sellerName} /> ولد <F val={d.sellerFather} /> سکنہ <F val={d.sellerMohalla} /> <F val={d.sellerTehsil} /> (فریق اول)۔
        </p>

        {/* ── Party 2 ── */}
        <p style={{ margin: `${3 * scale}px 0` }}>
          <F val={d.buyerName} /> ولد <F val={d.buyerFather} /> سکنہ <F val={d.buyerMohalla} /> <F val={d.buyerTehsil} /> (فریق دوم)۔
        </p>

        {/* ── Car details + Payment paragraph — no line break between them ── */}
        {d.paymentMode === "advance" ? (

          // ── Advance / Partial Payment ──
          <p style={{ margin: `${3 * scale}px 0`, textAlign: "justify" }}>
            بذریعہ تحریر اقرار کرکے لکھ دیتے ہیں کہ فریق اول کی گاڑی نمبر <F val={d.regNo} /> رجسٹریشن نمبر <F val={d.carModel} /> ماڈل <F val={d.modelYear} /> انجن نمبر <F val={d.engineNo} /> چیسیزز نمبر <F val={d.chassisNo} /> رنگ <F val={d.carColor} />، ملکیہ و مقبوضہ ہے۔
            سواب فریق اول نے گاڑی مذکورہ بالامعہ کاغذات بدست فریق دوم بعوض مبلغ{" "}
            <F val={d.priceNum ? `${d.priceNum}` : ""} /> روپے{" "}
            (<F val={d.priceWords} /> روپے) فروخت کردی ہے۔اور سالم رقم سے مبلغ{" "}
            <F val={d.advanceNum ? `${d.advanceNum}` : ""} /> روپے{" "}
            (<F val={d.advanceWords} /> روپے) نقد ازاں فریق دوم سے روبروگواہان وصول کر لیے ہیں اور{" "}

            {/*
              ── DYNAMIC REMAINING CLAUSE ──
              If the agent has typed a custom clause, use it verbatim (bold).
              Otherwise fall back to the standard sentence with dynamic values.
            */}
            {d.remainingClause ? (
              <strong>{d.remainingClause}</strong>
            ) : (
              <>
                بقایا رقم مبلغ{" "}
                <F val={d.remainingNum ? `${d.remainingNum}` : ""} /> روپے{" "}
                (<F val={d.remainingWords} /> روپے) فریق دوم مورخہ <F val={formatDate(d.dueDate)} /> کو ادا کرنے کا پابند وذمہ دار ہوگا۔ اور گاڑی کے جملہ کاغذات رجسٹریشن وغیرہ فریق اول مورخہ <F val={formatDate(d.dueDate)} /> بوقت وصولی بقایا رقم دینے کا پابند وذ مہ دار ہوگا۔
              </>
            )}

            {" "}گاڑی کی ملکیت قانونی و واقعاتی لحاظ سے پاک و صاف ہے اور گاڑی کی چوری وغیرہ کی نہیں ہے جسکے لیے فریق اول ضامن وذمہ دار ہے ۔ اور فریق دوم نے گاڑی چیک اپ کرنے کے بعد موجودہ حالت میں وصول کر لی ہے ۔ اور آج سے قبل کے جملہ چالان ٹیکس ایکسیڈنٹ <strong>FIR</strong> بذمہ فریق اول ہونگے اور آج کے بعد چالان، ٹیکس، ایکسیڈنٹ، <strong>FIR</strong> ، بذمہ فریق دوم ہوں گے۔ لہذا اقرار نامہ ہذا بعد سن وسمجھ لینے کے بعد مضمون کے بحق فریق دوم سندا تحریر وتکمیل ہے ۔
          </p>

        ) : (

          // ── Full Payment ──
          <p style={{ margin: `${3 * scale}px 0`, textAlign: "justify" }}>
            بذریعہ تحریر اقرار کرکے لکھ دیتے ہیں کہ فریق اول کی گاڑی نمبر <F val={d.regNo} /> رجسٹریشن نمبر <F val={d.carModel} /> ماڈل <F val={d.modelYear} /> انجن نمبر <F val={d.engineNo} /> چیسیزز نمبر <F val={d.chassisNo} /> رنگ <F val={d.carColor} />، ملکیہ و مقبوضہ ہے۔
            سواب فریق اول نے گاڑی مذکورہ بالامعہ کاغذات بدست فریق دوم بعوض مبلغ{" "}
            <F val={d.priceNum ? `${d.priceNum}` : ""} /> روپے{" "}
            (<F val={d.priceWords} /> روپے) فروخت کردی ہے۔اور فریق اول نے سالم رقم مبلغ{" "}
            <F val={d.priceNum ? `${d.priceNum}` : ""} /> روپے{" "}
            (<F val={d.priceWords} /> روپے) نقد روبرو گواہان ازاں فریق دوم سے وصول کرلیے ہیں۔ گاڑی بمعہ جملہ کاغذات رجسٹریشن کاپی، ٹرانسفر لیٹر،{" "}
            {/* ── DYNAMIC NUMBER PLATE — blank = sentence omits it cleanly ── */}
            {d.numberPlate ? <>{d.numberPlate}، </> : null}
            حوالہ فریق دوم کردیے ہیں۔ گاڑی کی ملکیت قانونی و واقعاتی لحاظ سے پاک و صاف ہے اور گاڑی کی چوری وغیرہ کی نہیں ہے جسکے لیے فریق اول ضامن وذمہ دار ہے ۔ اور فریق دوم نے گاڑی چیک اپ کرنے کے بعد موجودہ حالت میں وصول کر لی ہے ۔ اور آج کی بعد فریق اول اور اس کے ورثاء کا گاڑی مذکورہ کے ساتھ تعلق واسطہ نہیں رہا ہے اور نہ ہوگا۔اور آج سے قبل کے جملہ چالان ٹیکس ایکسیڈنٹ <strong>FIR</strong> بذمہ فریق اول ہونگے اور آج کے بعد چالان، ٹیکس، ایکسیڈنٹ، <strong>FIR</strong> ، بذمہ فریق دوم ہوں گے۔ ٖلہِذا اقرار نامہ بعد سند وسمجھ لینے کے بعد مضمون بحق فریق دوم سندا تحریر و تکمیل ہے۔
          </p>

        )}

        {/* ── Extra conditions (shown in both modes if filled) ── */}
        {d.conditions && d.conditions.trim() && (
          <p style={{ margin: `${6 * scale}px 0`, borderTop: `${0.5 * scale}px dashed #aaa`, paddingTop: `${6 * scale}px` }}>
            <strong>شرائط:</strong> {d.conditions}
          </p>
        )}

        {/* ── Date row ── */}
        <div style={{ display: "flex", justifyContent: "left", marginTop: `${14 * scale}px`, fontSize: `${11 * scale}px` }}>
          <span>مورخہ <strong>{formatDate(d.date)}</strong></span>
        </div>

        {/* ── 4-column signature row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: `${10 * scale}px`, marginTop: `${18 * scale}px`, direction: "rtl" }}>
          {[
            { cnic: d.witness1Cnic, name: d.witness1Name, tehsil: d.witness1Tehsil, tag: "گواہ شد", sigKey: "witness1", fpKey: "witness1Fp" },
            { cnic: d.sellerCnic, name: d.sellerName, tehsil: d.sellerTehsil, tag: "العبد", sigKey: "seller", fpKey: "sellerFp" },
            { cnic: d.buyerCnic, name: d.buyerName, tehsil: d.buyerTehsil, tag: "العبد", sigKey: "buyer", fpKey: "buyerFp" },
            { cnic: d.witness2Cnic, name: d.witness2Name, tehsil: d.witness2Tehsil, tag: "گواہ شد", sigKey: "witness2", fpKey: "witness2Fp" },
          ].map((person, i) => (
            <SignatureBox
              key={i}
              person={person}
              sig={signatures[person.sigKey]}
              fp={fingerprints[person.fpKey]}
              scale={scale}
            />
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
        width: `${140 * scale}px`, height: `${150 * scale}px`,
        border: `${1.5 * scale}px solid #999`, borderRadius: "6%",
        overflow: "hidden", backgroundColor: "#f1f5f9",
        position: "relative", flexShrink: 0,
      }} data-cover-box="true">
        {photo ? (
          <img
            data-cover-draw="true"
            src={photo}
            alt={label}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              height: "100%",
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.2"
            style={{ width: `${36 * scale}px`, height: `${36 * scale}px` }}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: `${15 * scale}px`, color: "#555" }}>{label}</span>
    </div>
  );
}

function SignatureBox({ person, sig, fp, scale }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontSize: `${10 * scale}px`, gap: `${4 * scale}px` }}>
      <div style={{ color: "#555", fontSize: `${15 * scale}px` }}>
        {person.tag}{" "}
        <span dir="ltr" style={{ unicodeBidi: "embed" }}>
          {person.cnic || ""}
        </span>
      </div>
      <div style={{
        width: "100%", height: `${62 * scale}px`,
        border: `${1 * scale}px solid #ccc`, borderRadius: `${3 * scale}px`,
        backgroundColor: "#fff", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {sig
          ? <img src={sig} alt="sig" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          : <span style={{ color: "#ddd", fontSize: `${9 * scale}px` }}>دستخط</span>}
      </div>
      <div style={{
        width: `${110 * scale}px`, height: `${125 * scale}px`,
        border: `${1 * scale}px solid #bbb`, borderRadius: `${4 * scale}px`,
        backgroundColor: "#fafafa", overflow: "hidden",
        position: "relative", flexShrink: 0,
      }} data-cover-box="true">
        {fp ? (
          <img
            data-cover-draw="true"
            src={fp}
            alt="fp"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              filter: "contrast(1.4) grayscale(1)",
            }}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2"
            style={{ width: `${20 * scale}px`, height: `${20 * scale}px` }}>
            <path d="M12 2C8 2 5 5.5 5 9c0 5 3 9 7 13" strokeLinecap="round" />
            <path d="M12 2c4 0 7 3.5 7 7 0 5-3 9-7 13" strokeLinecap="round" />
            <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3c0 3-1.5 6-3 9" strokeLinecap="round" />
            <path d="M7 8c.3-3 2.3-5 5-5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div style={{ width: "100%", borderTop: `${1 * scale}px solid #888`, paddingTop: `${4 * scale}px` }}>
        <div style={{ fontWeight: "bold", fontSize: `${11 * scale}px` }}>{person.name || ""}</div>
        <div style={{ color: "#555", marginTop: `${2 * scale}px`, fontSize: `${9 * scale}px` }}>{person.tehsil || ""}</div>
      </div>
    </div>
  );
}