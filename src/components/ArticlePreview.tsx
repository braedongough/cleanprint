import { useMemo } from "react";
import type { ArticleData, PrintSettings } from "../types";

interface ArticlePreviewProps {
  article: ArticleData;
  settings: PrintSettings;
}

const fontFamilyMap: Record<string, string> = {
  Georgia: "Georgia, serif",
  Garamond: "'Garamond', 'EB Garamond', serif",
  "Libre Baskerville": "'Libre Baskerville', serif",
  "Source Serif Pro": "'Source Serif 4', 'Source Serif Pro', serif",
  Charter: "'Charter', 'Bitstream Charter', serif",
};

export function ArticlePreview({ article, settings }: ArticlePreviewProps) {
  const processedContent = useMemo(() => {
    if (settings.excludedImages.size === 0) {
      return article.content;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, "text/html");
    const imgs = doc.querySelectorAll("img");

    for (const img of imgs) {
      const src = img.getAttribute("src") || "";
      if (settings.excludedImages.has(src)) {
        const figure = img.closest("figure");
        if (figure) {
          figure.remove();
        } else {
          img.remove();
        }
      }
    }

    return doc.body.innerHTML;
  }, [article.content, settings.excludedImages]);

  const bodyStyle = {
    fontFamily: fontFamilyMap[settings.fontFamily] || "Georgia, serif",
    fontSize: `${settings.fontSize}pt`,
    columnCount: settings.columns,
  };

  return (
    <article>
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1
          className="text-3xl font-bold leading-tight mb-3"
          style={{ fontFamily: fontFamilyMap[settings.fontFamily] }}
        >
          {article.title}
        </h1>
        {settings.showAuthorDate && (article.byline || article.publishedDate) && (
          <div className="text-sm text-gray-500 space-x-3">
            {article.byline && <span>{article.byline}</span>}
            {article.byline && article.publishedDate && <span>&middot;</span>}
            {article.publishedDate && <span>{article.publishedDate}</span>}
          </div>
        )}
        {article.siteName && (
          <div className="text-xs text-gray-400 mt-1">{article.siteName}</div>
        )}
      </header>

      <div
        className="article-body article-columns"
        style={bodyStyle}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </article>
  );
}
