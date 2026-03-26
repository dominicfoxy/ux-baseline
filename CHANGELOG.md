# Changelog

## 2026-03-26 (9)

- Added `icon-source/make_icon.py` — generates 512×512 app icon (Syne ExtraBold, amber "UX" on dark bg, accent-dim baseline rule)
- Added `icon-source/Syne-ExtraBold.ttf` (downloaded from Google Fonts CDN)
- Added `icon-source/icon-512.png` — source icon
- Generated all platform icon variants via `cargo tauri icon`: `.icns`, `.ico`, `.png` (32/64/128/256), Windows Appx tiles, iOS/Android sizes

## 2026-03-26 (8)

- Deleted template assets: `src/assets/hero.png`, `src/assets/vite.svg`, `public/favicon.svg`, `public/icons.svg` — none were referenced
- Deleted template `README.md`
- `package.json`: name `uxtest` → `ux-baseline`, version `0.0.0` → `1.0.0`

## 2026-03-26 (7)

- Removed unused Rust deps: `serde`, `serde_json`, `log`, `tauri-plugin-log`
- Removed mobile entry point attribute (not targeting mobile)
- Cleaned up Cargo.toml metadata (name, description, removed placeholder fields)

## 2026-03-26 (6)

- Removed `isDirty` entirely — this demo has no file-backed state to protect, so the feature was unnecessary and caused window-close bugs
- Removed window close interceptor, unsaved-changes modal, and `● unsaved` status bar indicator
- Removed `setDirty` from store, FormsPage, and all call sites

## 2026-03-26 (5)

- Fixed window close bug: `isDirty` was being persisted by Zustand, so a `true` value from a previous session would block every future close attempt — excluded it from persistence via `partialize`
- Fixed close race condition: added `forceCloseRef` so Discard/Save & Close bypass the `onCloseRequested` handler synchronously, preventing the old closure (which still sees `isDirty: true`) from re-intercepting the programmatic close
- Store v3: migration explicitly deletes stale `isDirty` key from localStorage (v2 migration didn't purge it, so old `isDirty: true` was still hydrated)
- `onCloseRequested` now only registered when `isDirty` is true — no handler means Tauri's default close is used, which is more reliable on Linux

## 2026-03-26 (4)

- Default `uiScale` bumped from 1.0 → 1.2; store migrated to v2 (existing installs at 1.0 auto-upgrade)
- Default window size bumped to 1280×820, min 960×600

## 2026-03-26 (3)

- `OverlaysPage`: expanded Connection Status section — each state card now has a description of when it fires; added note about resetting to idle on URL change; live demo notes that it's a real TCP probe; Test button disabled while testing
- `OverlaysPage`, `FormsPage`: italic description/hint text changed from `--text-muted` to `--text-secondary` for legibility
- `CLAUDE.md`: Field Pattern hint color corrected to `--text-secondary`; DirField updated to reference `@tauri-apps/plugin-dialog` instead of old invoke stub
- Rule: `--text-muted` is for micro-labels and decorative metadata only — readable paragraph/hint text uses `--text-secondary`
- Applied same fix to all remaining italic `text-muted` instances across ComponentsPage (6), OverviewPage (4), and SettingsPage (4)

## 2026-03-26 (2)

- Added `tauri-plugin-dialog` and `tauri-plugin-fs` to Cargo.toml and registered in lib.rs
- Added `test_connection` Tauri command — TCP probe to host:port parsed from URL, no reqwest required
- Added `dialog:default` and `fs:default` to capabilities/default.json
- Installed `@tauri-apps/plugin-dialog` and `@tauri-apps/plugin-fs` npm packages
- `App.tsx`: real theme file loading via `readTextFile` with JSON merge; falls back to built-in on error
- `App.tsx`: window close event handler — intercepts close when `isDirty`, shows unsaved-changes modal with Cancel / Discard / Save & Close
- `FormsPage`: DirField now uses real `open({ directory: true })` native folder picker
- `SettingsPage`: theme file Browse now uses real `open({ filters: [json] })` native file picker
- `ComponentsPage`: DirField demo wired up with real native folder picker
- `ComponentsPage`: Dropdown now has full arrow-key navigation (↑↓ to move, Enter to select, Escape to close), mouseEnter syncs focus index, outside-click closes via document mousedown listener
- `OverlaysPage`: connection test uses real `invoke("test_connection")` instead of random timeout; URL input is controlled state so the live value is used

## 2026-03-26

- Fixed nav active label color: was `var(--text-primary)`, corrected to `var(--accent-bright)` per spec
- Fixed `App.tsx` theme `useEffect`: added `themeFile` to destructuring and deps array `[activeTheme, themeFile]`; restructured to show correct built-in + custom merge pattern with Tauri stub comment
- Fixed CLAUDE.md typo: "four global CSS classes" → "five"
- Initial build: UX Baseline demo app — five-page design system reference (Overview, Components, Forms, Banners & Overlays, Settings) with full theme system, EZ Mode, Zustand persistence, and status bar
