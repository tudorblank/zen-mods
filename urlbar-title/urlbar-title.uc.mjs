// URL Bar Title: shows the tab title in the URL bar.

(async () => {
  if (window.delayedStartupPromise) {
    await window.delayedStartupPromise;
  }

  // moz-urlbar builds its markup lazily
  let urlbar, input;
  for (let i = 0; i < 100; i++) {
    urlbar = document.getElementById("urlbar");
    input = urlbar?.querySelector(".urlbar-input");
    if (input) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!urlbar || !input || document.getElementById("uc-urlbar-title")) return;

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

  gBrowser.tabContainer.addEventListener("TabSelect", update);
  gBrowser.tabContainer.addEventListener("TabAttrModified", (e) => {
    if (e.target === gBrowser.selectedTab) update();
  });

  const progressListener = {
    onLocationChange() { update(); },
    QueryInterface: ChromeUtils.generateQI([
      "nsIWebProgressListener",
      "nsISupportsWeakReference",
    ]),
  };
  gBrowser.addProgressListener(progressListener);

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
