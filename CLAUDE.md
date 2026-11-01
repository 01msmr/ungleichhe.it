# ungleichhe.it
> Governed by **CLAUDE MASTER** (`../CLAUDE.md`). Rules here extend it; they do not override it.

Statisches Dashboard zur Einkommensungleichheit in Deutschland.
Vanilla JS + D3 (CDN), kein Build-Schritt, keine Abhängigkeiten außer D3.

## Regeln
- Kein Bundle, kein Framework — Browser lädt `app.js`, `data.js`, `styles.css` direkt.
- Datenbasis in `data.js` — Quellen im Code oder Kommentar nennen.
- Kein D3-Upgrade ohne manuelle Prüfung aller Charts.
