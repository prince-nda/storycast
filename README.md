# StoryCast

A 3-page accessible microsite that showcases short video stories from real people.
Built with **semantic HTML5, Sass compiled to plain CSS, and a little vanilla JavaScript**. No frameworks, no UI libraries, no client-side templating.

| | |
|---|---|
| Home | `index.html` – intro, featured story, searchable/filterable story grid |
| Story (detail) | `story/*.html` – five story pages with the embedded video, transcript section and related stories |
| About / Access | `about.html` – mission, editorial principles, accessibility commitments |

## Design links

- Figma (sitemap, wireframes, high-fidelity mockups): <https://www.figma.com/design/xN0TxCKxJGeBxihTukHvuS/>
- Research document (PDF): `docs/` – _add `storycast-research.pdf` here before submitting_

## Project structure

```
storycast/
├── index.html                 Home
├── about.html                 About / Access
├── story/                     One HTML file per story
│   ├── where-i-come-from.html
│   ├── learning-to-fly.html
│   ├── daddys-lessons.html
│   ├── lolas-work.html
│   └── star-bound.html
├── sass/                      Source styles
│   ├── main.scss              Entry point (imports everything below)
│   ├── _layers.scss           Cascade layer order
│   ├── _colors.scss           Colour tokens
│   ├── _typography.scss       Font stacks and type scale
│   ├── _spacing.scss          Spacing, radius, layout and breakpoint tokens
│   ├── _tokens.scss           Tokens exposed as CSS custom properties
│   ├── _reset.scss  _base.scss  _layout.scss  _utilities.scss
│   └── components/            One partial per BEM block
│       ├── _site-header  _site-footer  _skip-link  _eyebrow  _button
│       ├── _intro (page intro + featured story)  _collection  _card
│       └── _detail (story page, player, transcript)  _about
├── css/main.css               Compiled stylesheet (committed so the site runs without a build)
├── js/main.js                 Vanilla JS: Home-page filter + search
├── assets/
│   ├── images/                Photographs (one per story + About page)
│   └── transcripts/           Notes for adding each story's transcript
└── docs/                      Research PDF, sitemap and IA documentation
```

### CSS architecture

- **Sass partials and tokens** – `_colors.scss`, `_typography.scss` and `_spacing.scss` hold every design value once. `_tokens.scss` turns them into CSS custom properties (`--color-primary`, `--space-4`, …) so components never repeat raw values.
- **BEM naming** – `block__element--modifier`, for example `.card__title`, `.site-nav__link--active`, `.button--light`.
- **Cascade layers** – `@layer reset, tokens, base, layout, components, utilities;` is declared first in `_layers.scss`, and every partial wraps its rules in its layer, so layer order decides conflicts rather than specificity or source order.
- **Responsive layout** – CSS Grid for the story grid and About sections, Flexbox for the header, filters and card internals, media queries for page-level changes, fluid type with `clamp()`.
- **Container query component** – `.card-cell` is the size container (`container: story-card / inline-size`). Inside it, `.card` stacks image-over-text, and at **480px (30rem) or wider** switches to image-left/text-right (`@container story-card (min-width: 30rem)` in `components/_card.scss`). On a viewport of roughly 480–700px the grid becomes one column, so the horizontal card appears; on desktop the same card stays stacked in the narrow grid cells.

## Run locally

The compiled CSS is committed, so you can open the site without installing anything:

1. Open `index.html` in a browser, **or** serve the folder, for example `python3 -m http.server 8000` and visit <http://localhost:8000>.

To change the styles (needs Node.js):

```bash
npm install            # installs Sass, the only dev dependency
npm run build          # compiles sass/main.scss -> css/main.css
npm run watch          # recompiles on every save
npm run build:min      # compressed build for production
```

Sass is a build tool only; the browser loads ordinary CSS. The page fonts (DM Serif Display and DM Sans) load from Google Fonts and fall back to Georgia and system sans-serif when offline.

## Accessibility checklist (WCAG 2.1 AA)

| Requirement | How it is met |
|---|---|
| **Semantic structure** | `header`, `nav`, `main`, `article`, `section`, `aside`, `figure`/`figcaption`, `footer`, `details`/`summary`, lists for lists. One `h1` per page and no skipped heading levels. |
| **Landmarks and skip link** | Every page starts with a "Skip to main content" link to `#main-content`; navigation landmarks have `aria-label`s (`Main`, `Footer`). |
| **Captions for all media** | Each story is a YouTube video loaded with captions on by default (`cc_load_policy=1`); the CC button in the player changes language or turns them off. Embedded players cannot take a `<track>` element, so captions come from YouTube. |
| **Transcripts** | Every story page has a "Read the transcript" `<details open>` section directly below the video. **Transcripts still need to be pasted in** (see `assets/transcripts/README.txt`); until then the section explains how to open YouTube's transcript. |
| **Media controls** | YouTube's player is keyboard operable; the iframe has a descriptive `title`, loads lazily, and nothing autoplays. |
| **Text alternatives** | Every image has descriptive `alt` text; captions state that photographs are stand-ins and not taken from the videos. Decorative icons are `aria-hidden="true"`. |
| **Colour contrast** | Body text 14.7:1, secondary text 6.6:1, links/accents 6.4:1, light text on the dark footer 13.2:1, focus ring 7.1:1 (all ≥ 4.5:1 text / 3:1 UI). Values are documented in `sass/_colors.scss`. |
| **Visible focus** | Global `:focus-visible` 3px outline in the ring colour with an offset (`sass/_base.scss`); inverted on dark surfaces; story cards show the ring around the whole card. |
| **Keyboard navigation** | All controls are native links, buttons and inputs, in a logical order. Each card is one link (title link stretched over the card). |
| **ARIA only where needed** | `aria-current="page"` on the active nav link, `aria-pressed` on filter buttons, `role="search"` on the search form, `role="status"` on the live result count, `aria-labelledby` on sections and the player. |
| **Works without JavaScript** | All stories, links, captions and transcripts work with JS off; JS only adds filtering and search. |
| **Responsive and zoomable** | Fluid grid, `clamp()` type and relative units; layouts reflow at narrow widths. _Test at 320px and 200% zoom in your browser before submitting._ |
| **Reduced motion** | Transitions are minimal and are disabled under `prefers-reduced-motion`. |
| **Language** | `lang="en"` on every page. |

> Honest note: this prototype follows WCAG 2.1 AA practices but has not been independently audited or certified.

## Content and credits

### Videos (embedded from YouTube, © StoryCorps)

| Story | Video |
|---|---|
| Where I Come From | <https://www.youtube.com/watch?v=nXFBAcGf0Rs> |
| Learning to Fly | <https://www.youtube.com/watch?v=EpjM-0j5lAg> |
| Daddy's Lessons | <https://www.youtube.com/watch?v=-sxNQWdO0LU> |
| Lola's Work | <https://www.youtube.com/watch?v=IjUNzsBK5gM> |
| Star Bound | <https://www.youtube.com/watch?v=HWaxuNyHwX0> |

The videos are shown through YouTube's embedded player (`youtube-nocookie.com`). They are not downloaded, hosted or altered. Titles and one-line descriptions on the pages should be checked against the actual videos.

### Photographs

Photographs are stand-in images chosen to accompany each story; they are not taken from the videos.

| File | Used for | Source / photographer / licence |
|---|---|---|
| `where-i-come-from.jpg` | Where I Come From, featured story | _add credit_ |
| `learning-to-fly.jpg` | Learning to Fly | _add credit_ |
| `daddys-lessons.jpg` | Daddy's Lessons | _add credit_ |
| `lolas-work.jpg` | Lola's Work | _add credit (the supplied copy carries a rawpixel watermark – use a licensed, unwatermarked version)_ |
| `star-bound.jpg` | Star Bound | _add credit_ |
| `about-studio.jpg` | About page | _add credit_ |
