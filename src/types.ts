export interface ArticleImage {
  src: string;
  alt: string;
}

export interface ArticleData {
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

export type FontFamily =
  | "Georgia"
  | "Garamond"
  | "Libre Baskerville"
  | "Source Serif Pro"
  | "Charter";

export interface PrintSettings {
  fontFamily: FontFamily;
  fontSize: number;
  columns: 2 | 3;
  showAuthorDate: boolean;
  excludedImages: Set<string>;
}

export const defaultSettings: PrintSettings = {
  fontFamily: "Georgia",
  fontSize: 12,
  columns: 2,
  showAuthorDate: true,
  excludedImages: new Set(),
};
