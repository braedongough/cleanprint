import { useState } from "react";
import "./styles.css";

function Popup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleExtract() {
    setLoading(true);
    setError(null);

    chrome.runtime.sendMessage({ type: "TRIGGER_EXTRACT" }, (response) => {
      setLoading(false);
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message ?? "Failed to communicate with extension.");
        return;
      }
      if (response?.error) {
        setError(response.error);
      }
    });
  }

  return (
    <div className="w-72 p-5">
      <h1
        className="text-xl font-normal italic text-center mb-1"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Clean Print
      </h1>
      <p className="text-gray-500 text-center mb-4 text-xs">
        Convert this page into a print-ready layout.
      </p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={loading}
        className="w-full py-2.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Extracting...
          </span>
        ) : (
          "Clean Print This Page"
        )}
      </button>
    </div>
  );
}

export default Popup;
