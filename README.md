# Zen mods

Small mods for [Zen Browser](https://zen-browser.app), installable with [Sine](https://github.com/CosmoCreeper/Sine).

| Mod | What it does |
| --- | --- |
| [`urlbar-title`](urlbar-title) | Shows the tab's title in the URL bar. Hover to see the real URL; click to edit the full URL. Text is centered. **(JavaScript)** |
| [`glass-compact`](glass-compact) | Makes the compact-mode sidebar/top toolbar and the floating search popup translucent, with the page blurred behind them. |
| [`glass-edges`](glass-edges) | macOS-style glassy outlines on tabs, Essentials, toolbar/sidebar buttons and the URL bar. |
| [`zen-logo-menu`](zen-logo-menu) | Replaces the toolbar's "..." menu button with the Zen logo. |

## Install

In Zen, open **Settings → Sine**, paste one of these into the marketplace / "install from GitHub" box, and press install:

```
<your-github-username>/zen-mods/tree/main/urlbar-title
<your-github-username>/zen-mods/tree/main/glass-compact
<your-github-username>/zen-mods/tree/main/glass-edges
<your-github-username>/zen-mods/tree/main/zen-logo-menu
```

Restart Zen afterwards.

**`urlbar-title` is a JavaScript mod.** Sine only runs JavaScript from mods outside its store when
**"Allow external JS"** is enabled in Sine's settings (pref `sine.allow-unsafe-js`). The other mods
are CSS only and need nothing extra.

## Tweaking

- **glass-compact**: `--glass-opacity`, `--glass-blur`, `--glass-popup-opacity`, `--glass-popup-blur` at the top of its `userChrome.css`.
- **glass-edges**: `--ge-strength` (0 = off, 1 = default). The edge on the compact sidebar's body is off by default; set the
  `about:config` pref `glass-edges.compact-sidebar-body` to `true` to turn it on.
- **urlbar-title**: to center text only when not editing, change `#urlbar-input { text-align: center }` to
  `#urlbar:not([focused]) #urlbar-input { text-align: center }`.

## Notes

- The page blur in `glass-compact` puts the web page on its own composited layer while a glass surface is open, so
  `backdrop-filter` can see it (otherwise it only blurs over Zen's own pages like Settings). This technique comes from
  [Floaty UI](https://github.com/moktavizen) and [Zia](https://github.com/z1n-k/zia). It can make HDR video look washed out
  while the sidebar or popup is open.
- Built and tested against Zen 1.24.1b (Firefox 159).
