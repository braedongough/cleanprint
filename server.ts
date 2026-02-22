import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import type { ArticleImage } from "./src/types";

import homepage from "./public/index.html";

interface ExtractResult {
  title: string;
  byline: string | null;
  siteName: string | null;
  publishedDate: string | null;
  content: string;
  textContent: string;
  excerpt: string;
  length: number;
  images: ArticleImage[];
}

function extractImages(html: string): ArticleImage[] {
  const dom = new JSDOM(html);
  const imgs = dom.window.document.querySelectorAll("img");
  const images: ArticleImage[] = [];

  for (const img of imgs) {
    const src = img.getAttribute("src");
    if (src) {
      images.push({ src, alt: img.getAttribute("alt") || "" });
    }
  }

  return images;
}

function parseWithReadability(html: string, url?: string): ExtractResult {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error("Could not extract article content from the page.");
  }

  const images = extractImages(article.content);

  return {
    title: article.title,
    byline: article.byline,
    siteName: article.siteName,
    publishedDate: article.publishedDate,
    content: article.content,
    textContent: article.textContent,
    excerpt: article.excerpt,
    length: article.length,
    images,
  };
}

async function handleExtract(req: Request): Promise<Response> {
  const body = await req.json();
  const { url } = body as { url: string };

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const html = await response.text();
    const result = parseWithReadability(html, url);

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

async function handleExtractHtml(req: Request): Promise<Response> {
  const body = await req.json();
  const { html } = body as { html: string };

  if (!html) {
    return Response.json({ error: "HTML content is required" }, { status: 400 });
  }

  try {
    const result = parseWithReadability(html);
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

const port = Number(process.env.PORT) || 3000;

Bun.serve({
  port,
  routes: {
    "/": homepage,
    "/api/extract": { POST: handleExtract },
    "/api/extract-html": { POST: handleExtractHtml },
  },
  development: !process.env.PORT,
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Clean Print server running on port ${port}`);
