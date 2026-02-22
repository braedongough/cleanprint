import type { ArticleImage } from "../types";

interface ImageToggleProps {
  image: ArticleImage;
  included: boolean;
  onToggle: () => void;
}

export function ImageToggle({ image, included, onToggle }: ImageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 w-full p-2 rounded-md border text-left transition-opacity ${
        included ? "border-gray-300 opacity-100" : "border-gray-200 opacity-40"
      }`}
    >
      <input
        type="checkbox"
        checked={included}
        onChange={onToggle}
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <img
        src={image.src}
        alt={image.alt}
        className="w-12 h-12 object-cover rounded shrink-0"
        loading="lazy"
      />
      <span className="text-xs text-gray-600 truncate">
        {image.alt || image.src.split("/").pop() || "Image"}
      </span>
    </button>
  );
}
