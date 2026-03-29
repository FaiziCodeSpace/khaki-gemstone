// StampUpload.jsx
import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

// 1. Import the worker from the local node_modules via Vite's ?url suffix
// For v3.11.174, the path is usually in the 'build' folder
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

// 2. Set the worker source to the locally bundled URL
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export default function StampUpload({ onPdfLoaded }) {
  const [pdfFile, setPdfFile]   = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const canvasRef               = useRef(null);
  const renderTaskRef           = useRef(null);

  const loadFile = (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    setError("");
    setFileName(file.name);
    setPdfFile(file);
  };

  useEffect(() => {
    if (!pdfFile) return;
    let cancelled = false;

    const renderPdf = async () => {
      // Cancel any in-progress render
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
        renderTaskRef.current = null;
      }
      setLoading(true);
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        if (cancelled) return;

        // Use a local arrayBuffer to avoid URL issues in older WebViews
        const loadingTask = pdfjsLib.getDocument({ 
            data: arrayBuffer,
            // Optimization for older devices: disable range requests if not needed
            disableRange: true,
            disableAutoFetch: true
        });
        
        const pdfDoc  = await loadingTask.promise;
        const page    = await pdfDoc.getPage(1);
        
        // Android WebView performance tip: Use a standard scale
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas  = canvasRef.current;
        if (!canvas || cancelled) return;

        const context = canvas.getContext("2d");
        canvas.width  = viewport.width;
        canvas.height = viewport.height;

        const task = page.render({
          canvasContext: context,
          viewport,
        });
        
        renderTaskRef.current = task;
        await task.promise;
        renderTaskRef.current = null;

        if (!cancelled && onPdfLoaded) {
          onPdfLoaded({
            pdfFile,
            pdfDoc,
            canvasWidth:  viewport.width,
            canvasHeight: viewport.height,
          });
        }
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") {
          setError("Failed to render PDF: " + err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderPdf();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
        renderTaskRef.current = null;
      }
    };
  }, [pdfFile]);

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      {!pdfFile && (
        <div
          onDrop={(e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("pdf-input").click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
                اسٹامپ پیپر PDF یہاں اپلوڈ کریں
              </p>
              <p className="text-xs text-slate-400 mt-1">Tap to browse · PDF only</p>
            </div>
          </div>
          <input
            id="pdf-input"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => loadFile(e.target.files[0])}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-sm text-slate-500 py-3">
          <svg className="animate-spin w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Rendering stamp paper...
        </div>
      )}

      {/* Canvas */}
      <div className={pdfFile && !loading ? "flex flex-col gap-3" : "hidden"}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <span className="text-xs text-slate-500 font-mono truncate max-w-xs">{fileName}</span>
          </div>
          <button
            onClick={() => { setPdfFile(null); setFileName(""); setError(""); }}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors underline"
          >
            Remove
          </button>
        </div>
        <div className="rounded-xl overflow-auto bg-slate-50 border border-slate-200 p-2">
          <canvas
            ref={canvasRef}
            className="mx-auto block shadow-sm rounded-lg"
            style={{ maxWidth: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}