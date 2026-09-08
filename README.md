# Certification Practice Decks

Free, exam-style practice decks for certification exams — timed drill sessions,
flashcards, and progress tracking, all client-side (no backend, progress lives
in `localStorage`). Built to be published as a static site on GitHub Pages.

## Structure

```
/
├─ index.html            Landing page — lets the user pick a certification
├─ assets/
│  └─ theme.css           Shared design tokens (colors, fonts, base reset)
├─ certs/
│  ├─ manifest.json       List of published decks, shown on the landing page
│  └─ <cert-id>.json      One file per certification (data contract below)
└─ app/
   └─ quiz.html            The generic quiz engine — reads ?cert=<id> and
                            renders whatever deck it finds; no cert-specific
                            code lives here
```

## How it works

1. `index.html` fetches `certs/manifest.json` and renders one card per
   certification.
2. Clicking a card opens `app/quiz.html?cert=<id>`.
3. `quiz.html` fetches `certs/<id>.json`, uses it to set the page title,
   heading, footer note, and pass mark, and builds the question pool from
   `cards`/`domains`. Progress is saved under a per-deck localStorage key
   (`meta.lsKey`), so each certification's progress is independent.

## Adding a new certification

Create `certs/<new-id>.json` following this contract, then add an entry to
`certs/manifest.json`. No changes to `app/quiz.html` or `index.html` are
needed.

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
    "officialGuideUrl": "https://…",
    "footNote": "…HTML string, shown at the bottom of the Progress tab…"
  },
  "domains": {
    "domainKey": { "label": "…", "weight": "40–45%", "topics": { "topicKey": "Topic name" } }
  },
  "cards": [
    { "id": "…", "d": "domainKey", "t": "topicKey",
      "q": "…", "o": ["correct answer first", "…", "…", "…"], "a": 0,
      "s": "short verdict", "e": "explanation" }
  ]
}
```

Multiple-choice cards use `o`/`a` (options, with the correct one always
listed **first** — the UI shuffles display order at runtime). Dropdown
("select the right answer per row") cards instead use `type:"combo"` with a
`rows` array; see any existing entry in `certs/ai-901.json` for the exact
shape.

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
