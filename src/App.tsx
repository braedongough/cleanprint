import { useState } from "react";
import { useArticle } from "./hooks/useArticle";
import { InputScreen } from "./components/InputScreen";
import { ArticlePreview } from "./components/ArticlePreview";
import { SettingsSidebar } from "./components/SettingsSidebar";
import type { PrintSettings } from "./types";
import { defaultSettings } from "./types";

export function App() {
  const { article, loading, error, fetchArticle, fetchFromHtml, reset } = useArticle();
  const [settings, setSettings] = useState<PrintSettings>(defaultSettings);

  if (!article) {
    return (
      <InputScreen
        loading={loading}
        error={error}
        onFetchUrl={fetchArticle}
        onFetchHtml={fetchFromHtml}
      />
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
          onSettingsChange={setSettings}
          onBack={reset}
        />
      </aside>
    </div>
  );
}
