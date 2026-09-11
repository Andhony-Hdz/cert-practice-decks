# Certification Practice Decks

Free, exam-style practice decks for certification exams — timed drill sessions,
flashcards, and progress tracking, all client-side (no backend, progress lives
in `localStorage`). Built to be published as a static site on GitHub Pages.

## Structure

```
/
├─ index.html            Landing page — lets the user pick a certification
├─ assets/
│  ├─ theme.css           Shared design tokens (colors, fonts, base reset)
│  └─ theme.js            Light/dark theme toggle, shared by both pages
├─ certs/
│  ├─ manifest.json       List of published decks, shown on the landing page
│  └─ <cert-id>.json      One file per certification (data contract below)
└─ app/
   └─ quiz/
      └─ index.html        The generic quiz engine — reads ?cert=<id> and
                            renders whatever deck it finds; no cert-specific
                            code lives here. Lives in its own folder (rather
                            than app/quiz.html) so the URL has no .html —
                            GitHub Pages serves a folder's index.html for
                            free, same as it does for the site root.
```

## How it works

1. `index.html` fetches `certs/manifest.json` and renders one card per
   certification.
2. Clicking a card opens `app/quiz/?cert=<id>`.
3. `app/quiz/index.html` fetches `certs/<id>.json`, uses it to set the page title,
   heading, footer note, and pass mark, and builds the question pool from
   `cards`/`domains`. Progress is saved under a per-deck localStorage key
   (`meta.lsKey`), so each certification's progress is independent.

## Adding a new certification

Create `certs/<new-id>.json` following this contract, then add an entry to
`certs/manifest.json`. No changes to `app/quiz/index.html` or `index.html`
are needed.

The landing page only fetches `manifest.json` (not every deck's full JSON),
so a few fields — `code`, `title`, `description`, `cardCount`, `updated` —
are duplicated there for display. Keep them in sync with the matching deck's
`meta` whenever you edit questions; bump `updated` in both places so the
"Updated <month year>" shown on the landing card stays accurate. Set
`"status": "soon"` on a manifest entry to show it as a disabled "Coming soon"
card before its JSON exists.

Each manifest entry also takes a `categories` object — `platform`, `role`,
`level` — used for the search/filter bar and shown on the card itself (e.g.
"Azure · AI Engineer · Beginner"). `categories` is manifest-only; it doesn't
need to be duplicated into the deck's own `meta`. A filter row for a given
dimension (Platform/Role/Level) only appears once two or more distinct
values for it exist across all certs, so adding your first non-Azure cert
is what makes the Platform filter show up — no code change required.

```jsonc
{
  "meta": {
    "id": "az-900",                 // matches the filename
    "title": "AZ-900 Practice Deck", // used for <title>
    "examCode": "AZ-900",            // short form used in in-app copy
    "deckLabel": "AZ-900 Drill Deck",// shown as the page's H1
    "examName": "Azure Fundamentals",
    "description": "…",              // used for the meta description
    "lsKey": "az900.progress.v1",    // localStorage key (keep unique per deck)
    "passPct": 70,                   // pass mark, as a percentage
    "updated": "2026-09-07",         // last time the question bank changed (YYYY-MM-DD)
    "officialGuideUrl": "https://…",
    "footNote": "…HTML string, shown at the bottom of the Progress tab…"
  },
  "domains": {
    "domainKey": { "label": "…", "weight": "40–45%", "topics": { "topicKey": "Topic name" } }
  },
  "cards": [
    { "id": "…", "d": "domainKey", "t": "topicKey",
      "q": "…", "o": ["correct answer first", "…", "…", "…"], "a": 0,
      "s": "short verdict", "e": "explanation",
      "source": { "url": "https://learn.microsoft.com/…", "title": "Module name" } }
  ]
}
```

Multiple-choice cards use `o`/`a` (options, with the correct one always
listed **first** — the UI shuffles display order at runtime). Dropdown
("select the right answer per row") cards instead use `type:"combo"` with a
`rows` array; see any existing entry in `certs/ai-901.json` for the exact
shape. `source` is optional — when present, a "Learn more" link to the
official module/doc shows next to the "Report an issue" link under the
explanation. It's only populated today for cards pulled from Microsoft
Learn module knowledge checks (the "mq" ids); hand-authored cards don't
have one, which is fine — the link just doesn't render.

## Social share image

`assets/og-image.png` is the card shown when a link to the site is shared
(LinkedIn, Slack, Discord, Twitter/X, etc.) — referenced by `og:image` /
`twitter:image` on both the landing page and the quiz engine. It's one
generic image for the whole site (not per-certification).

Its source is `assets/og-image.html`, styled with the same dark-theme
tokens as `assets/theme.css` inlined for a self-contained render. To change
it, edit that file, then regenerate the PNG:

```
npm install --no-save playwright-chromium
node scripts/render-og-image.js
```

Link-preview bots cache aggressively per-URL — after changing the image (or
any OG/Twitter meta tag), force a re-crawl instead of waiting:
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/),
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Local development

Because the pages fetch JSON via `fetch()`, opening `index.html` directly
from disk (`file://`) will fail in most browsers — serve the folder instead,
e.g.:

```
npx serve .
```

## Deploying to GitHub Pages

This is a static site with no build step. Push to a GitHub repo, then enable
Pages on that repo pointing at the root of the default branch.
