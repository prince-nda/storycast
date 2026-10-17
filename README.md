# StoryCast

An accessible microsite that showcases short stories from real people, as video and audio.
Built with **semantic HTML5, Sass compiled to plain CSS, and a little vanilla JavaScript**. No frameworks, no UI libraries, no client-side templating.

| | |
|---|---|
| Home | `index.html` – intro, featured story, searchable/filterable grid of seven stories |
| Story (detail) | `story/*.html` – seven story pages, each with a player (YouTube embed, self-hosted video or audio), a transcript and related stories |
| About / Access | `about.html` – mission, editorial principles, accessibility commitments |

## Stories

| Story | Format | Category | Source |
|---|---|---|---|
| Where I Come From | Video (YouTube embed) | Culture | StoryCorps |
| Learning to Fly | Video (YouTube embed) | Nature | StoryCorps |
| Daddy's Lessons | Video (YouTube embed) | Culture | StoryCorps |
| Lola's Work | Video (YouTube embed) | People | StoryCorps |
| Star Bound | Video (YouTube embed) | People | StoryCorps |
| I Hear America Singing | Audio (self-hosted MP3) | People | Walt Whitman, read by Zach Meissner (LibriVox) |
| A Song Without Words | Silent video (self-hosted MP4) | Culture | Coverr-Free-Footage (Pixabay) |

## Design links

- Figma (sitemap, wireframes, high-fidelity mockups): <https://www.figma.com/design/xN0TxCKxJGeBxihTukHvuS/>
- Research document (PDF): `docs/` – _add `storycast-research.pdf` here before submitting (the folder does not exist yet)_

## Project structure

The website lives in the `storycast/` folder of this repository.

```
storycast/
├── index.html                 Home
├── about.html                 About / Access
├── story/                     One HTML file per story
│   ├── where-i-come-from.html
│   ├── learning-to-fly.html
│   ├── daddys-lessons.html
│   ├── lolas-work.html
│   ├── star-bound.html
│   ├── i-hear-america-singing.html   Audio story with timed transcript
│   └── a-song-without-words.html     Self-hosted silent video with described captions
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
├── js/main.js                 Vanilla JS: Home-page filter + search, audio transcript follow-along
└── assets/
    ├── images/                Photographs (one per story + About page)
    ├── audio/                 i-hear-america-singing.mp3
    ├── video/                 a-song-without-words.mp4
    └── captions/              WebVTT files for the self-hosted media
```

### CSS architecture

- **Sass partials and tokens** – `_colors.scss`, `_typography.scss` and `_spacing.scss` hold every design value once. `_tokens.scss` turns them into CSS custom properties (`--color-primary`, `--space-4`, …) so components never repeat raw values.
- **BEM naming** – `block__element--modifier`, for example `.card__title`, `.site-nav__link--active`, `.button--light`.
- **Cascade layers** – `@layer reset, tokens, base, layout, components, utilities;` is declared first in `_layers.scss`, and every partial wraps its rules in its layer, so layer order decides conflicts rather than specificity or source order.
- **Responsive layout** – CSS Grid for the story grid and About sections, Flexbox for the header, filters and card internals, media queries for page-level changes, fluid type with `clamp()`.
- **Container query component** – `.card-cell` is the size container (`container: story-card / inline-size`). Inside it, `.card` stacks image-over-text, and at **480px (30rem) or wider** switches to image-left/text-right (`@container story-card (min-width: 30rem)` in `components/_card.scss`). On a viewport of roughly 480–700px the grid becomes one column, so the horizontal card appears; on desktop the same card stays stacked in the narrow grid cells.

### JavaScript

`js/main.js` is progressive enhancement only. It contains two small, independent scripts:

- **Home-page filter and search** – category chips (`All stories`, `Culture`, `People`, `Nature`) and a live search box filter the story grid. The featured story's duplicate card stays hidden until the visitor starts filtering or searching. A `role="status"` message announces how many stories are showing.
- **Transcript follow-along** (audio story page) – highlights the line being read in *I Hear America Singing*, using the `data-start` / `data-end` times stored on each transcript line. It is purely visual; the transcript works without JavaScript.

## Run locally

The compiled CSS is committed, so you can open the site without installing anything:

1. From the `storycast/` folder, open `index.html` in a browser, **or** serve the folder, for example `python3 -m http.server 8000` and visit <http://localhost:8000>.

To change the styles (needs Node.js):

```bash
cd storycast
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
| **Captions for all media** | The five StoryCorps stories are YouTube videos loaded with captions on by default (`cc_load_policy=1`); the CC button in the player changes language or turns them off. Embedded players cannot take a `<track>` element, so those captions come from YouTube. The self-hosted media use `<track kind="captions">` with WebVTT files in `assets/captions/`: *A Song Without Words* has cues that describe what is on screen, and *I Hear America Singing* has timed text for the reading. |
| **Transcripts** | Every story page has a "Read the transcript" `<details open>` section directly below the player. The five StoryCorps pages carry the full conversation with speaker names; *I Hear America Singing* carries the poem line by line; *A Song Without Words* carries a written visual description because the clip has no speech or sound. |
| **Audio follow-along** | On *I Hear America Singing*, the line being read is highlighted as the audio plays (browsers do not show captions on audio-only players, so the transcript does that job). |
| **Silent media** | *A Song Without Words* states clearly that the clip has no sound, and gives both described captions and a text description of the visuals. |
| **Media controls** | Native `<audio>` and `<video>` controls and YouTube's player are keyboard operable; the iframe has a descriptive `title`, loads lazily, and nothing autoplays. |
| **Text alternatives** | Every image has descriptive `alt` text; captions state that photographs are stand-ins and not taken from the media. Decorative icons are `aria-hidden="true"`. |
| **Colour contrast** | Body text 14.7:1, secondary text 6.6:1, links/accents 6.4:1, light text on the dark footer 13.2:1, focus ring 7.1:1 (all ≥ 4.5:1 text / 3:1 UI). Values are documented in `sass/_colors.scss`. |
| **Visible focus** | Global `:focus-visible` 3px outline in the ring colour with an offset (`sass/_base.scss`); inverted on dark surfaces; story cards show the ring around the whole card. |
| **Keyboard navigation** | All controls are native links, buttons and inputs, in a logical order. Each card is one link (title link stretched over the card). |
| **ARIA only where needed** | `aria-current="page"` on the active nav link, `aria-pressed` on filter buttons, `role="search"` on the search form, `role="status"` on the live result count, `aria-labelledby` on sections and the player, `aria-describedby` linking players to their notes. |
| **Works without JavaScript** | All stories, links, captions and transcripts work with JS off; JS only adds filtering, search and the audio highlight. |
| **Responsive and zoomable** | Fluid grid, `clamp()` type and relative units; layouts reflow at narrow widths. _Test at 320px and 200% zoom in your browser before submitting._ |
| **Reduced motion** | Transitions are minimal and are disabled under `prefers-reduced-motion`. |
| **Language** | `lang="en"` on every page. |

> Honest note: this prototype follows WCAG 2.1 AA practices but has not been independently audited or certified.

## Content and credits

### StoryCorps videos (embedded from YouTube, © StoryCorps)

| Story | Video |
|---|---|
| Where I Come From | <https://www.youtube.com/watch?v=nXFBAcGf0Rs> |
| Learning to Fly | <https://www.youtube.com/watch?v=EpjM-0j5lAg> |
| Daddy's Lessons | <https://www.youtube.com/watch?v=-sxNQWdO0LU> |
| Lola's Work | <https://www.youtube.com/watch?v=IjUNzsBK5gM> |
| Star Bound | <https://www.youtube.com/watch?v=HWaxuNyHwX0> |

The videos are shown through YouTube's embedded player (`youtube-nocookie.com`). They are not downloaded, hosted or altered. The transcripts on these pages were written out from the videos; titles, one-line descriptions and transcripts should be checked against the actual videos before submitting.

### Self-hosted media

| File | Story | Source and licence |
|---|---|---|
| `assets/audio/i-hear-america-singing.mp3` | I Hear America Singing | Read by Zach Meissner for [LibriVox](https://librivox.org/short-poetry-collection-119/) (Short Poetry Collection 119). Poem by Walt Whitman. Public domain in the USA. |
| `assets/video/a-song-without-words.mp4` | A Song Without Words | "Guitarist, Acoustic Guitar" by Coverr-Free-Footage on [Pixabay](https://pixabay.com/videos/guitarist-acoustic-guitar-139/), used under the [Pixabay Content License](https://pixabay.com/service/license-summary/). |
| `assets/captions/*.vtt` | Both | Written for StoryCast. |

### Photographs

Photographs are stand-in images chosen to accompany each story; they are not taken from the media.

| File | Used for | Source / photographer / licence |
|---|---|---|
| `where-i-come-from.jpg` | Where I Come From, featured story | Pinterest|
| `learning-to-fly.jpg` | Learning to Fly | Google |
| `daddys-lessons.jpg` | Daddy's Lessons | Google |
| `lolas-work.jpg` | Lola's Work | Pinterest |
| `star-bound.jpg` | Star Bound | Google|
| `poem-guy (1).jpg` | I Hear America Singing | Pinterest |
| `a-song-without-words.jpg` | A Song Without Words (video poster) | Pinterest|
| `studio_photo.JPG` | About page | Pinterest |