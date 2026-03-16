// ExportButton.jsx
//
// APPROACH: At export time, we re-render the PDF page onto a fresh offscreen
// canvas ourselves (no conflict with the preview canvas), then composite the
// contract overlay on top using html2canvas.
// This avoids the shared-canvas race condition entirely.

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ExportButton({ previewRef, contractData, pdfDoc, canvasWidth, canvasHeight }) {
  const [status, setStatus]           = useState("idle");
  const [errorMsg, setErrorMsg]       = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const getFileName = () => {
    const buyer  = contractData?.buyerName  || "buyer";
    const seller = contractData?.sellerName || "seller";
    const date   = contractData?.date
      ? contractData.date.replace(/-/g, "")
      : new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `اقرار-نامہ_${seller}_${buyer}_${date}.pdf`;
  };

  const handleExport = async () => {
    if (!previewRef?.current || !pdfDoc) return;
    setStatus("capturing");
    setErrorMsg("");
    setUploadedUrl(null);

    try {
      // ── 1. Re-render PDF onto a fresh offscreen canvas ──
      // This is completely separate from the preview canvas — no conflict.
      const page     = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const W = viewport.width;
      const H = viewport.height;

      const offscreen = document.createElement("canvas");
      offscreen.width  = W;
      offscreen.height = H;
      const renderTask = page.render({
        canvasContext: offscreen.getContext("2d"),
        viewport,
      });
      await renderTask.promise;

      // ── 2. Capture the contract overlay HTML at intrinsic resolution ──
      // Find the inner overlay div (data-contract-overlay)
      const overlayEl = previewRef.current.querySelector("[data-contract-overlay]");
      if (!overlayEl) throw new Error("Overlay element not found");

      // Temporarily remove the CSS scale transform so html2canvas captures
      // the overlay at full intrinsic pixel size (matches the offscreen canvas)
      const outerScaleEl = previewRef.current.querySelector("[data-template-scaler]");
      const prevTransform = outerScaleEl ? outerScaleEl.style.transform : null;
      const prevWidth     = outerScaleEl ? outerScaleEl.style.width     : null;

      if (outerScaleEl) {
        outerScaleEl.style.transform = "none";
        outerScaleEl.style.width     = `${W}px`;
      }

      const overlayCanvas = await html2canvas(overlayEl, {
        scale:           1,
        useCORS:         true,
        allowTaint:      true,
        backgroundColor: null,   // transparent — only text layer
        logging:         false,
        width:           W,
        height:          H,
        windowWidth:     W,
        windowHeight:    H,
        scrollX:         0,
        scrollY:         0,
      });

      // Restore transform
      if (outerScaleEl) {
        outerScaleEl.style.transform = prevTransform;
        outerScaleEl.style.width     = prevWidth;
      }

      // ── 3. Composite: stamp PDF + contract overlay ──
      const merged = document.createElement("canvas");
      merged.width  = W;
      merged.height = H;
      const ctx = merged.getContext("2d");
      ctx.drawImage(offscreen, 0, 0);          // layer 1: stamp paper
      ctx.drawImage(overlayCanvas, 0, 0);      // layer 2: contract text

      // ── 4. Build PDF ──
      const imgData   = merged.toDataURL("image/jpeg", 0.95);
      const pdfWidth  = 210;
      const pdfHeight = (H / W) * pdfWidth;

      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit:        "mm",
        format:      [pdfWidth, pdfHeight],
      });
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      // ── 5. Download ──
      const fileName = getFileName();
      pdf.save(fileName);

      // ── 6. Upload to server ──
      setStatus("uploading");
      const pdfBlob  = pdf.output("blob");
      const formData = new FormData();
      formData.append("pdf", pdfBlob, fileName);
      formData.append("metadata", JSON.stringify({
        chassisNo:    contractData?.chassisNo    || "",
        modelYear:    contractData?.modelYear    || "",
        regNo:        contractData?.regNo        || "",
        carModel:     contractData?.carModel     || "",
        carColor:     contractData?.carColor     || "",
        engineNo:     contractData?.engineNo     || "",
        sellerName:   contractData?.sellerName   || "",
        sellerCnic:   contractData?.sellerCnic   || "",
        sellerTehsil: contractData?.sellerTehsil || "",
        buyerName:    contractData?.buyerName    || "",
        buyerCnic:    contractData?.buyerCnic    || "",
        buyerTehsil:  contractData?.buyerTehsil  || "",
        paymentMode:  contractData?.paymentMode  || "full",
        priceNum:     contractData?.priceNum     || "",
        priceWords:   contractData?.priceWords   || "",
        advanceNum:   contractData?.advanceNum   || "",
        remainingNum: contractData?.remainingNum || "",
        dueDate:      contractData?.dueDate      || "",
        witness1Name: contractData?.witness1Name || "",
        witness1Cnic: contractData?.witness1Cnic || "",
        witness2Name: contractData?.witness2Name || "",
        witness2Cnic: contractData?.witness2Cnic || "",
        date:         contractData?.date         || "",
      }));

      const res  = await fetch(`${API_BASE}/api/stamps/upload`, {
        method:      "POST",
        credentials: "include",
        body:        formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Upload failed");

      setUploadedUrl(json.contract.pdfUrl);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 5000);

    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const busy = status === "capturing" || status === "uploading";

  return (
    <div className="flex flex-col gap-3">
      <button onClick={handleExport} disabled={busy}
        className={`w-full flex items-center justify-center gap-2 font-semibold text-sm px-4 py-3.5 rounded-xl transition-all
          ${busy             ? "bg-emerald-400 cursor-wait text-white"
          : status==="done"  ? "bg-emerald-500 text-white"
          : status==="error" ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-95"}`}>
        {busy && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        )}
        {status === "done" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        )}
        {status === "idle" && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
        )}
        {status === "capturing" ? "PDF بن رہی ہے..."          :
         status === "uploading" ? "سرور پر اپلوڈ ہو رہی ہے..."  :
         status === "done"      ? "محفوظ اور اپلوڈ ✓"          :
         status === "error"     ? "دوبارہ کوشش کریں"           :
                                  "PDF ڈاؤنلوڈ اور محفوظ کریں"}
      </button>

      {status === "done" && uploadedUrl && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          <span>PDF ڈاؤنلوڈ اور سرور پر محفوظ ہو گئی۔</span>
          <a href={uploadedUrl} target="_blank" rel="noreferrer"
            className="ml-auto underline font-semibold shrink-0">View</a>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col gap-1 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <span className="text-red-600">⚠️ {errorMsg}</span>
          <span className="text-slate-500">PDF آپ کے device پر محفوظ ہو گئی — صرف server upload میں خرابی آئی۔</span>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        اسٹامپ پیپر + معاہدہ ایک PDF میں · uploads/stamps/ پر محفوظ
      </p>
    </div>
  );
}