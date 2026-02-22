import { useState } from "react";
import type { ArticleData } from "../types";

interface UseArticleReturn {
  article: ArticleData | null;
  loading: boolean;
  error: string | null;
  fetchArticle: (url: string) => Promise<void>;
  fetchFromHtml: (html: string) => Promise<void>;
  reset: () => void;
}

export function useArticle(): UseArticleReturn {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchArticle(url: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to extract article");
      }

      setArticle(data as ArticleData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFromHtml(html: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to extract article");
      }

      setArticle(data as ArticleData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setArticle(null);
    setError(null);
    setLoading(false);
  }

  return { article, loading, error, fetchArticle, fetchFromHtml, reset };
}
