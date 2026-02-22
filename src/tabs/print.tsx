import { Readability } from "@mozilla/readability";
import { useEffect, useState } from "react";
import { ArticlePreview } from "../components/ArticlePreview";
import { SettingsSidebar } from "../components/SettingsSidebar";
import { loadPageData, loadSettings, saveSettings } from "../storage";
import type { ArticleData, ArticleImage, PrintSettings } from "../types";
import { defaultSettings } from "../types";
import "../styles.css";

function extractImages(html: string): ArticleImage[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images: ArticleImage[] = [];

  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    if (src) {
      images.push({ src, alt: img.getAttribute("alt") || "" });
    }
  }

  return images;
}

function resolveImageUrls(html: string, baseUrl: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    if (src) {
      try {
        img.setAttribute("src", new URL(src, baseUrl).href);
      } catch {
        // leave as-is if URL resolution fails
      }
    }
  }

  return doc.body.innerHTML;
}

function parseArticle(html: string, url: string): ArticleData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const reader = new Readability(doc);
  const article = reader.parse();

  if (!article) {
    throw new Error("Could not extract article content from this page.");
  }

  const content = resolveImageUrls(article.content, url);
  const images = extractImages(content);

  return {
    title: article.title,
    byline: article.byline,
    siteName: article.siteName,
    publishedDate: article.publishedDate,
    content,
    textContent: article.textContent,
    excerpt: article.excerpt,
    length: article.length,
    images,
  };
}

export function Head() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function PrintPage() {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [settings, setSettings] = useState<PrintSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [pageData, storedSettings] = await Promise.all([
          loadPageData(),
          loadSettings(),
        ]);

        if (!pageData) {
          setError("No article found. Please extract an article from a page first.");
          return;
        }

        const parsed = parseArticle(pageData.html, pageData.url);
        setArticle(parsed);
        setSettings(storedSettings);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load article";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function handleSettingsChange(newSettings: PrintSettings) {
    setSettings(newSettings);
    saveSettings(newSettings);
  }

  function handleBack() {
    window.close();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error ?? "No article found."}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 px-8 py-10 max-w-4xl mx-auto">
        <ArticlePreview article={article} settings={settings} />
      </main>
      <aside className="no-print w-80 shrink-0 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto h-screen sticky top-0">
        <SettingsSidebar
          settings={settings}
          images={article.images}
          onSettingsChange={handleSettingsChange}
          onBack={handleBack}
        />
      </aside>
    </div>
  );
}

export default PrintPage;
