import { savePageData } from "./storage";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "TRIGGER_EXTRACT") {
    return false;
  }

  handleExtract()
    .then((result) => sendResponse(result))
    .catch((err) => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      sendResponse({ error: errorMessage });
    });

  return true; // keep the message channel open for async response
});

async function handleExtract(): Promise<{ success: true } | { error: string }> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !tab.url) {
    return { error: "No active tab found." };
  }

  // Grab the page HTML directly via executeScript — no content script needed
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.documentElement.outerHTML,
  });

  const html = results?.[0]?.result;
  if (!html) {
    return { error: "Could not read page content. Try refreshing the page." };
  }

  await savePageData({ html, url: tab.url });
  await chrome.tabs.create({ url: chrome.runtime.getURL("tabs/print.html") });

  return { success: true };
}
