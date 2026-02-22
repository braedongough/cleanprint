import type { ArticleImage, FontFamily, PrintSettings } from "../types";
import { ImageToggle } from "./ImageToggle";

interface SettingsSidebarProps {
  settings: PrintSettings;
  images: ArticleImage[];
  onSettingsChange: (settings: PrintSettings) => void;
  onBack: () => void;
}

const fonts: FontFamily[] = [
  "Georgia",
  "Garamond",
  "Libre Baskerville",
  "Source Serif Pro",
  "Charter",
];

export function SettingsSidebar({ settings, images, onSettingsChange, onBack }: SettingsSidebarProps) {
  function updateSetting<K extends keyof PrintSettings>(key: K, value: PrintSettings[K]) {
    onSettingsChange({ ...settings, [key]: value });
  }

  function toggleImage(src: string) {
    const next = new Set(settings.excludedImages);
    if (next.has(src)) {
      next.delete(src);
    } else {
      next.add(src);
    }
    onSettingsChange({ ...settings, excludedImages: next });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          &larr; Back
        </button>
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
        <select
          value={settings.fontFamily}
          onChange={(e) => updateSetting("fontFamily", e.target.value as FontFamily)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {fonts.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size: {settings.fontSize}pt
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateSetting("fontSize", Math.max(10, settings.fontSize - 1))}
            disabled={settings.fontSize <= 10}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-40"
          >
            &minus;
          </button>
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 relative">
            <div
              className="bg-gray-600 h-1.5 rounded-full"
              style={{ width: `${((settings.fontSize - 10) / 6) * 100}%` }}
            />
          </div>
          <button
            onClick={() => updateSetting("fontSize", Math.min(16, settings.fontSize + 1))}
            disabled={settings.fontSize >= 16}
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Columns */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
        <div className="flex gap-2">
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => updateSetting("columns", n)}
              className={`flex-1 py-2 text-sm rounded-md border ${
                settings.columns === n
                  ? "bg-gray-800 text-white border-gray-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {n} columns
            </button>
          ))}
        </div>
      </div>

      {/* Show Author/Date */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Show author & date</span>
        <button
          onClick={() => updateSetting("showAuthorDate", !settings.showAuthorDate)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            settings.showAuthorDate ? "bg-gray-800" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
              settings.showAuthorDate ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images ({images.length - settings.excludedImages.size}/{images.length})
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {images.map((img) => (
              <ImageToggle
                key={img.src}
                image={img}
                included={!settings.excludedImages.has(img.src)}
                onToggle={() => toggleImage(img.src)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Print Button */}
      <button
        onClick={() => window.print()}
        className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
      >
        Print Article
      </button>
    </div>
  );
}
