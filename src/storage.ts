import type { PrintSettings } from "./types";
import { defaultSettings } from "./types";

const PAGE_KEY = "cleanprint_page";
const SETTINGS_KEY = "cleanprint_settings";

export interface RawPageData {
  html: string;
  url: string;
}

interface SerializedSettings extends Omit<PrintSettings, "excludedImages"> {
  excludedImages: string[];
}

function serializeSettings(settings: PrintSettings): SerializedSettings {
  return {
    ...settings,
    excludedImages: Array.from(settings.excludedImages),
  };
}

function deserializeSettings(data: SerializedSettings): PrintSettings {
  return {
    ...data,
    excludedImages: new Set(data.excludedImages),
  };
}

export async function savePageData(data: RawPageData): Promise<void> {
  await chrome.storage.local.set({ [PAGE_KEY]: data });
}

export async function loadPageData(): Promise<RawPageData | null> {
  const result = await chrome.storage.local.get(PAGE_KEY);
  return (result[PAGE_KEY] as RawPageData) ?? null;
}

export async function saveSettings(settings: PrintSettings): Promise<void> {
  await chrome.storage.local.set({
    [SETTINGS_KEY]: serializeSettings(settings),
  });
}

export async function loadSettings(): Promise<PrintSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  const data = result[SETTINGS_KEY] as SerializedSettings | undefined;
  if (!data) {
    return defaultSettings;
  }
  return deserializeSettings(data);
}
