// URL Bar Title — shows the current tab's title in the URL bar.
// Hover -> real URL, click/focus -> normal full-URL editing.

(async () => {
  if (window.delayedStartupPromise) {
    await window.delayedStartupPromise;
  }

  // <moz-urlbar> builds its inner markup lazily; wait for the input to exist.
  let urlbar, input;
  for (let i = 0; i < 100; i++) {
    urlbar = document.getElementById("urlbar");
    input = urlbar?.querySelector(".urlbar-input");
    if (input) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!urlbar || !input || document.getElementById("uc-urlbar-title")) return;
  console.log("[urlbar-title] loaded");

  const overlay = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
  overlay.id = "uc-urlbar-title";
  input.after(overlay);

  const update = () => {
    const tab = gBrowser.selectedTab;
    const title = tab?.label?.trim() || "";
    const proxyValid = urlbar.getAttribute("pageproxystate") === "valid";
    const hasUrl = !!input.value;

    if (title && proxyValid && hasUrl) {
      overlay.textContent = title;
      urlbar.setAttribute("uc-show-title", "true");
    } else {
      urlbar.removeAttribute("uc-show-title");
    }
  };

  // Tab switched or a tab's title changed.
  gBrowser.tabContainer.addEventListener("TabSelect", update);
  gBrowser.tabContainer.addEventListener("TabAttrModified", (e) => {
    if (e.target === gBrowser.selectedTab) update();
  });

  // Navigation in the current tab.
  const progressListener = {
    onLocationChange() { update(); },
    QueryInterface: ChromeUtils.generateQI([
      "nsIWebProgressListener",
      "nsISupportsWeakReference",
    ]),
  };
  gBrowser.addProgressListener(progressListener);

  // URL bar state changes (typing makes pageproxystate "invalid", etc.).
  new MutationObserver(update).observe(urlbar, {
    attributes: true,
    attributeFilter: ["pageproxystate", "focused"],
  });
  input.addEventListener("blur", () => setTimeout(update, 0));

  window.addEventListener("unload", () => {
    gBrowser.removeProgressListener(progressListener);
  }, { once: true });

  update();
})();
