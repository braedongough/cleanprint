import { useState, useRef, useEffect } from "react";

interface InputScreenProps {
  loading: boolean;
  error: string | null;
  onFetchUrl: (url: string) => void;
  onFetchHtml: (html: string) => void;
}

export function InputScreen({ loading, error, onFetchUrl, onFetchHtml }: InputScreenProps) {
  const [url, setUrl] = useState("");
  const [pasteText, setPasteText] = useState("");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (error && detailsRef.current) {
      detailsRef.current.open = true;
    }
  }, [error]);

  function handleSubmitUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      return;
    }
    onFetchUrl(url.trim());
  }

  function handleSubmitPaste() {
    if (!pasteText.trim()) {
      return;
    }
    onFetchHtml(pasteText.trim());
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-normal italic text-center mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Clean Print
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Convert articles into beautifully formatted, print-ready layouts.
        </p>

        <form onSubmit={handleSubmitUrl} className="mb-6">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste article URL..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-5 py-2.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Fetching...
                </span>
              ) : (
                "Fetch Article"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        <details ref={detailsRef} className="group">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 select-none">
            Or paste article HTML manually
          </summary>
          <div className="mt-3">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste the article HTML or full page source here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSubmitPaste}
              disabled={loading || !pasteText.trim()}
              className="mt-2 w-full px-5 py-2.5 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Extract Article
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
